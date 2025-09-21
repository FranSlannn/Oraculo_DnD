// Módulo Narrativa
function generateNarrativeMeaning() {
    logger('narrative', 'generateNarrativeMeaning', 'Iniciando generación de interpretación narrativa');
    const action = getRandomElement(narrativeMeaningTables.action);
    const subject = getRandomElement(narrativeMeaningTables.subject);
    const meaning = `${action} ${subject}`;
    logger('narrative', 'generateNarrativeMeaning', `Interpretación generada: ${meaning}`);
    displayResult('narrative', `Interpretación: ${meaning}`);
    addToHistory('narrative', meaning);
    logger('narrative', 'generateNarrativeMeaning', 'Interpretación generada y mostrada');
}

function generateRandomEvent() {
    logger('narrative', 'generateRandomEvent', 'Iniciando generación de evento aleatorio');
    const categories = Object.keys(narrativeRandomEvents);
    const category = getRandomElement(categories);
    const event = getRandomElement(narrativeRandomEvents[category]);
    const result = `Evento ${category}: ${event}`;
    logger('narrative', 'generateRandomEvent', `Evento generado: ${result}`);
    displayResult('narrative', result);
    addToHistory('narrative', result);
    logger('narrative', 'generateRandomEvent', 'Evento generado y mostrado');
}

function clearNarrative() {
    logger('narrative', 'clearNarrative', 'Iniciando limpieza del historial y resultados narrativos');
    const history = document.getElementById('narrative-history');
    if (history) history.innerHTML = '<div class="history-title">Historial Narrativo</div>';
    const result = document.getElementById('narrative-result');
    if (result) result.textContent = '';
    logger('narrative', 'clearNarrative', 'Limpieza completada');
}