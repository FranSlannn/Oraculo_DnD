// Módulo Rumores
function generateRumor() {
    const source = getRandomElement(rumorSources);
    const subject = getRandomElement(rumorSubjects);
    const action = getRandomElement(rumorActions);
    const object = getRandomElement(rumorObjects);
    const reliability = getRandomElement(rumorReliability);
    const rumor = `${source} ${subject} ${action} ${object}. (${reliability.text})`;
    displayResult('rumors', rumor);
    addToHistory('rumors', rumor);
}

function clearRumors() {
    const history = document.getElementById('rumor-history');
    if (history) history.innerHTML = '<div class="history-title">Historial de Rumores</div>';
    const result = document.getElementById('rumor-result');
    if (result) result.textContent = '';
}