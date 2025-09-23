function generateName() {
    logger('names', 'generateName', 'Iniciando generación de nombre');
    const type = document.getElementById('name-type').value;
    const names = {
        human: ['John', 'Mary', 'Robert', 'Anna', 'Michael', 'Emma'],
        elf: ['Elandor', 'Lirael', 'Thalion', 'Elowen', 'Galion', 'Nimloth'],
        dwarf: ['Thorin', 'Gimli', 'Balin', 'Dwalin', 'Gloin', 'Bifur'],
        orc: ['Grishnak', 'Ugluk', 'Lurtz', 'Gothmog', 'Snaga', 'Yazneg']
    };
    if (!names[type]) {
        logger('names', 'generateName', `Tipo de nombre inválido: ${type}`, { type });
        displayResult('names', 'Tipo de nombre no encontrado');
        return;
    }
    const name = getRandomElement(names[type]);
    if (!name) {
        logger('names', 'generateName', 'Error al seleccionar nombre', { type });
        displayResult('names', 'Error al generar nombre');
        return;
    }
    document.getElementById('generated-name').textContent = name;
    addToHistory('names', `Nombre ${type}: ${name}`);
    logger('names', 'generateName', `Nombre generado exitosamente: ${name}`, { type });
}

// Expose functions globally
window.generateName = generateName;

function clearNames() {
    logger('names', 'clearNames', 'Iniciando limpieza del historial de nombres');
    const history = document.getElementById('names-history');
    if (history) {
        const items = history.querySelectorAll('.history-item');
        items.forEach(item => item.remove());
        logger('names', 'clearNames', 'Historial limpiado exitosamente');
    } else {
        logger('names', 'clearNames', 'Error: No se encontró el div de historial');
    }
    document.getElementById('generated-name').textContent = 'Ninguno';
    displayResult('names', 'Historial limpiado');
}

window.clearNames = clearNames;