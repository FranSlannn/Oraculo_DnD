// Módulo Diario
function saveJournalEntry() {
    logger('journal', 'saveJournalEntry', 'Iniciando guardado de entrada del diario');
    const entry = document.getElementById('journal-entry').value.trim();
    if (!entry) {
        logger('journal', 'saveJournalEntry', 'Entrada vacía, no se guardó');
        return;
    }
    const date = new Date().toLocaleString();
    const fullEntry = `${date}: ${entry}`;
    logger('journal', 'saveJournalEntry', `Guardando entrada: ${fullEntry}`);
    let journal = JSON.parse(localStorage.getItem('journal') || '[]');
    journal.push(fullEntry);
    localStorage.setItem('journal', JSON.stringify(journal));
    document.getElementById('journal-entry').value = '';
    loadJournal();
    logger('journal', 'saveJournalEntry', 'Entrada guardada y diario recargado');
}

function loadJournal() {
    logger('journal', 'loadJournal', 'Cargando entradas del diario');
    const journal = JSON.parse(localStorage.getItem('journal') || '[]');
    logger('journal', 'loadJournal', `Entradas cargadas: ${journal.length}`);
    const historyDiv = document.getElementById('journal-history');
    historyDiv.innerHTML = '<div class="history-title">Entradas del Diario</div>';
    journal.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.textContent = entry;
        historyDiv.appendChild(item);
    });
    logger('journal', 'loadJournal', 'Diario cargado y mostrado');
}