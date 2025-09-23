// Módulo Tensión
let tensionLevel = 0;

function increaseTension() {
    logger('tension', 'increaseTension', `Aumentando tensión de ${tensionLevel} a ${tensionLevel + 1}`);
    tensionLevel++;
    updateTensionDisplay();
    addToHistory('tension', `Tensión aumentada a ${tensionLevel}`);
    logger('tension', 'increaseTension', 'Tensión aumentada');
}

function decreaseTension() {
    logger('tension', 'decreaseTension', `Disminuyendo tensión de ${tensionLevel}`);
    if (tensionLevel > 0) tensionLevel--;
    logger('tension', 'decreaseTension', `Tensión ahora: ${tensionLevel}`);
    updateTensionDisplay();
    addToHistory('tension', `Tensión disminuida a ${tensionLevel}`);
    logger('tension', 'decreaseTension', 'Tensión disminuida');
}

function resetTension() {
    logger('tension', 'resetTension', `Reiniciando tensión de ${tensionLevel} a 0`);
    tensionLevel = 0;
    updateTensionDisplay();
    addToHistory('tension', 'Tensión reiniciada');
    logger('tension', 'resetTension', 'Tensión reiniciada');
}

function updateTensionDisplay() {
    logger('tension', 'updateTensionDisplay', `Actualizando display a nivel ${tensionLevel}`);
    document.getElementById('tension-level').textContent = tensionLevel;
    logger('tension', 'updateTensionDisplay', 'Display actualizado');
}

// Expose functions globally
window.increaseTension = increaseTension;
window.decreaseTension = decreaseTension;
window.resetTension = resetTension;