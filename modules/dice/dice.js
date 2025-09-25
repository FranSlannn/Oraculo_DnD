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
    d4: '#b87333',
    d6: '#c0c0c0',
    d8: '#ffd700',
    d10: '#43464b',
    d12: '#b5a642',
    d20: '#e5e4e2',
    d100: '#43464b'
};

// Función para calcular color de texto basado en luminosidad del fondo
function getTextColor(bgColor) {
    // Convertir hex a RGB
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    // Calcular luminosidad (fórmula estándar)
    const luminosity = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminosity > 0.5 ? 'black' : 'white';
}

// Cargar configuración desde localStorage (iniciando contadores a 0)
function loadConfig() {
    console.log('dice loadConfig called');
    logger('dice', 'loadConfig', 'Cargando configuración desde localStorage, iniciando contadores a 0');
    const config = JSON.parse(localStorage.getItem('diceConfig')) || {};
    // Forzar contadores a 0 al abrir la pestaña, pero mantener modificador guardado
    diceCounts.d4 = 0;
    diceCounts.d6 = 0;
    diceCounts.d8 = 0;
    diceCounts.d10 = 0;
    diceCounts.d12 = 0;
    diceCounts.d20 = 0;
    diceCounts.d100 = 0;
    const modifier = config.modifier || 0;
    document.getElementById('dice-universal-modifier').value = modifier;
    // Cargar colores personalizados o usar valores por defecto
    const savedColors = config.colors || {};
    console.log('[DEBUG] loadConfig: savedColors =', savedColors);
    for (const type in diceColors) {
        diceColors[type] = savedColors[type] || diceColors[type];
        document.documentElement.style.setProperty(`--dice-${type}-color`, diceColors[type]);
        // Setear color de texto
        const textColor = getTextColor(diceColors[type]);
        document.documentElement.style.setProperty(`--dice-${type}-text-color`, textColor);
        document.getElementById(`color-${type}`).value = diceColors[type];
        console.log(`[DEBUG] loadConfig: ${type} color set to ${diceColors[type]}, textColor=${textColor}`);
    }
    updateDisplays();
}

// Guardar configuración en localStorage
function saveConfig() {
    logger('dice', 'saveConfig', 'Guardando configuración en localStorage');
    const config = {
        ...diceCounts,
        modifier: parseInt(document.getElementById('dice-universal-modifier').value) || 0,
        colors: diceColors
    };
    localStorage.setItem('diceConfig', JSON.stringify(config));
}

// Actualizar displays de conteos
function updateDisplays() {
    for (const type in diceCounts) {
        document.getElementById(`dice-${type}-count`).textContent = diceCounts[type];
    }
}

// Actualizar color de dado
function updateDiceColor(type, value) {
    logger('dice', 'updateDiceColor', `Actualizando color de ${type} a ${value}`);
    console.log(`[DEBUG] updateDiceColor: type=${type}, value=${value}, setting --dice-${type}-color to ${value}`);
    diceColors[type] = value;
    document.documentElement.style.setProperty(`--dice-${type}-color`, value);
    // Calcular y setear color de texto
    const textColor = getTextColor(value);
    document.documentElement.style.setProperty(`--dice-${type}-text-color`, textColor);
    console.log(`[DEBUG] updateDiceColor: diceColors[${type}] = ${diceColors[type]}, textColor=${textColor}, CSS properties set`);
    saveConfig();
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
    logger('dice', 'clearDice', 'Limpiando todos los dados, modificador, historial y displays');
    for (const type in diceCounts) {
        diceCounts[type] = 0;
    }
    document.getElementById('dice-universal-modifier').value = 0;
    document.getElementById('dice-dice-container').innerHTML = '';
    displayResult('dice', '');
    const historyDiv = document.getElementById('dice-history');
    historyDiv.innerHTML = '<div class="history-title">Historial de Tiradas</div>';
    updateDisplays(); // Actualizar visualmente los contadores a cero
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
            const textColor = getTextColor(diceColors[type]);
            console.log(`[DEBUG] rollDice: using background-color ${diceColors[type]}, color ${textColor} for ${type} result ${roll}`);
            resultText += `<span style="background-color: ${diceColors[type]}; color: ${textColor}; padding: 2px 4px; border-radius: 3px; margin: 0 2px;">${roll}</span>, `;
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
window.updateDiceColor = updateDiceColor;