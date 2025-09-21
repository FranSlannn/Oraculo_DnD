// Módulo Narrativa
function generateNarrativeMeaning() {
    const action = getRandomElement(narrativeMeaningTables.action);
    const subject = getRandomElement(narrativeMeaningTables.subject);
    const meaning = `${action} ${subject}`;
    displayResult('narrative', `Interpretación: ${meaning}`);
    addToHistory('narrative', meaning);
}

function generateRandomEvent() {
    const categories = Object.keys(narrativeRandomEvents);
    const category = getRandomElement(categories);
    const event = getRandomElement(narrativeRandomEvents[category]);
    const result = `Evento ${category}: ${event}`;
    displayResult('narrative', result);
    addToHistory('narrative', result);
}

function clearNarrative() {
    const history = document.getElementById('narrative-history');
    if (history) history.innerHTML = '<div class="history-title">Historial Narrativo</div>';
    const result = document.getElementById('narrative-result');
    if (result) result.textContent = '';
}