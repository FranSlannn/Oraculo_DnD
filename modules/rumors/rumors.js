// Módulo Rumores
function generateRumor() {
    logger('rumors', 'generateRumor', 'Iniciando generación de rumor');
    const source = getRandomElement(rumorSources);
    const subject = getRandomElement(rumorSubjects);
    const action = getRandomElement(rumorActions);
    const object = getRandomElement(rumorObjects);
    const reliability = getRandomElement(rumorReliability);
    const rumor = `${source} ${subject} ${action} ${object}. (${reliability.text})`;
    logger('rumors', 'generateRumor', `Rumor generado: ${rumor}`);
    displayResult('rumors', rumor);
    addToHistory('rumors', rumor);
    logger('rumors', 'generateRumor', 'Rumor generado y mostrado');
}

function clearRumors() {
    logger('rumors', 'clearRumors', 'Iniciando limpieza del historial y resultados de rumores');
    const history = document.getElementById('rumor-history');
    if (history) history.innerHTML = '<div class="history-title">Historial de Rumores</div>';
    const result = document.getElementById('rumor-result');
    if (result) result.textContent = '';
    logger('rumors', 'clearRumors', 'Limpieza completada');
}

// Expose functions globally
window.generateRumor = generateRumor;
window.clearRumors = clearRumors;