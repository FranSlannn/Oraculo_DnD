// Módulo Social
function startSocialEncounter() {
    logger('social', 'startSocialEncounter', 'Iniciando encuentro social');
    const npc = getRandomElement(npcRaces) + ' ' + getRandomElement(npcClasses);
    const result = `Encuentro social con ${npc}. ¿Qué haces?`;
    logger('social', 'startSocialEncounter', `NPC generado: ${npc}`);
    displayResult('social', result);
    addToHistory('social', result);
    logger('social', 'startSocialEncounter', 'Encuentro social iniciado');
}

function negotiate() {
    logger('social', 'negotiate', 'Realizando negociación');
    const roll = Math.floor(rng() * 20) + 1;
    const success = roll >= 10;
    const result = `Negociación: ${roll} - ${success ? 'Éxito' : 'Fallo'}`;
    logger('social', 'negotiate', `Rollo: ${roll}, Resultado: ${success ? 'Éxito' : 'Fallo'}`);
    displayResult('social', result);
    addToHistory('social', result);
    logger('social', 'negotiate', 'Negociación completada');
}

function persuade() {
    logger('social', 'persuade', 'Realizando persuasión');
    const roll = Math.floor(rng() * 20) + 1;
    const success = roll >= 12;
    const result = `Persuasión: ${roll} - ${success ? 'Éxito' : 'Fallo'}`;
    logger('social', 'persuade', `Rollo: ${roll}, Resultado: ${success ? 'Éxito' : 'Fallo'}`);
    displayResult('social', result);
    addToHistory('social', result);
    logger('social', 'persuade', 'Persuasión completada');
}

function intimidate() {
    logger('social', 'intimidate', 'Realizando intimidación');
    const roll = Math.floor(rng() * 20) + 1;
    const success = roll >= 15;
    const result = `Intimidación: ${roll} - ${success ? 'Éxito' : 'Fallo'}`;
    logger('social', 'intimidate', `Rollo: ${roll}, Resultado: ${success ? 'Éxito' : 'Fallo'}`);
    displayResult('social', result);
    addToHistory('social', result);
    logger('social', 'intimidate', 'Intimidación completada');
}