// Módulo Personaje
let character = JSON.parse(localStorage.getItem('character') || JSON.stringify({
    level: 1,
    hp: 20,
    maxHp: 20,
    exp: 0,
    skills: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }
}));

function gainEXP() {
    const exp = parseInt(document.getElementById('gain-exp').value);
    if (exp > 0) {
        character.exp += exp;
        if (character.exp >= character.level * 1000) { // Simplificado
            levelUp();
        }
        updateCharacterDisplay();
        saveCharacter();
        addToHistory('character', `Ganado ${exp} EXP`);
    }
}

function levelUp() {
    character.level++;
    character.maxHp += 5; // Simplificado
    character.hp = character.maxHp;
    updateCharacterDisplay();
    saveCharacter();
    addToHistory('character', `Subido a nivel ${character.level}`);
}

function healHP() {
    character.hp = character.maxHp;
    updateCharacterDisplay();
    saveCharacter();
    addToHistory('character', 'HP curado completamente');
}

function takeDamage() {
    const damage = parseInt(document.getElementById('damage-hp').value);
    if (damage > 0) {
        character.hp = Math.max(0, character.hp - damage);
        updateCharacterDisplay();
        saveCharacter();
        addToHistory('character', `Recibido ${damage} daño`);
    }
}

function updateCharacterDisplay() {
    document.getElementById('character-level').textContent = character.level;
    document.getElementById('character-hp').textContent = character.hp;
    document.getElementById('character-max-hp').textContent = character.maxHp;
    document.getElementById('character-exp').textContent = character.exp;
    document.getElementById('character-skills').textContent = 
        `Fuerza ${character.skills.str}, Destreza ${character.skills.dex}, Constitución ${character.skills.con}, Inteligencia ${character.skills.int}, Sabiduría ${character.skills.wis}, Carisma ${character.skills.cha}`;
}

function saveCharacter() {
    localStorage.setItem('character', JSON.stringify(character));
}

// Inicializar
updateCharacterDisplay();