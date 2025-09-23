// Módulo Estrés
let stressLevel = parseInt(localStorage.getItem('stressLevel') || '0');

function increaseStress() {
    logger('stress', 'increaseStress', `Aumentando estrés de ${stressLevel} a ${stressLevel + 1}`);
    stressLevel++;
    updateStressDisplay();
    saveStress();
    addToHistory('stress', `Estrés aumentado a ${stressLevel}`);
    logger('stress', 'increaseStress', 'Estrés aumentado');
}

function decreaseStress() {
    logger('stress', 'decreaseStress', `Disminuyendo estrés de ${stressLevel}`);
    if (stressLevel > 0) stressLevel--;
    logger('stress', 'decreaseStress', `Estrés ahora: ${stressLevel}`);
    updateStressDisplay();
    saveStress();
    addToHistory('stress', `Estrés disminuido a ${stressLevel}`);
    logger('stress', 'decreaseStress', 'Estrés disminuido');
}

function madnessRoll() {
    logger('stress', 'madnessRoll', 'Realizando rollo de locura');
    const roll = Math.floor(window.rng() * 20) + 1;
    let effect = 'Ninguno';
    if (roll <= 5) effect = 'Alucinaciones menores';
    else if (roll <= 10) effect = 'Paranoia';
    else if (roll <= 15) effect = 'Pérdida de memoria';
    else effect = 'Locura temporal';
    logger('stress', 'madnessRoll', `Rollo: ${roll}, Efecto: ${effect}`);
    document.getElementById('stress-effects').textContent = effect;
    addToHistory('stress', `Rollo de locura: ${roll} - ${effect}`);
    logger('stress', 'madnessRoll', 'Rollo de locura completado');
}

function resetStress() {
    logger('stress', 'resetStress', `Reiniciando estrés de ${stressLevel} a 0`);
    stressLevel = 0;
    document.getElementById('stress-effects').textContent = 'Ninguno';
    updateStressDisplay();
    saveStress();
    addToHistory('stress', 'Estrés reiniciado');
    logger('stress', 'resetStress', 'Estrés reiniciado');
}

function updateStressDisplay() {
    logger('stress', 'updateStressDisplay', `Actualizando display a nivel ${stressLevel}`);
    document.getElementById('stress-level').textContent = stressLevel;
    logger('stress', 'updateStressDisplay', 'Display actualizado');
}

function saveStress() {
    logger('stress', 'saveStress', `Guardando nivel de estrés: ${stressLevel}`);
    localStorage.setItem('stressLevel', stressLevel);
    logger('stress', 'saveStress', 'Estrés guardado');
}

// Inicializar
updateStressDisplay();

// Expose functions globally
window.increaseStress = increaseStress;
window.decreaseStress = decreaseStress;
window.madnessRoll = madnessRoll;
window.resetStress = resetStress;