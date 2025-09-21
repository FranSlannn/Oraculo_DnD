// Módulo Estrés
let stressLevel = parseInt(localStorage.getItem('stressLevel') || '0');

function increaseStress() {
    stressLevel++;
    updateStressDisplay();
    saveStress();
    addToHistory('stress', `Estrés aumentado a ${stressLevel}`);
}

function decreaseStress() {
    if (stressLevel > 0) stressLevel--;
    updateStressDisplay();
    saveStress();
    addToHistory('stress', `Estrés disminuido a ${stressLevel}`);
}

function madnessRoll() {
    const roll = Math.floor(rng() * 20) + 1;
    let effect = 'Ninguno';
    if (roll <= 5) effect = 'Alucinaciones menores';
    else if (roll <= 10) effect = 'Paranoia';
    else if (roll <= 15) effect = 'Pérdida de memoria';
    else effect = 'Locura temporal';
    document.getElementById('stress-effects').textContent = effect;
    addToHistory('stress', `Rollo de locura: ${roll} - ${effect}`);
}

function resetStress() {
    stressLevel = 0;
    document.getElementById('stress-effects').textContent = 'Ninguno';
    updateStressDisplay();
    saveStress();
    addToHistory('stress', 'Estrés reiniciado');
}

function updateStressDisplay() {
    document.getElementById('stress-level').textContent = stressLevel;
}

function saveStress() {
    localStorage.setItem('stressLevel', stressLevel);
}

// Inicializar
updateStressDisplay();