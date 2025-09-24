// =========================================================================
// dice.js - Lógica JavaScript para el módulo de Dados
// =========================================================================

console.log('dice.js loaded');

const diceCounts = {
    d4: 0,
    d6: 0,
    d8: 0,
    d10: 0,
    d12: 0,
    d20: 0,
    d100: 0
};

const diceColors = {
    d4: '#b22222',
    d6: '#228b22',
    d8: '#1e90ff',
    d10: '#ff8c00',
    d12: '#9932cc',
    d20: '#ffd700',
    d100: '#4682b4'
};

// Cargar configuración desde localStorage
function loadConfig() {
    console.log('dice loadConfig called');
    logger('dice', 'loadConfig', 'Cargando configuración desde localStorage');
    const config = JSON.parse(localStorage.getItem('diceConfig')) || {};
    diceCounts.d4 = config.d4 || 0;
    diceCounts.d6 = config.d6 || 0;
    diceCounts.d8 = config.d8 || 0;
    diceCounts.d10 = config.d10 || 0;
    diceCounts.d12 = config.d12 || 0;
    diceCounts.d20 = config.d20 || 0;
    diceCounts.d100 = config.d100 || 0;
    const modifier = config.modifier || 0;
    document.getElementById('dice-universal-modifier').value = modifier;
    updateDisplays();
}

// Guardar configuración en localStorage
function saveConfig() {
    logger('dice', 'saveConfig', 'Guardando configuración en localStorage');
    const config = {
        ...diceCounts,
        modifier: parseInt(document.getElementById('dice-universal-modifier').value) || 0
    };
    localStorage.setItem('diceConfig', JSON.stringify(config));
}

// Actualizar displays de conteos
function updateDisplays() {
    for (const type in diceCounts) {
        document.getElementById(`dice-${type}-count`).textContent = diceCounts[type];
    }
}

// Actualizar conteo de dados
function updateDiceCount(type, delta) {
    logger('dice', 'updateDiceCount', `Actualizando ${type} por ${delta}`);
    const newCount = Math.max(0, Math.min(5, diceCounts[type] + delta));
    diceCounts[type] = newCount;
    document.getElementById(`dice-${type}-count`).textContent = newCount;
    saveConfig();
}

// Limpiar dados
function clearDice() {
    logger('dice', 'clearDice', 'Limpiando todos los dados y modificador');
    for (const type in diceCounts) {
        diceCounts[type] = 0;
    }
    document.getElementById('dice-universal-modifier').value = 0;
    document.getElementById('dice-dice-container').innerHTML = '';
    displayResult('dice', '');
    const historyDiv = document.getElementById('dice-history');
    historyDiv.innerHTML = '<div class="history-title">Historial de Tiradas</div>';
    saveConfig();
}

// Tirar dados
function rollDice() {
    console.log('dice rollDice called');
    logger('dice', 'rollDice', 'Tirando dados');
    const container = document.getElementById('dice-dice-container');
    container.innerHTML = '';
    const results = [];
    let total = 0;
    let hasDice = false;
    const modifier = parseInt(document.getElementById('dice-universal-modifier').value) || 0;

    for (const [type, count] of Object.entries(diceCounts)) {
        if (count > 0) {
            hasDice = true;
            const sides = parseInt(type.replace('d', ''));
            for (let i = 0; i < count; i++) {
                const roll = Math.floor(window.rng() * sides) + 1;
                results.push({ roll, type });
                total += roll;
                const dice = createDice(type, roll);
                container.appendChild(dice);
                dice.classList.add('rolling');
                setTimeout(() => {
                    dice.classList.remove('rolling');
                    dice.textContent = roll;
                }, 1000);
            }
        }
    }

    if (!hasDice) {
        displayResult('dice', 'Selecciona al menos un dado para tirar.');
        return;
    }

    total += modifier;
    setTimeout(() => {
        let resultText = 'Resultados: ';
        results.forEach(({ roll, type }) => {
            resultText += `<span style="color: ${diceColors[type]}">${roll}</span>, `;
        });
        resultText = resultText.slice(0, -2); // Remover coma final
        if (modifier !== 0) {
            const modText = modifier > 0 ? `+${modifier}` : modifier;
            resultText += ` ${modText}`;
        }
        resultText += ` (Total: ${total})`;
        displayResult('dice', resultText);
        addToHistory('dice', `[${new Date().toLocaleTimeString()}] ${resultText}`);
    }, 1000);
}

// Crear elemento dado
function createDice(type, result) {
    const dice = document.createElement('div');
    dice.className = `dice ${type}`;
    dice.textContent = '?';
    return dice;
}

// Inicialización
console.log('dice init start');
loadConfig();
document.getElementById('dice-roll-button').addEventListener('click', rollDice);
document.getElementById('dice-clear-button').addEventListener('click', clearDice);
console.log('dice init end');

// Exponer funciones a window
window.rollDice = rollDice;
window.clearDice = clearDice;
window.updateDiceCount = updateDiceCount;