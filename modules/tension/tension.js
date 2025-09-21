// Módulo Tensión
let tensionLevel = 0;

function increaseTension() {
    tensionLevel++;
    updateTensionDisplay();
    addToHistory('tension', `Tensión aumentada a ${tensionLevel}`);
}

function decreaseTension() {
    if (tensionLevel > 0) tensionLevel--;
    updateTensionDisplay();
    addToHistory('tension', `Tensión disminuida a ${tensionLevel}`);
}

function resetTension() {
    tensionLevel = 0;
    updateTensionDisplay();
    addToHistory('tension', 'Tensión reiniciada');
}

function updateTensionDisplay() {
    document.getElementById('tension-level').textContent = tensionLevel;
}