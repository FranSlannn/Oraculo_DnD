// Módulo Personaje
let character = JSON.parse(localStorage.getItem('character') || JSON.stringify({
    level: 1,
    hp: 20,
    maxHp: 20,
    exp: 0,
    skills: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }
}));

function gainEXP() {
    logger('character', 'gainEXP', 'Iniciando ganancia de EXP');
    const exp = parseInt(document.getElementById('gain-exp').value);
    logger('character', 'gainEXP', `EXP a ganar: ${exp}`);
    if (exp > 0) {
        character.exp += exp;
        logger('character', 'gainEXP', `EXP total ahora: ${character.exp}`);
        if (character.exp >= character.level * 1000) { // Simplificado
            logger('character', 'gainEXP', 'EXP suficiente para subir nivel, llamando levelUp');
            levelUp();
        }
        updateCharacterDisplay();
        saveCharacter();
        addToHistory('character', `Ganado ${exp} EXP`);
        logger('character', 'gainEXP', 'EXP ganado y actualizado');
    } else {
        logger('character', 'gainEXP', 'EXP inválido, no se realizó acción');
    }
}

function levelUp() {
    logger('character', 'levelUp', `Subiendo de nivel ${character.level} a ${character.level + 1}`);
    character.level++;
    character.maxHp += 5; // Simplificado
    character.hp = character.maxHp;
    logger('character', 'levelUp', `Nuevo nivel: ${character.level}, HP max: ${character.maxHp}`);
    updateCharacterDisplay();
    saveCharacter();
    addToHistory('character', `Subido a nivel ${character.level}`);
    logger('character', 'levelUp', 'Subida de nivel completada');
}

function healHP() {
    logger('character', 'healHP', `Curando HP de ${character.hp} a ${character.maxHp}`);
    character.hp = character.maxHp;
    updateCharacterDisplay();
    saveCharacter();
    addToHistory('character', 'HP curado completamente');
    logger('character', 'healHP', 'HP curado completamente');
}

function takeDamage() {
    logger('character', 'takeDamage', 'Iniciando recepción de daño');
    const damage = parseInt(document.getElementById('damage-hp').value);
    logger('character', 'takeDamage', `Daño a recibir: ${damage}`);
    if (damage > 0) {
        character.hp = Math.max(0, character.hp - damage);
        logger('character', 'takeDamage', `HP restante: ${character.hp}`);
        updateCharacterDisplay();
        saveCharacter();
        addToHistory('character', `Recibido ${damage} daño`);
        logger('character', 'takeDamage', 'Daño aplicado');
    } else {
        logger('character', 'takeDamage', 'Daño inválido, no se realizó acción');
    }
}

function updateCharacterDisplay() {
    logger('character', 'updateCharacterDisplay', 'Actualizando display del personaje');
    document.getElementById('character-level').textContent = character.level;
    document.getElementById('character-hp').textContent = character.hp;
    document.getElementById('character-max-hp').textContent = character.maxHp;
    document.getElementById('character-exp').textContent = character.exp;
    document.getElementById('character-skills').textContent =
        `Fuerza ${character.skills.str}, Destreza ${character.skills.dex}, Constitución ${character.skills.con}, Inteligencia ${character.skills.int}, Sabiduría ${character.skills.wis}, Carisma ${character.skills.cha}`;
    logger('character', 'updateCharacterDisplay', 'Display actualizado');
}

function saveCharacter() {
    logger('character', 'saveCharacter', 'Guardando personaje en localStorage');
    localStorage.setItem('character', JSON.stringify(character));
    logger('character', 'saveCharacter', 'Personaje guardado');
}

// Inicializar
updateCharacterDisplay();