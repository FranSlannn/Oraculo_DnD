// Módulo Clima
function generateWeather() {
    logger('weather', 'generateWeather', 'Iniciando generación de clima');
    const system = document.getElementById('weather-system').value;
    logger('weather', 'generateWeather', `Sistema seleccionado: ${system}`);
    const conditions = weatherSystems[system].conditions;
    const condition = getRandomElement(conditions);
    const result = `Clima ${system}: ${condition}`;
    logger('weather', 'generateWeather', `Condición generada: ${condition}`);
    displayResult('weather', result);
    addToHistory('weather', result);
    logger('weather', 'generateWeather', 'Clima generado y mostrado');
}

function clearWeather() {
    logger('weather', 'clearWeather', 'Iniciando limpieza del historial y resultados de clima');
    const history = document.getElementById('weather-history');
    if (history) history.innerHTML = '<div class="history-title">Historial de Clima</div>';
    const result = document.getElementById('weather-result');
    if (result) result.textContent = '';
    logger('weather', 'clearWeather', 'Limpieza completada');
}

// Expose functions globally
window.generateWeather = generateWeather;
window.clearWeather = clearWeather;