// Módulo Metas
function generateGoalProgress() {
    const action = getRandomElement(goalProgress.Actions);
    const subject = getRandomElement(goalProgress.Subjects);
    const circumstance = getRandomElement(goalProgress.Circumstances);
    const theme = getRandomElement(goalProgress.Themes);
    const intensity = getRandomElement(goalProgress.Intensity);
    const result = `${action} ${subject} ${circumstance} de ${theme} con ${intensity}`;
    displayResult('goals', result);
    addToHistory('goals', result);
}

function clearGoals() {
    const history = document.getElementById('goal-history');
    if (history) history.innerHTML = '<div class="history-title">Historial de Metas</div>';
    const result = document.getElementById('goal-result');
    if (result) result.textContent = '';
}