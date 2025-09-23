// Módulo de Dados
function rollDice() {
    logger('dice', 'rollDice', 'Iniciando tirada de dado');
    if (!window.rng) {
        logger('dice', 'rollDice', 'Error: RNG no inicializado');
        displayResult('dice', 'Error: RNG no inicializado');
        return;
    }

    const result = Math.floor(window.rng() * 20) + 1;
    const text = `Tirada de d20: ${result}`;
    displayResult('dice', text);
    addToHistory('dice', text);
    logger('dice', 'rollDice', `Tirada exitosa: ${result}`);
}

function clearDice() {
    logger('dice', 'clearDice', 'Iniciando limpieza del historial de dados');
    const historyDiv = document.getElementById('dice-history');
    if (historyDiv) {
        const items = historyDiv.querySelectorAll('.history-item');
        items.forEach(item => item.remove());
        logger('dice', 'clearDice', 'Historial limpiado exitosamente');
    } else {
        logger('dice', 'clearDice', 'Error: No se encontró el div de historial');
    }
    displayResult('dice', 'Historial limpiado');
}

// Asignar evento al botón
document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('roll-dice');
    if (button) {
        button.addEventListener('click', rollDice);
    }
});