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