// Módulo Botín
function generateLoot() {
    const rarity = document.getElementById('loot-rarity').value;
    const loots = lootTables[rarity];
    const loot = getRandomElement(loots);
    displayResult('loot', `Botín ${rarity}: ${loot}`);
    addToHistory('loot', `Botín ${rarity}: ${loot}`);
}