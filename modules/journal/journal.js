// Módulo Diario
function saveJournalEntry() {
    const entry = document.getElementById('journal-entry').value.trim();
    if (!entry) return;
    const date = new Date().toLocaleString();
    const fullEntry = `${date}: ${entry}`;
    let journal = JSON.parse(localStorage.getItem('journal') || '[]');
    journal.push(fullEntry);
    localStorage.setItem('journal', JSON.stringify(journal));
    document.getElementById('journal-entry').value = '';
    loadJournal();
}

function loadJournal() {
    const journal = JSON.parse(localStorage.getItem('journal') || '[]');
    const historyDiv = document.getElementById('journal-history');
    historyDiv.innerHTML = '<div class="history-title">Entradas del Diario</div>';
    journal.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.textContent = entry;
        historyDiv.appendChild(item);
    });
}