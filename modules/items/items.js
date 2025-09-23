// Módulo Objetos
function generateItem() {
    logger('items', 'generateItem', 'Iniciando generación de objeto');
    const rarity = document.getElementById('item-rarity').value;
    logger('items', 'generateItem', `Rareza seleccionada: ${rarity}`);
    const items = itemList[rarity];
    if (!items) {
        logger('items', 'generateItem', 'Rareza no encontrada');
        displayResult('items', 'Rareza no encontrada');
        return;
    }
    const category = getRandomElement(Object.keys(items));
    const item = getRandomElement(items[category]);
    const result = `Objeto ${rarity}: ${item} (${category})`;
    logger('items', 'generateItem', `Objeto generado: ${result}`);
    displayResult('items', result);
    addToHistory('items', result);
    logger('items', 'generateItem', 'Objeto generado y mostrado');
}

// Expose functions globally
window.generateItem = generateItem;
window.clearItems = clearItems;

function clearItems() {
    logger('items', 'clearItems', 'Iniciando limpieza del historial y resultados de objetos');
    const history = document.getElementById('item-history');
    if (history) history.innerHTML = '<div class="history-title">Historial de Objetos</div>';
    const result = document.getElementById('item-result');
    if (result) result.textContent = '';
    logger('items', 'clearItems', 'Limpieza completada');
}