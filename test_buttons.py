#!/usr/bin/env python3
"""
Script para probar la funcionalidad de botones en la app D&D Solitario.
Usa Selenium para automatizar clics y capturar logs de consola.
"""

import time
import logging
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DNDSolitarioTester:
    def __init__(self):
        self.driver = None
        self.console_logs = []
        self.errors_found = []
        self.history_before = {}
        self.history_issues = []

    def setup_driver(self):
        """Configura el driver de Chrome para Electron"""
        chrome_options = Options()
        chrome_options.add_argument("--disable-web-security")
        chrome_options.add_argument("--disable-features=VizDisplayCompositor")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-logging"])
        chrome_options.add_experimental_option("useAutomationExtension", False)

        # Para Electron, necesitamos conectar a la instancia existente
        # Asumiendo que la app está corriendo en localhost:3000 o similar
        # Ajusta según tu configuración
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.get("http://localhost:3000")  # Ajusta el puerto si es diferente

        # Configurar captura de logs de consola
        self.driver.execute_script("""
            window.consoleLogs = [];
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;

            console.log = function(...args) {
                window.consoleLogs.push({level: 'log', message: args.join(' '), timestamp: Date.now()});
                originalLog.apply(console, args);
            };
            console.error = function(...args) {
                window.consoleLogs.push({level: 'error', message: args.join(' '), timestamp: Date.now()});
                originalError.apply(console, args);
            };
            console.warn = function(...args) {
                window.consoleLogs.push({level: 'warn', message: args.join(' '), timestamp: Date.now()});
                originalWarn.apply(console, args);
            };
        """)

    def get_console_logs(self):
        """Obtiene logs de consola desde la página"""
        try:
            logs = self.driver.execute_script("return window.consoleLogs;")
            return logs or []
        except Exception as e:
            logger.error(f"Error obteniendo logs: {e}")
            return []

    def fill_input_fields(self, module):
        """Llena campos de entrada con valores predeterminados"""
        input_mappings = {
            "oracle": {"#oracle-question": "a"},
            "dice": {"#dice-input": "1"},
            "character": {"#damage-amount": "1", "#heal-amount": "1", "#exp-amount": "1"},
            "inventory": {"#item-name": "a", "#item-quantity": "1", "#gold-amount-input": "1"},
            "dungeon": {"#dungeon-size": "small"},  # select
            # Agregar más si es necesario
        }

        if module in input_mappings:
            for selector, value in input_mappings[module].items():
                try:
                    element = self.driver.find_element(By.CSS_SELECTOR, selector)
                    if element.tag_name == 'select':
                        Select(element).select_by_value(value)
                    else:
                        element.clear()
                        element.send_keys(value)
                    logger.info(f"Llenado {selector} con '{value}'")
                except Exception as e:
                    logger.warning(f"No se pudo llenar {selector}: {e}")

    def switch_tab(self, module):
        """Cambia a la pestaña del módulo"""
        try:
            tab_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, f"button[onclick=\"openTab('{module}', this)\"]"))
            )
            tab_button.click()
            time.sleep(0.5)  # Esperar a que cambie
            logger.info(f"Cambiado a pestaña: {module}")
        except Exception as e:
            logger.error(f"Error cambiando a pestaña {module}: {e}")

    def get_module_history(self, module):
        """Obtiene el historial de un módulo"""
        try:
            history = self.driver.execute_script(f"""
                const historyDiv = document.querySelector('#{module} .history');
                if (!historyDiv) return [];
                const items = historyDiv.querySelectorAll('.history-item');
                return Array.from(items).map(item => item.textContent);
            """)
            return history or []
        except Exception as e:
            logger.error(f"Error obteniendo historial de {module}: {e}")
            return []

    def click_button_and_check_inner(self, button_selector, button_name, expected_result_selector=None, module=None):
        """Hace clic en un botón y verifica resultados (lógica interna)"""
        try:
            logger.info(f"Probando botón: {button_name}")

            # Esperar a que el botón esté presente
            button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, button_selector))
            )

            # Llenar campos de entrada antes del clic
            self.fill_input_fields(module)

            # Capturar logs y historial antes del clic
            logs_before = len(self.get_console_logs())
            if module:
                self.history_before[module] = self.get_module_history(module)

            # Hacer clic
            button.click()
            time.sleep(1)  # Esperar a que se procese

            # Capturar logs después del clic
            logs_after = self.get_console_logs()
            new_logs = logs_after[logs_before:]

            # Verificar historial
            if module:
                history_after = self.get_module_history(module)
                new_entries = [item for item in history_after if item not in self.history_before.get(module, [])]
                if new_entries:
                    logger.info(f"Nuevas entradas en historial de {module}: {len(new_entries)} items")
                    for entry in new_entries:
                        logger.info(f"  - {entry}")
                else:
                    logger.warning(f"No se generaron nuevas entradas en historial de {module} para {button_name}")
                    # Intentar forzar generación haciendo clic de nuevo
                    try:
                        logger.info(f"Intentando forzar generación para {button_name}...")
                        button.click()
                        time.sleep(1)
                        history_after2 = self.get_module_history(module)
                        new_entries2 = [item for item in history_after2 if item not in history_after]
                        if new_entries2:
                            logger.info(f"Después de forzar, nuevas entradas en {module}: {len(new_entries2)} items")
                            for entry in new_entries2:
                                logger.info(f"  - {entry}")
                        else:
                            issue = f"{button_name} ({module}): No se generaron entradas en historial ni después de forzar"
                            self.history_issues.append(issue)
                            logger.error(f"Issue reportado: {issue}")
                    except Exception as e:
                        logger.error(f"Error forzando clic en {button_name}: {e}")
                        self.history_issues.append(f"{button_name} ({module}): Error forzando generación - {e}")

            # Verificar si hay errores
            errors = [log for log in new_logs if log['level'] == 'error']
            if errors:
                self.errors_found.extend(errors)
                logger.error(f"Errores encontrados en {button_name}: {errors}")

            # Verificar resultado esperado
            if expected_result_selector:
                try:
                    result_element = self.driver.find_element(By.CSS_SELECTOR, expected_result_selector)
                    if result_element.text.strip():
                        logger.info(f"Resultado encontrado en {button_name}: {result_element.text[:50]}...")
                    else:
                        logger.warning(f"No se encontró resultado esperado en {button_name}")
                except NoSuchElementException:
                    logger.warning(f"Selector de resultado no encontrado: {expected_result_selector}")

            logger.info(f"Botón {button_name} probado exitosamente")
            return True

        except TimeoutException:
            logger.error(f"Botón no encontrado: {button_selector}")
            return False
        except Exception as e:
            logger.error(f"Error probando botón {button_name}: {e}")
            return False

    def click_button_and_check(self, button_selector, button_name, expected_result_selector=None, module=None, selectors=None):
        """Hace clic en un botón y verifica resultados, con soporte para selectores"""
        if selectors:
            from itertools import product
            for combo in product(*selectors.values()):
                # Set select values
                for sel, val in zip(selectors.keys(), combo):
                    select = Select(self.driver.find_element(By.CSS_SELECTOR, sel))
                    select.select_by_value(val)
                # Then click
                self.click_button_and_check_inner(button_selector, f"{button_name} ({', '.join(combo)})", expected_result_selector, module)
        else:
            self.click_button_and_check_inner(button_selector, button_name, expected_result_selector, module)

    def test_all_buttons(self):
        """Prueba todos los botones conocidos"""
        buttons_to_test = {
            "dice": [
                ("#roll-dice", "Tirar Dados", "#dice-result", {}),
            ],
            "oracle": [
                ("#ask-oracle-btn", "Preguntar al Oráculo", "#oracle-result", {"#oracle-type": ["simple", "detailed", "mythic"]}),
            ],
            "npcs": [
                ("button[onclick*='generateNPC']", "Generar NPC", "#generated-npc", {"#npc-type": ["merchant", "guard", "villager", "noble"]}),
            ],
            "encounters": [
                ("button[onclick*='generateEncounter']", "Generar Encuentro", "#encounter-result", {"#encounter-location": ["urbano", "bosque", "montana", "mazmorra", "camino", "costa"], "#encounter-time": ["day", "night"], "#encounter-cr": ["0.125", "0.25", "0.5", "1", "2", "3", "4", "5"]}),  # Limitado para no ser demasiado largo
                ("button[onclick*='generateNpc']", "Generar NPC", "#encounter-result", {}),
                ("button[onclick*='generateVillain']", "Generar Villano", "#encounter-result", {}),
                ("button[onclick*='generateAlly']", "Generar Aliado", "#encounter-result", {}),
                ("button[onclick*='generateMonster']", "Generar Monstruo", "#encounter-result", {}),
            ],
            "narrative": [
                ("button[onclick*='generateNarrativeMeaning']", "Generar Interpretación", "#narrative-result", {}),
                ("button[onclick*='generateRandomEvent']", "Evento Aleatorio", "#narrative-result", {}),
            ],
            "rumors": [
                ("button[onclick*='generateRumor']", "Generar Rumor", "#rumor-result", {}),
            ],
            "items": [
                ("button[onclick*='generateItem']", "Generar Item", "#item-result", {"#item-rarity": ["común", "poco común", "raro"]}),
            ],
            "weather": [
                ("button[onclick*='generateWeather']", "Generar Clima", "#weather-result", {"#weather-system": ["temperate", "cold", "arid", "tropical"]}),
            ],
            "goals": [
                ("button[onclick*='generateGoalProgress']", "Generar Meta", "#goal-result", {}),
            ],
            "loot": [
                ("button[onclick*='generateLoot']", "Generar Botín", "#loot-result", {"#loot-rarity": ["common", "uncommon", "rare", "very-rare", "legendary"]}),
            ],
            "tension": [
                ("button[onclick*='increaseTension']", "Aumentar Tensión", "#tension-result", {}),
                ("button[onclick*='decreaseTension']", "Disminuir Tensión", "#tension-result", {}),
                ("button[onclick*='resetTension']", "Reiniciar Tensión", "#tension-result", {}),
            ],
            "stress": [
                ("button[onclick*='increaseStress']", "Aumentar Estrés", "#stress-level", {}),
                ("button[onclick*='decreaseStress']", "Disminuir Estrés", "#stress-level", {}),
                ("button[onclick*='madnessRoll']", "Rollo de Locura", "#stress-effects", {}),
                ("button[onclick*='resetStress']", "Reiniciar Estrés", "#stress-level", {}),
            ],
            "social": [
                ("button[onclick*='startSocialEncounter']", "Iniciar Encuentro Social", "#social-result", {}),
                ("button[onclick*='negotiate']", "Negociar", "#social-result", {}),
                ("button[onclick*='persuade']", "Persuadir", "#social-result", {}),
                ("button[onclick*='intimidate']", "Intimidar", "#social-result", {}),
            ],
            "character": [
                ("button[onclick*='gainEXP']", "Ganar EXP", "#character-exp", {}),
                ("button[onclick*='levelUp']", "Subir Nivel", "#character-level", {}),
                ("button[onclick*='healHP']", "Curar HP", "#character-hp", {}),
                ("button[onclick*='takeDamage']", "Recibir Daño", "#character-hp", {}),
            ],
            "inventory": [
                ("button[onclick*='addGold']", "Añadir Oro", "#gold-amount", {}),
                ("button[onclick*='addItem']", "Añadir Item", "#inventory-list", {}),
            ],
            "dungeon": [
                ("button[onclick*='generateRoom']", "Generar Habitación", "#dungeon-result", {}),
                ("button[onclick*='generateTrap']", "Generar Trampa", "#dungeon-result", {}),
                ("button[onclick*='generatePuzzle']", "Generar Puzle", "#dungeon-result", {}),
                ("button[onclick*='clearDungeon']", "Limpiar", "#dungeon-result", {}),
                ("#generate-dungeon", "Generar Mazmorra", "#dungeon-map", {"#dungeon-size": ["small", "medium", "large"]}),
            ],
            "names": [
                ("button[onclick*='generateName']", "Generar Nombre", "#generated-name", {"#name-type": ["human", "elf", "dwarf", "orc"]}),
            ],
        }

        logger.info("Iniciando pruebas de botones...")

        for module, buttons in buttons_to_test.items():
            self.switch_tab(module)
            for selector, name, result_selector, selectors in buttons:
                full_selector = f"#{module} {selector}" if module != "dice" else selector  # Dice no tiene prefijo
                self.click_button_and_check(full_selector, name, result_selector, module, selectors)
                time.sleep(0.5)  # Pequeña pausa entre pruebas

        logger.info("Pruebas completadas")

    def analyze_errors(self):
        """Analiza errores encontrados y sugiere fixes"""
        logger.info("Analizando errores encontrados...")

        for error in self.errors_found:
            message = error['message']
            logger.error(f"Error: {message}")

            # Análisis específico de errores comunes
            if "window.rng is not a function" in message:
                logger.info("Fix sugerido: Verificar inicialización de window.rng en index.html")
            elif "is not defined" in message:
                logger.info("Fix sugerido: Verificar que las funciones estén expuestas globalmente")
            elif "Cannot read property" in message:
                logger.info("Fix sugerido: Verificar que los elementos DOM existan antes de acceder")
            elif "net::ERR_FILE_NOT_FOUND" in message:
                logger.info("Fix sugerido: Los archivos CSS faltantes son opcionales, ignorar")

    def run_tests(self):
        """Ejecuta todas las pruebas"""
        try:
            self.setup_driver()
            time.sleep(3)  # Esperar a que la app cargue

            self.test_all_buttons()
            self.analyze_errors()

            logger.info(f"Total errores encontrados: {len(self.errors_found)}")
            logger.info(f"Issues de historial encontrados: {len(self.history_issues)}")
            for issue in self.history_issues:
                logger.error(f"Issue de historial: {issue}")

        except Exception as e:
            logger.error(f"Error en pruebas: {e}")
        finally:
            if self.driver:
                self.driver.quit()

if __name__ == "__main__":
    tester = DNDSolitarioTester()
    tester.run_tests()