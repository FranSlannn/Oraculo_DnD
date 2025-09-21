// Módulo Inventario
let inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
let gold = parseInt(localStorage.getItem('gold') || '0');

function addGold() {
    logger('inventory', 'addGold', 'Iniciando adición de oro');
    const amount = parseInt(document.getElementById('add-gold').value);
    logger('inventory', 'addGold', `Cantidad a añadir: ${amount}`);
    if (amount > 0) {
        gold += amount;
        logger('inventory', 'addGold', `Oro total ahora: ${gold}`);
        updateInventoryDisplay();
        saveInventory();
        addToHistory('inventory', `Añadido ${amount} oro`);
        logger('inventory', 'addGold', 'Oro añadido');
    } else {
        logger('inventory', 'addGold', 'Cantidad inválida, no se añadió oro');
    }
}

function addItem() {
    logger('inventory', 'addItem', 'Iniciando adición de ítem');
    const name = document.getElementById('item-name').value.trim();
    const weight = parseFloat(document.getElementById('item-weight').value) || 0;
    logger('inventory', 'addItem', `Ítem: ${name}, Peso: ${weight}`);
    if (name) {
        inventory.push({ name, weight });
        logger('inventory', 'addItem', `Ítem añadido, inventario ahora tiene ${inventory.length} items`);
        updateInventoryDisplay();
        saveInventory();
        addToHistory('inventory', `Añadido ítem: ${name} (${weight} kg)`);
        logger('inventory', 'addItem', 'Ítem añadido');
    } else {
        logger('inventory', 'addItem', 'Nombre inválido, no se añadió ítem');
    }
}

function updateInventoryDisplay() {
    logger('inventory', 'updateInventoryDisplay', 'Actualizando display del inventario');
    const list = document.getElementById('inventory-list');
    list.innerHTML = '';
    let totalWeight = 0;
    inventory.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name} (${item.weight} kg) <button onclick="removeItem(${index})">Eliminar</button>`;
        list.appendChild(li);
        totalWeight += item.weight;
    });
    document.getElementById('total-weight').textContent = totalWeight;
    document.getElementById('gold-amount').textContent = gold;
    logger('inventory', 'updateInventoryDisplay', `Display actualizado: ${inventory.length} items, peso total ${totalWeight}, oro ${gold}`);
}

function removeItem(index) {
    logger('inventory', 'removeItem', `Eliminando ítem en índice ${index}`);
    const item = inventory.splice(index, 1)[0];
    logger('inventory', 'removeItem', `Ítem eliminado: ${item.name}`);
    updateInventoryDisplay();
    saveInventory();
    addToHistory('inventory', `Eliminado ítem: ${item.name}`);
    logger('inventory', 'removeItem', 'Ítem eliminado');
}

function saveInventory() {
    logger('inventory', 'saveInventory', 'Guardando inventario en localStorage');
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('gold', gold);
    logger('inventory', 'saveInventory', 'Inventario guardado');
}

// Inicializar
updateInventoryDisplay();