// Módulo Metas
function generateGoalProgress() {
    logger('goals', 'generateGoalProgress', 'Iniciando generación de progreso de meta');
    const action = getRandomElement(goalProgress.Actions);
    const subject = getRandomElement(goalProgress.Subjects);
    const circumstance = getRandomElement(goalProgress.Circumstances);
    const theme = getRandomElement(goalProgress.Themes);
    const intensity = getRandomElement(goalProgress.Intensity);
    const result = `${action} ${subject} ${circumstance} de ${theme} con ${intensity}`;
    logger('goals', 'generateGoalProgress', `Progreso generado: ${result}`);
    displayResult('goals', result);
    addToHistory('goals', result);
    logger('goals', 'generateGoalProgress', 'Progreso de meta generado y mostrado');
}

function clearGoals() {
    logger('goals', 'clearGoals', 'Iniciando limpieza del historial y resultados de metas');
    const history = document.getElementById('goal-history');
    if (history) history.innerHTML = '<div class="history-title">Historial de Metas</div>';
    const result = document.getElementById('goal-result');
    if (result) result.textContent = '';
    logger('goals', 'clearGoals', 'Limpieza completada');
}