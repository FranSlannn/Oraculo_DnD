// Módulo Clima
function generateWeather() {
    const system = document.getElementById('weather-system').value;
    const conditions = weatherSystems[system].conditions;
    const condition = getRandomElement(conditions);
    const result = `Clima ${system}: ${condition}`;
    displayResult('weather', result);
    addToHistory('weather', result);
}

function clearWeather() {
    const history = document.getElementById('weather-history');
    if (history) history.innerHTML = '<div class="history-title">Historial de Clima</div>';
    const result = document.getElementById('weather-result');
    if (result) result.textContent = '';
}