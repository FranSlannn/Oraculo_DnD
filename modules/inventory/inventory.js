// Módulo Inventario
let inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
let gold = parseInt(localStorage.getItem('gold') || '0');

function addGold() {
    const amount = parseInt(document.getElementById('add-gold').value);
    if (amount > 0) {
        gold += amount;
        updateInventoryDisplay();
        saveInventory();
        addToHistory('inventory', `Añadido ${amount} oro`);
    }
}

function addItem() {
    const name = document.getElementById('item-name').value.trim();
    const weight = parseFloat(document.getElementById('item-weight').value) || 0;
    if (name) {
        inventory.push({ name, weight });
        updateInventoryDisplay();
        saveInventory();
        addToHistory('inventory', `Añadido ítem: ${name} (${weight} kg)`);
    }
}

function updateInventoryDisplay() {
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
}

function removeItem(index) {
    const item = inventory.splice(index, 1)[0];
    updateInventoryDisplay();
    saveInventory();
    addToHistory('inventory', `Eliminado ítem: ${item.name}`);
}

function saveInventory() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('gold', gold);
}

// Inicializar
updateInventoryDisplay();