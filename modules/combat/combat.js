function startCombat() {
    document.getElementById('combat-status').textContent = 'Iniciado';
    addToHistory('combat', 'Combate iniciado');
}

function rollInitiative() {
    const roll = Math.floor(window.rng() * 20) + 1;
    document.getElementById('initiative').textContent = roll;
    addToHistory('combat', `Iniciativa: ${roll}`);
}

function endCombat() {
    document.getElementById('combat-status').textContent = 'Terminado';
    document.getElementById('initiative').textContent = 'N/A';
    addToHistory('combat', 'Combate terminado');
}

// Expose functions globally
window.startCombat = startCombat;
window.rollInitiative = rollInitiative;
window.endCombat = endCombat;