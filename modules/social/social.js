// Módulo Social
function startSocialEncounter() {
    const npc = getRandomElement(npcRaces) + ' ' + getRandomElement(npcClasses);
    const result = `Encuentro social con ${npc}. ¿Qué haces?`;
    displayResult('social', result);
    addToHistory('social', result);
}

function negotiate() {
    const roll = Math.floor(rng() * 20) + 1;
    const success = roll >= 10;
    const result = `Negociación: ${roll} - ${success ? 'Éxito' : 'Fallo'}`;
    displayResult('social', result);
    addToHistory('social', result);
}

function persuade() {
    const roll = Math.floor(rng() * 20) + 1;
    const success = roll >= 12;
    const result = `Persuasión: ${roll} - ${success ? 'Éxito' : 'Fallo'}`;
    displayResult('social', result);
    addToHistory('social', result);
}

function intimidate() {
    const roll = Math.floor(rng() * 20) + 1;
    const success = roll >= 15;
    const result = `Intimidación: ${roll} - ${success ? 'Éxito' : 'Fallo'}`;
    displayResult('social', result);
    addToHistory('social', result);
}