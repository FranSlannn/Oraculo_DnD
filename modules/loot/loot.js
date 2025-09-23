// Módulo Botín
function generateLoot() {
    logger('loot', 'generateLoot', 'Iniciando generación de botín');
    const rarity = document.getElementById('loot-rarity').value;
    logger('loot', 'generateLoot', `Rareza seleccionada: ${rarity}`);
    const loots = lootTables[rarity];
    const loot = getRandomElement(loots);
    logger('loot', 'generateLoot', `Botín generado: ${loot}`);
    displayResult('loot', `Botín ${rarity}: ${loot}`);
    addToHistory('loot', `Botín ${rarity}: ${loot}`);
    logger('loot', 'generateLoot', 'Botín generado y mostrado');
}

// Expose functions globally
window.generateLoot = generateLoot;

function clearLoot() {
    logger('loot', 'clearLoot', 'Iniciando limpieza del historial de botín');
    const history = document.getElementById('loot-history');
    if (history) {
        const items = history.querySelectorAll('.history-item');
        items.forEach(item => item.remove());
        logger('loot', 'clearLoot', 'Historial limpiado exitosamente');
    } else {
        logger('loot', 'clearLoot', 'Error: No se encontró el div de historial');
    }
    displayResult('loot', 'Historial limpiado');
}

window.clearLoot = clearLoot;