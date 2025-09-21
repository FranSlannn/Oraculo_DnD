// Módulo Objetos
function generateItem() {
    const rarity = document.getElementById('item-rarity').value;
    const items = itemList[rarity];
    if (!items) {
        displayResult('items', 'Rareza no encontrada');
        return;
    }
    const category = getRandomElement(Object.keys(items));
    const item = getRandomElement(items[category]);
    const result = `Objeto ${rarity}: ${item} (${category})`;
    displayResult('items', result);
    addToHistory('items', result);
}

function clearItems() {
    const history = document.getElementById('item-history');
    if (history) history.innerHTML = '<div class="history-title">Historial de Objetos</div>';
    const result = document.getElementById('item-result');
    if (result) result.textContent = '';
}