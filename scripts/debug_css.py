#!/usr/bin/env python3
"""
Script para debuggear estilos CSS en el proyecto D&D Solitario.
Revisa archivos CSS, calcula contraste de colores y verifica sintaxis.
"""

import os
import re
import colorsys

def hex_to_rgb(hex_color):
    """Convierte color hex a RGB tuple."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_luminance(r, g, b):
    """Calcula luminancia relativa para contraste."""
    def adjust(c):
        c = c / 255.0
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * adjust(r) + 0.7152 * adjust(g) + 0.0722 * adjust(b)

def contrast_ratio(l1, l2):
    """Calcula ratio de contraste."""
    return (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)

def analyze_css_file(filepath):
    """Analiza un archivo CSS para variables de color y contraste."""
    print(f"\n=== Analizando {filepath} ===")

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Buscar variables CSS
    var_pattern = r'--([a-zA-Z-]+):\s*#([0-9a-fA-F]{6})'
    variables = re.findall(var_pattern, content)

    print(f"Encontradas {len(variables)} variables de color:")
    colors = {}
    for var_name, hex_color in variables:
        rgb = hex_to_rgb(hex_color)
        luminance = rgb_to_luminance(*rgb)
        colors[var_name] = {'hex': hex_color, 'rgb': rgb, 'luminance': luminance}
        print(f"  --{var_name}: #{hex_color} (RGB{rgb})")

    # Calcular contrastes importantes
    if 'ally-primary-bg' in colors and 'ally-text-color' in colors:
        bg_lum = colors['ally-primary-bg']['luminance']
        text_lum = colors['ally-text-color']['luminance']
        ratio = contrast_ratio(bg_lum, text_lum)
        print(f"\nContraste fondo aliado vs texto: {ratio:.2f}:1")
        if ratio < 4.5:
            print("  AVISO: CONTRASTE INSUFICIENTE (debe ser >=4.5:1 para texto normal)")
        else:
            print("  OK: Contraste adecuado")

    if 'monster-primary-bg' in colors and 'monster-text-color' in colors:
        bg_lum = colors['monster-primary-bg']['luminance']
        text_lum = colors['monster-text-color']['luminance']
        ratio = contrast_ratio(bg_lum, text_lum)
        print(f"\nContraste fondo monstruo vs texto: {ratio:.2f}:1")
        if ratio < 4.5:
            print("  AVISO: CONTRASTE INSUFICIENTE")
        else:
            print("  OK: Contraste adecuado")

        # Detalles específicos para monsters_card.css
        if 'monsters_card.css' in filepath:
            print("\nDetalles de variables CSS para monsters_card.css:")
            for var_name, data in colors.items():
                print(f"  {var_name}: {data['hex']} - Usado en: {', '.join(find_usage(var_name, content))}")

def find_usage(var_name, content):
    """Encuentra dónde se usa una variable CSS."""
    usages = []
    pattern = rf'var\(--{re.escape(var_name)}\)'
    matches = re.finditer(pattern, content)
    for match in matches:
        line_num = content[:match.start()].count('\n') + 1
        usages.append(f"linea {line_num}")
    return usages[:5]  # Limitar a 5 para no sobrecargar

    # Verificar sintaxis básica
    errors = []
    if '{' not in content or '}' not in content:
        errors.append("Posible error de sintaxis: llaves faltantes")

    open_braces = content.count('{')
    close_braces = content.count('}')
    if open_braces != close_braces:
        errors.append(f"Desbalance de llaves: {open_braces} abiertas, {close_braces} cerradas")

    if errors:
        print(f"\nErrores encontrados: {errors}")
    else:
        print("\nSintaxis basica correcta")

def check_html_css_links():
    """Verifica enlaces CSS en archivos HTML."""
    print("\n=== Verificando enlaces CSS en HTML ===")

    html_files = ['modules/encounters/encounters.html', 'examples/ally_card_standalone.html']

    for html_file in html_files:
        if os.path.exists(html_file):
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            css_links = re.findall(r'<link[^>]*href="([^"]*\.css)"', content)
            print(f"\n{html_file}:")
            for css in css_links:
                full_path = os.path.join(os.path.dirname(html_file), css)
                if os.path.exists(full_path):
                    print(f"  OK: {css}")
                else:
                    print(f"  ERROR: {css} (archivo no encontrado)")

def analyze_monster_html():
    """Analiza monster_card_standalone.html para elementos y estilos."""
    print("\n=== Análisis de monster_card_standalone.html ===")

    html_file = 'examples/monster_card_standalone.html'
    if not os.path.exists(html_file):
        print(f"ERROR: Archivo {html_file} no encontrado")
        return

    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Detectar elementos con clases de monster
    elements = re.findall(r'<[^>]*class="([^"]*monster[^"]*)"[^>]*>', content)
    print(f"Elementos con clases 'monster': {len(elements)}")
    for el in elements[:10]:  # Mostrar primeros 10
        print(f"  - {el}")

    # Detectar enlaces CSS
    css_links = re.findall(r'<link[^>]*href="([^"]*\.css)"', content)
    print(f"Enlaces CSS: {css_links}")

    # Detectar estilos inline
    inline_styles = re.findall(r'style="([^"]*)"', content)
    if inline_styles:
        print(f"Estilos inline encontrados: {len(inline_styles)}")
        for style in inline_styles[:5]:
            print(f"  - {style[:50]}...")

def main():
    """Función principal - Enfoque en tarjetas de monstruos."""
    print("Debug CSS - Tarjetas de Monstruos D&D")
    print("=" * 50)

    # Analizar solo monsters_card.css
    css_file = 'modules/encounters/css/monsters_card.css'
    if os.path.exists(css_file):
        analyze_css_file(css_file)
    else:
        print(f"ERROR: Archivo {css_file} no encontrado")

    # Analizar HTML de monstruos
    analyze_monster_html()

    print("\n" + "=" * 50)
    print("Recomendaciones para Tarjetas de Monstruos:")
    print("1. Asegurar colores oscuros/rojos para atmósfera terrorífica")
    print("2. Mantener alto contraste para legibilidad")
    print("3. Verificar que variables --monster-* no interfieran con otros CSS")
    print("4. Probar en navegador para confirmar estilos aplicados")

if __name__ == "__main__":
    main()
