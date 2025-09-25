Oráculos para D&D en Solitario - README (mínimo)

Cómo usar:
- Abre el archivo `Index.html` en tu navegador (doble click o "Abrir con..."). El proyecto es estático y, en Windows, no requiere servidor para uso local.

Cambios aplicados (mantenimiento realizado automáticamente):
- Corregido un error en `CSS/StyleIndex.css` (texto sobrante que podía romper el parseo del CSS).
- Corregida la ruta de carga de `monsters.json` en `JS/script.js` (ahora `fetch('monsters.json')`).
- Normalizadas rutas en `JS/script.js` (`modulePaths`) a nombres de carpetas en minúsculas para evitar problemas en sistemas sensibles a mayúsculas.

Siguientes pasos recomendados:
- Abre `Index.html` en el navegador y revisa la consola de desarrollador (F12) para verificar que los módulos se cargan sin errores.
- Si despliegas en Linux o en un servidor, confirma que los nombres de carpetas/archivos coinciden exactamente (mayúsculas/minúsculas).

Contacto: proyecto local.
