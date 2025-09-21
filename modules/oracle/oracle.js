// Módulo Oráculo
function askOracle() {
    logger('oracle', 'askOracle', 'Iniciando consulta al oráculo');
    const question = document.getElementById('oracle-question').value.trim();
    const type = document.getElementById('oracle-type').value;
    if (!question) {
        logger('oracle', 'askOracle', 'Pregunta vacía, mostrando mensaje de error');
        displayResult('oracle', 'Por favor, haz una pregunta.');
        return;
    }

    let answers;
    switch(type) {
        case 'simple':
            answers = oracleAnswersSimple;
            break;
        case 'detailed':
            answers = oracleAnswersDetailed;
            break;
        case 'mythic':
            answers = oracleAnswersMythic;
            break;
    }
    const answer = getRandomElement(answers);
    const result = `Pregunta: ${question}<br>Respuesta del Oráculo (${type}): ${answer}`;
    displayResult('oracle', result);
    addToHistory('oracle', result);
    logger('oracle', 'askOracle', `Respuesta generada: ${answer}`);
}

// Función auxiliar para elemento aleatorio
function getRandomElement(array) {
    logger('oracle', 'getRandomElement', `Seleccionando elemento aleatorio de array de longitud ${array.length}`);
    const element = array[Math.floor(rng() * array.length)];
    logger('oracle', 'getRandomElement', `Elemento seleccionado: ${element}`);
    return element;
}

function clearOracle() {
    logger('oracle', 'clearOracle', 'Iniciando limpieza del historial y campos del oráculo');
    const history = document.getElementById('oracle-history');
    if (history) {
        const exportBtn = history.querySelector('button[onclick*="exportHistory"]');
        history.innerHTML = '<div class="history-title">Historial de Oráculo</div>';
        if (exportBtn) history.appendChild(exportBtn);
        history.innerHTML += '<button onclick="clearOracle()">Limpiar</button>';
    }
    const result = document.getElementById('oracle-result');
    if (result) result.textContent = '';
    const question = document.getElementById('oracle-question');
    if (question) question.value = '';
    logger('oracle', 'clearOracle', 'Limpieza completada');
}