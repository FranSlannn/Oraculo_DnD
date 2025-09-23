function generateNPC() {
    logger('npcs', 'generateNPC', 'Iniciando generación de NPC');
    const type = document.getElementById('npc-type').value;
    const npcs = {
        merchant: ['Mercader de especias', 'Vendedor de armas', 'Comerciante de libros', 'Tendero de pociones'],
        guard: ['Guardia veterano', 'Centinela novato', 'Capitán de la guardia', 'Explorador'],
        villager: ['Granjero', 'Herrero', 'Tabernero', 'Sacerdote'],
        noble: ['Lord feudal', 'Dama cortesana', 'Príncipe heredero', 'Conde exiliado']
    };
    if (!npcs[type]) {
        logger('npcs', 'generateNPC', `Tipo de NPC inválido: ${type}`, { type });
        displayResult('npcs', 'Tipo de NPC no encontrado');
        return;
    }
    const npc = getRandomElement(npcs[type]);
    if (!npc) {
        logger('npcs', 'generateNPC', 'Error al seleccionar NPC', { type });
        displayResult('npcs', 'Error al generar NPC');
        return;
    }
    document.getElementById('generated-npc').textContent = npc;
    addToHistory('npcs', `PNJ ${type}: ${npc}`);
    logger('npcs', 'generateNPC', `NPC generado exitosamente: ${npc}`, { type });
}

// Expose functions globally
window.generateNPC = generateNPC;

function clearNpcs() {
    logger('npcs', 'clearNpcs', 'Iniciando limpieza del historial de PNJs');
    const history = document.getElementById('npcs-history');
    if (history) {
        const items = history.querySelectorAll('.history-item');
        items.forEach(item => item.remove());
        logger('npcs', 'clearNpcs', 'Historial limpiado exitosamente');
    } else {
        logger('npcs', 'clearNpcs', 'Error: No se encontró el div de historial');
    }
    document.getElementById('generated-npc').textContent = 'Ninguno';
    displayResult('npcs', 'Historial limpiado');
}

window.clearNpcs = clearNpcs;