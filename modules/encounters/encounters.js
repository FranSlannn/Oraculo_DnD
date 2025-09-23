function generateEncounter() {
    logger('encounters', 'generateEncounter', 'Iniciando generación de encuentro');
    const location = document.getElementById('encounter-location').value;
    const time = document.getElementById('encounter-time').value;
    const cr = parseFloat(document.getElementById('encounter-cr').value);
    logger('encounters', 'generateEncounter', `Parámetros: location=${location}, time=${time}, cr=${cr}`, { location, time, cr });

    // Intentar encontrar monstruo por CR
    const monsterNames = Object.keys(window.monsters || {});
    const matchingMonsters = monsterNames.filter(name => window.monsters[name].challenge_rating === cr);
    logger('encounters', 'generateEncounter', `Monstruos encontrados por CR: ${matchingMonsters.length}`);

    let encounter;
    if (matchingMonsters.length > 0) {
        const monster = getRandomElement(matchingMonsters);
        encounter = `Encuentro con ${window.monsters[monster].name} (CR ${cr}) en ${location} (${time}).`;
        logger('encounters', 'generateEncounter', `Encuentro generado con monstruo: ${window.monsters[monster].name}`);
    } else {
        // Usar tabla de encuentros
        const encounters = encounterTables[location][time];
        encounter = `Encuentro en ${location} (${time}): ${getRandomElement(encounters)}`;
        logger('encounters', 'generateEncounter', `Encuentro generado desde tabla: ${encounter}`);
    }

    displayResult('encounters', encounter);
    addToHistory('encounters', encounter);
    logger('encounters', 'generateEncounter', 'Encuentro generado y mostrado');
}

function clearEncounters() {
    logger('encounters', 'clearEncounters', 'Iniciando limpieza del historial y resultados de encuentros');
    const history = document.getElementById('encounter-history');
    if (history) history.innerHTML = '<div class="history-title">Historial de Encuentros</div>';
    const result = document.getElementById('encounter-result');
    if (result) result.textContent = '';
    const allyCard = document.getElementById('ally-card-container');
    if (allyCard) allyCard.style.display = 'none';
    logger('encounters', 'clearEncounters', 'Limpieza completada');
}

// Constantes para NPCs
const allyNames = [
    'Aelar', 'Bryn', 'Caelum', 'Drenna', 'Eldrin', 'Faelar', 'Gwendolyn', 'Haldir', 'Isolde', 'Jorvik',
    'Kaelen', 'Liora', 'Mirael', 'Nyx', 'Orin', 'Peyton', 'Quorin', 'Rhea', 'Sylvara', 'Thalion',
    'Ursula', 'Veylin', 'Wren', 'Xyra', 'Ysolde', 'Zephyr', 'Aerith', 'Brenna', 'Cyril', 'Darius',
    'Elowen', 'Finnian', 'Galen', 'Hadrian', 'Ilyana', 'Jasper', 'Kaelith', 'Lorien', 'Maelis', 'Nero',
    'Oryn', 'Phaedra', 'Quillian', 'Rhydian', 'Seraphine', 'Tarian', 'Ulric', 'Virelle', 'Wylfred', 'Xandor',
    'Ysmera', 'Zorak'
];

const safeRandom = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return '';
    if (typeof window.rng !== 'function') {
        console.error('window.rng is not a function');
        return arr[0] || '';
    }
    const randomValue = window.rng();
    const index = Math.floor(randomValue * arr.length);
    const element = arr[index];
    logger('encounters', 'safeRandom', `Usando window.rng(), valor random: ${randomValue}, índice: ${index}, elemento: ${element}`, { arrLength: arr.length });
    return element;
};

function generateNpc() {
    logger('encounters', 'generateNpc', 'Iniciando generación de NPC');
    let res = '';
    res = `${safeRandom(npcRaces)} ${safeRandom(npcClasses)}, ${safeRandom(npcTraits)}, Objetivo: ${safeRandom(npcGoals)}`;
    logger('encounters', 'generateNpc', `NPC generado: ${res}`);
    const el = document.getElementById('encounter-result');
    if (el) el.textContent = res;
    addToHistory('encounters', res);
    logger('encounters', 'generateNpc', 'NPC mostrado y agregado al historial');
}

function generateVillain() {
    logger('encounters', 'generateVillain', 'Iniciando generación de villano');
    const goals = [
        'Poder', 'Venganza', 'Riqueza', 'Destrucción', 'Conquista', 'Corrupción',
        'Dominación', 'Caos', 'Inmortalidad', 'Traición', 'Odio', 'Control Mental',
        'Supremacía', 'Desesperación', 'Genocidio', 'Rebelión', 'Codicia', 'Maldición'
    ];
    const flaws = [
        'Arrogancia', 'Avaricia', 'Paranoia', 'Ira', 'Orgullo', 'Impaciencia',
        'Codicia', 'Celos', 'Cobardía', 'Fanatismo', 'Desconfianza', 'Obstinación',
        'Vanidad', 'Lujuria', 'Envidia', 'Gula', 'Prejuicio', 'Debilidad Física'
    ];
    const res = `Villano: ${safeRandom(npcRaces)} ${safeRandom(npcClasses)}, Motivo: ${safeRandom(goals)}, Debilidad: ${safeRandom(flaws)}`;
    logger('encounters', 'generateVillain', `Villano generado: ${res}`);
    const el = document.getElementById('encounter-result');
    if (el) el.textContent = res;
    addToHistory('encounters', res);
    logger('encounters', 'generateVillain', 'Villano mostrado y agregado al historial');
}

function generateAlly() {
    logger('encounters', 'generateAlly', 'Iniciando generación de aliado');
    const skills = ['Combate', 'Magia', 'Sigilo', 'Conocimiento', 'Curación', 'Persuasión'];
    const race = safeRandom(npcRaces);
    const className = safeRandom(npcClasses);
    const skill = safeRandom(skills);
    const trait = safeRandom(npcTraits);
    const role = `${className} leal`;
    const level = '1';
    const randomName = safeRandom(allyNames);
    const description = `una ${race.toLowerCase()} que ${safeRandom(npcGoals).toLowerCase()}`;
    const loyaltyNote = `Leal mientras se cumpla su ${safeRandom(npcGoals).toLowerCase()}`;
    const habitat = safeRandom(['Bosque encantado', 'Montaña nevada', 'Ruinas antiguas', 'Desierto ardiente', 'Cueva profunda', 'Ciudad flotante']);

    window.ally = {
        name: randomName,
        type: race,
        role: role,
        level: level,
        description: description,
        loyaltyNote: loyaltyNote,
        habitat: habitat,
        stats: customizeStats(className),
        abilities: [skill, 'Percepción'],
        traits: [trait, safeRandom(npcTraits)],
        specialAction: '+2 a Exploración / +1d4 Curación',
        classSkills: generateClassSkills(className)
    };

    const res = `Aliado: ${race} ${className}, Habilidad: ${skill}, Rasgo: ${trait}`;
    logger('encounters', 'generateAlly', `Aliado generado: ${randomName}, ${race} ${className}`);
    document.getElementById('encounter-result').textContent = res;
    addToHistory('encounters', res);

    const allyCard = document.getElementById('ally-card-container');
    if (allyCard) {
        allyCard.style.display = 'block';
        generateAllyCard(window.ally);
    }
    logger('encounters', 'generateAlly', 'Aliado generado y mostrado');
}

// Funciones auxiliares para aliado
function getProficiencyBonus(level) {
    const levelMap = { '0': 2, '1': 2, '2': 2, '3': 2, '4': 2, '5': 3, '6': 3, '7': 3, '8': 3, '9': 4, '10': 4, '11': 4, '12': 4, '13': 5, '14': 5, '15': 5, '16': 5, '17+': 6 };
    return levelMap[level] || 2;
}

function calculateHitPoints(level, conMod, type) {
    const hitDieCount = Math.max(1, Math.floor((parseInt(level) || 1) * 1.5));
    let hitDice = 6;
    if (type.includes('Elfo') || type.includes('Humanoide')) hitDice = 6;
    else if (type.includes('Bestia')) hitDice = 8;
    const conBonus = conMod * hitDieCount;
    const averageRoll = Math.floor((hitDice / 2) + 0.5) * hitDieCount;
    return averageRoll + conBonus;
}

function calculateAttackBonus(mainAbilityMod, level) {
    const proficiencyBonus = getProficiencyBonus(level);
    return mainAbilityMod + proficiencyBonus;
}

function calculateSavingThrows(stats, level) {
    const proficiencyBonus = getProficiencyBonus(level);
    return {
        DES: parseInt(stats.DES.split('+')[1]) + proficiencyBonus,
        SAB: parseInt(stats.SAB.split('+')[1]) + proficiencyBonus,
        FUE: parseInt(stats.FUE.split('+')[1]) + 0,
        CON: parseInt(stats.CON.split('+')[1]) + 0,
        INT: parseInt(stats.INT.split('+')[1]) + 0,
        CAR: parseInt(stats.CAR.split('+')[1]) + 0
    };
}

function getLoyalty(charismaMod, role) {
    const baseLoyalty = charismaMod + 1;
    if (role.includes('Leal')) return baseLoyalty >= 3 ? 'Alta' : 'Media';
    else if (role.includes('Neutral')) return baseLoyalty >= 2 ? 'Media' : 'Baja';
    else return baseLoyalty >= 1 ? 'Baja' : 'Desleal';
}

function generateInventory(type, role) {
    const baseItems = ['Cuchillo', 'Cantimplora'];
    if (type.includes('Elfo') || role.includes('Exploradora')) return [...baseItems, 'Arco corto', '2 Pociones de curación'];
    return baseItems;
}

/**
 * Genera una acción especial para el aliado basada en sus rasgos y nivel.
 * Actualmente devuelve una acción fija, pero puede ser expandida para variar según parámetros.
 * @param {Array} traits - Rasgos del aliado
 * @param {string} level - Nivel del aliado
 * @returns {string} Descripción de la acción especial
 */
function generateSpecialAction(traits, level) {
    return '+2 a Exploración / +1d4 Curación';
}

function generateDialogue(loyalty, charismaMod) {
    const responses = {
        'Alta': ['¡Claro, te ayudaré con gusto!', 'Juntos somos invencibles.', 'Confío en tu liderazgo.'],
        'Media': ['Hmm, supongo que puedo ayudar...', 'Solo si me conviene.', 'Dime qué necesitas.'],
        'Baja': ['No estoy seguro de esto...', 'Solo si no hay otro modo.', '¿Por qué debería ayudarte?'],
        'Desleal': ['¡No confío en ti!', 'Mejor me voy por mi cuenta.', '¡Traición es mi juego!']
    };
    const chaosFactor = window.rng() < 0.3 ? ' (con un giro inesperado)' : '';
    const validLoyalty = responses[loyalty] ? loyalty : 'Media';
    const baseIndex = Math.floor(window.rng() * responses[validLoyalty].length);
    const modifier = charismaMod > 0 ? Math.min(charismaMod, 2) : 0;
    const adjustedIndex = (baseIndex + modifier) % responses[validLoyalty].length;
    return responses[validLoyalty][adjustedIndex] + chaosFactor;
}

function getPrimaryStat(role) {
    const roleMap = { 'Guerrero': 'FUE', 'Mago': 'INT', 'Clérigo': 'SAB', 'Pícaro': 'DES', 'Bárbaro': 'FUE', 'Bardo': 'CAR', 'Explorador': 'DES',
                       'Paladín': 'FUE', 'Druida': 'SAB', 'Monje': 'DES', 'Hechicero': 'CAR', 'Brujo': 'CAR', 'Alquimista': 'INT',
                       'Cazador de Demonios': 'DES', 'Caballero Negro': 'FUE', 'Artificiero': 'INT', 'Samurái': 'FUE', 'Guardabosques': 'DES',
                       'Invocador': 'INT', 'Nigromante': 'INT', 'Gladiador': 'FUE', 'Mercenario': 'FUE', 'Sacerdote de Guerra': 'SAB',
                       'Maestro de Bestias': 'SAB', 'Espadachín': 'FUE', 'Ilusionista': 'INT' };
    return roleMap[role.split(' ')[0]] || 'FUE';
}

function customizeStats(role) {
    const baseStats = { FUE: '10 (+0)', DES: '10 (+0)', CON: '10 (+0)', INT: '10 (+0)', SAB: '10 (+0)', CAR: '10 (+0)' };
    const roleBoosts = { 'Guerrero': { FUE: '16 (+3)' }, 'Mago': { INT: '16 (+3)' }, 'Clérigo': { SAB: '16 (+3)' }, 'Pícaro': { DES: '16 (+3)' },
                           'Bárbaro': { FUE: '16 (+3)' }, 'Bardo': { CAR: '16 (+3)' }, 'Explorador': { DES: '16 (+3)' }, 'Paladín': { FUE: '16 (+3)' },
                           'Druida': { SAB: '16 (+3)' }, 'Monje': { DES: '16 (+3)' }, 'Hechicero': { CAR: '16 (+3)' }, 'Brujo': { CAR: '16 (+3)' },
                           'Alquimista': { INT: '16 (+3)' }, 'Cazador de Demonios': { DES: '16 (+3)' }, 'Caballero Negro': { FUE: '16 (+3)' },
                           'Artificiero': { INT: '16 (+3)' }, 'Samurái': { FUE: '16 (+3)' }, 'Guardabosques': { DES: '16 (+3)' },
                           'Invocador': { INT: '16 (+3)' }, 'Nigromante': { INT: '16 (+3)' }, 'Gladiador': { FUE: '16 (+3)' },
                           'Mercenario': { FUE: '16 (+3)' }, 'Sacerdote de Guerra': { SAB: '16 (+3)' }, 'Maestro de Bestias': { SAB: '16 (+3)' },
                           'Espadachín': { FUE: '16 (+3)' }, 'Ilusionista': { INT: '16 (+3)' } };
    let stats = { ...baseStats, ...roleBoosts[role.split(' ')[0]] };
    stats.CA = '14';
    stats.Velocidad = '30 pies';
    stats.Daño = '1d6';
    return stats;
}

function generateClassSkills(role) {
    const classSkills = { 'Guerrero': ['Golpe potente'], 'Mago': ['Lanzamiento de conjuros'], 'Clérigo': ['Curación divina'], 'Pícaro': ['Sigilo'],
                           'Bárbaro': ['Furia'], 'Bardo': ['Inspiración'], 'Explorador': ['Rastreo', 'Disparo Preciso'], 'Paladín': ['Golpe sagrado'],
                           'Druida': ['Forma salvaje'], 'Monje': ['Golpe de ki'], 'Hechicero': ['Explosión mágica'], 'Brujo': ['Pacto oscuro'],
                           'Alquimista': ['Poción explosiva'], 'Cazador de Demonios': ['Ataque demoníaco'], 'Caballero Negro': ['Golpe sombrío'],
                           'Artificiero': ['Dispositivo mágico'], 'Samurái': ['Corte preciso'], 'Guardabosques': ['Tiro certero'],
                           'Invocador': ['Invocación menor'], 'Nigromante': ['Resurrección menor'], 'Gladiador': ['Golpe teatral'],
                           'Mercenario': ['Ataque rápido'], 'Sacerdote de Guerra': ['Bendición bélica'], 'Maestro de Bestias': ['Llamado animal'],
                           'Espadachín': ['Estocada'], 'Ilusionista': ['Ilusión menor'] };
    return classSkills[role.split(' ')[0]] || ['Sin habilidades'];
}

function useClassSkill(skill, level) {
    const skillEffects = {
        'Rastreo': () => `Rastreo exitoso (1d20 + ${getProficiencyBonus(level)}): ${Math.floor(window.rng() * 20) + 1 + getProficiencyBonus(level)}`,
        'Disparo Preciso': () => `Daño adicional (1d4): +${Math.floor(window.rng() * 4) + 1}`,
        'Lanzamiento de conjuros': () => `Daño mágico (1d6): ${Math.floor(window.rng() * 6) + 1}`,
        'Golpe potente': () => `Daño extra (1d6): +${Math.floor(window.rng() * 6) + 1}`,
        'Curación divina': () => `Curación (1d6): +${Math.floor(window.rng() * 6) + 1} PV`,
        'Sigilo': () => `Sigilo exitoso (1d20 + ${getProficiencyBonus(level)}): ${Math.floor(window.rng() * 20) + 1 + getProficiencyBonus(level)}`,
        'Furia': () => `Daño aumentado (1d8): +${Math.floor(window.rng() * 8) + 1}`,
        'Inspiración': () => `Inspiración otorgada (+${getProficiencyBonus(level)})`,
        'Golpe sagrado': () => `Daño divino (1d6): ${Math.floor(window.rng() * 6) + 1}`,
        'Forma salvaje': () => 'Transformación activa (1d4 rondas)',
        'Golpe de ki': () => `Daño ki (1d4): +${Math.floor(window.rng() * 4) + 1}`,
        'Explosión mágica': () => `Daño mágico (1d8): ${Math.floor(window.rng() * 8) + 1}`,
        'Pacto oscuro': () => `Daño oscuro (1d6): ${Math.floor(window.rng() * 6) + 1}`,
        'Poción explosiva': () => `Daño explosivo (1d6): ${Math.floor(window.rng() * 6) + 1}`,
        'Ataque demoníaco': () => `Daño infernal (1d8): ${Math.floor(window.rng() * 8) + 1}`,
        'Golpe sombrío': () => `Daño sombrío (1d6): ${Math.floor(window.rng() * 6) + 1}`,
        'Dispositivo mágico': () => `Efecto mágico (1d4): +${Math.floor(window.rng() * 4) + 1}`,
        'Corte preciso': () => `Daño preciso (1d6): ${Math.floor(window.rng() * 6) + 1}`,
        'Tiro certero': () => `Daño certero (1d4): +${Math.floor(window.rng() * 4) + 1}`,
        'Invocación menor': () => 'Criatura invocada (1d4 HP)',
        'Resurrección menor': () => 'Esqueleto animado (1d6 HP)',
        'Golpe teatral': () => `Daño escénico (1d6): ${Math.floor(window.rng() * 6) + 1}`,
        'Ataque rápido': () => `Daño rápido (1d4): +${Math.floor(window.rng() * 4) + 1}`,
        'Bendición bélica': () => `Curación (1d6): +${Math.floor(window.rng() * 6) + 1} PV`,
        'Llamado animal': () => 'Aliado animal (1d4 rondas)',
        'Estocada': () => `Daño penetrante (1d6): ${Math.floor(window.rng() * 6) + 1}`,
        'Ilusión menor': () => 'Ilusión creada (1d4 rondas)'
    };
    return skillEffects[skill] ? skillEffects[skill]() : 'Habilidad no disponible';
}

/**
 * Genera y muestra la tarjeta del aliado en el DOM.
 * Esta función actualiza todos los elementos de la tarjeta de aliado con los datos proporcionados,
 * incluyendo atributos, estadísticas destacadas, detalles, narrativa, habilidades, etc.
 * Incluye manejo de errores para elementos DOM faltantes y optimizaciones para evitar recalculaciones.
 * @param {Object} allyData - Datos del aliado (name, type, role, level, stats, etc.)
 */
function generateAllyCard(allyData) {
    // Validación inicial de datos
    if (!allyData || !allyData.stats) {
        logger('encounters', 'generateAllyCard', 'Datos de aliado inválidos o faltantes', { allyData });
        return;
    }

    const card = document.getElementById('ally-card-container');
    if (!card) {
        logger('encounters', 'generateAllyCard', 'Contenedor de tarjeta de aliado no encontrado');
        return;
    }

    // Cálculos optimizados con caching para evitar recalculaciones
    const conMod = parseInt((allyData.stats.CON || '10 (+0)').split('+')[1]) || 0;
    const hp = calculateHitPoints(allyData.level, conMod, allyData.type);
    const primaryStat = getPrimaryStat(allyData.role);
    const mainAbilityMod = parseInt((allyData.stats[primaryStat] || '10 (+0)').split('+')[1]) || 0;
    const attackBonus = calculateAttackBonus(mainAbilityMod, allyData.level);
    const savingThrows = calculateSavingThrows(allyData.stats, allyData.level);
    const charismaMod = parseInt((allyData.stats.CAR || '10 (+0)').split('+')[1]) || 0;
    const loyalty = getLoyalty(charismaMod, allyData.role);
    const inventory = generateInventory(allyData.type, allyData.role);
    const specialAction = generateSpecialAction(allyData.traits, allyData.level);
    const classSkills = generateClassSkills(allyData.role);

    // Actualizar stats del aliado
    allyData.stats.HP = `${hp} (${Math.floor(hp / (conMod + 1))}d${Math.floor(hp / (conMod + 1) * 2)} + ${conMod * Math.floor(hp / (conMod + 1))})`;
    allyData.stats['Bonificador de Ataque'] = `+${attackBonus}`;
    allyData.stats['Salvaciones'] = `DES +${savingThrows.DES}, SAB +${savingThrows.SAB}`;
    allyData.stats['Acción especial'] = specialAction;
    allyData.stats['Lealtad'] = loyalty;
    allyData.stats['EXP'] = allyData.stats['EXP'] || 0;
    allyData.stats['Nivel'] = allyData.level;
    allyData.stats['Inventario'] = inventory.join(', ');
    allyData.classSkills = classSkills;

    // Actualizar elementos DOM con manejo de errores
    const allyNameEl = card.querySelector('#ally-name');
    if (allyNameEl) allyNameEl.innerHTML = `<i class="fas fa-user-shield"></i> ${allyData.name}`;

    const allyTypeEl = card.querySelector('#ally-type');
    if (allyTypeEl) allyTypeEl.textContent = `${allyData.type} • ${allyData.role} • Nivel ${allyData.level}`;

    // Bloque de atributos (FUE, DES, CON, INT, SAB, CAR)
    const abilityScores = card.querySelector('#ability-scores');
    if (abilityScores) {
        abilityScores.innerHTML = `
            <div class="stat-box">
                <i class="fas fa-dumbbell stat-icon"></i>
                <div class="stat-title">FUE</div>
                <div class="stat-value">${allyData.stats.FUE.split(' ')[0]}</div>
                <div class="stat-mod">(${allyData.stats.FUE.split(' (')[1].slice(0, -1)})</div>
            </div>
            <div class="stat-box">
                <i class="fas fa-running stat-icon"></i>
                <div class="stat-title">DES</div>
                <div class="stat-value">${allyData.stats.DES.split(' ')[0]}</div>
                <div class="stat-mod">(${allyData.stats.DES.split(' (')[1].slice(0, -1)})</div>
            </div>
            <div class="stat-box">
                <i class="fas fa-heart stat-icon"></i>
                <div class="stat-title">CON</div>
                <div class="stat-value">${allyData.stats.CON.split(' ')[0]}</div>
                <div class="stat-mod">(${allyData.stats.CON.split(' (')[1].slice(0, -1)})</div>
            </div>
            <div class="stat-box">
                <i class="fas fa-brain stat-icon"></i>
                <div class="stat-title">INT</div>
                <div class="stat-value">${allyData.stats.INT.split(' ')[0]}</div>
                <div class="stat-mod">(${allyData.stats.INT.split(' (')[1].slice(0, -1)})</div>
            </div>
            <div class="stat-box">
                <i class="fas fa-eye stat-icon"></i>
                <div class="stat-title">SAB</div>
                <div class="stat-value">${allyData.stats.SAB.split(' ')[0]}</div>
                <div class="stat-mod">(${allyData.stats.SAB.split(' (')[1].slice(0, -1)})</div>
            </div>
            <div class="stat-box">
                <i class="fas fa-theater-masks stat-icon"></i>
                <div class="stat-title">CAR</div>
                <div class="stat-value">${allyData.stats.CAR.split(' ')[0]}</div>
                <div class="stat-mod">(${allyData.stats.CAR.split(' (')[1].slice(0, -1)})</div>
            </div>
        `;
    }

    const statsHighlight = card.querySelector('#stats-highlight');
    if (statsHighlight) {
        statsHighlight.innerHTML = `
            <div class="hp-highlight"><i class="fas fa-heart stat-icon"></i>Puntos de Golpe: ${allyData.stats.HP}</div>
            <div><i class="fas fa-shield-alt stat-icon"></i>Clase de Armadura: ${allyData.stats.CA}</div>
            <div><i class="fas fa-running stat-icon"></i>Velocidad: ${allyData.stats.Velocidad}</div>
        `;
    }

    const statsDetail = card.querySelector('#stats-detail');
    if (statsDetail) {
        statsDetail.innerHTML = `
            <div><i class="fas fa-dice stat-icon"></i>Daño típico: ${allyData.stats.Daño}</div>
            <div><i class="fas fa-swords stat-icon"></i>Bonificador de Ataque: ${allyData.stats['Bonificador de Ataque']}</div>
            <div><i class="fas fa-shield stat-icon"></i>Salvaciones: ${allyData.stats['Salvaciones']}</div>
            <div><i class="fas fa-magic stat-icon"></i>Acción especial: ${allyData.stats['Acción especial']}</div>
            <div><i class="fas fa-handshake stat-icon"></i>Lealtad: <span class="loyalty-indicator ${loyalty === 'Alta' ? 'loyalty-high' : loyalty === 'Media' ? 'loyalty-medium' : 'loyalty-low'}">${allyData.stats['Lealtad']}</span></div>
            <div><i class="fas fa-star stat-icon"></i>EXP: ${allyData.stats['EXP']}</div>
            <button class="action-button" onclick="useSpecialAction()"><i class="fas fa-bolt"></i> Usar Acción Especial</button>
            <button class="exp-button" onclick="gainExperience()"><i class="fas fa-level-up-alt"></i> Ganar EXP</button>
        `;
    }

    const narrative = card.querySelector('#narrative');
    if (narrative) {
        narrative.innerHTML = `
            <i class="fas fa-book narrative-icon"></i>${allyData.name}, ${allyData.description}. <i class="fas fa-heart narrative-icon"></i>${allyData.loyaltyNote}. Encontrada en: <i class="fas fa-tree narrative-icon"></i>${allyData.habitat}.
        `;
    }

    const abilities = card.querySelector('#abilities-content');
    if (abilities) abilities.innerHTML = allyData.abilities.map(ab => `<li>${ab}</li>`).join('') || '<li>Sin habilidades</li>';

    const classAbilities = card.querySelector('#class-skills-content');
    if (classAbilities) classAbilities.innerHTML = allyData.classSkills.map(sk => `<li>${sk}</li>`).join('') || '<li>Sin habilidades</li>';

    const skillButtons = card.querySelector('#skill-buttons');
    if (skillButtons) skillButtons.innerHTML = allyData.classSkills.map(skill => `<button class="skill-button" onclick="useSkill('${skill}')"><i class="fas fa-star"></i> ${skill}</button>`).join(' ');

    const traits = card.querySelector('#traits-content');
    if (traits) traits.innerHTML = allyData.traits.map(tr => `<li>${tr}</li>`).join('') || '<li>Sin rasgos</li>';

    const inventorySection = card.querySelector('#inventory-content');
    if (inventorySection) inventorySection.innerHTML = inventory.map(it => `<li>${it}</li>`).join('');

    logger('encounters', 'generateAllyCard', `Tarjeta de aliado generada para ${allyData.name}`);
}

/**
 * Índice para alternar acciones especiales.
 */
let actionIndex = 0;

/**
 * Usa la acción especial del aliado, alternando entre opciones y mostrando resultados.
 * Actualiza el índice de acción y genera una respuesta de diálogo.
 */
window.useSpecialAction = function() {
    if (!window.ally || !window.ally.stats) {
        logger('encounters', 'useSpecialAction', 'No hay aliado disponible');
        return;
    }

    const d20 = Math.floor(window.rng() * 20) + 1;
    const actions = window.ally.stats['Acción especial'].split(' / ');
    const currentAction = actions[actionIndex % actions.length].trim();
    let result;

    if (currentAction.startsWith('+') && currentAction.includes('a Exploración')) {
        const bonus = parseInt(currentAction.match(/\+\d+/)[0]);
        result = d20 + bonus;
        document.getElementById('action-result').textContent = `Exploración: ${result} (1d20 + ${bonus})`;
    } else if (currentAction.includes('Curación')) {
        const die = parseInt(currentAction.match(/\d+/)[0]);
        result = Math.floor(window.rng() * die) + 1;
        document.getElementById('action-result').textContent = `Curación: +${result} PV (1d${die})`;
    }
    actionIndex++;
    generateDialogueResponse();
};

/**
 * Otorga experiencia al aliado, verificando si sube de nivel.
 * Actualiza la tarjeta si es necesario y verifica cambios en lealtad.
 */
window.gainExperience = function() {
    if (!window.ally || !window.ally.stats) {
        logger('encounters', 'gainExperience', 'No hay aliado disponible');
        return;
    }

    let exp = parseInt(window.ally.stats['EXP']) || 0;
    let level = parseInt(window.ally.level) || 1;
    exp += 100;

    if (exp >= level * 300) {
        level++;
        exp = 0;
        document.getElementById('exp-result').textContent = `¡${window.ally.name} sube a Nivel ${level}!`;
        window.ally.level = level.toString();
        window.ally.stats = customizeStats(window.ally.role, level);
        generateAllyCard(window.ally);
    } else {
        document.getElementById('exp-result').textContent = `${window.ally.name} gana 100 EXP. Total: ${exp} EXP`;
    }
    window.ally.stats['EXP'] = exp;
    // Actualizar en stats-detail
    const expDiv = document.querySelector('#stats-detail div:nth-child(6)');
    if (expDiv) expDiv.innerHTML = `<i class="fas fa-star stat-icon"></i>EXP: ${exp}`;
    checkLoyaltyShift();
};

/**
 * Genera una respuesta de diálogo basada en la lealtad y carisma del aliado.
 */
function generateDialogueResponse() {
    if (!window.ally || !window.ally.stats) return;

    const charismaMod = parseInt(window.ally.stats.CAR.split('+')[1]) || 0;
    const loyalty = window.ally.stats['Lealtad'];
    const dialogue = generateDialogue(loyalty, charismaMod);
    document.getElementById('dialogue-result').textContent = `${window.ally.name} dice: "${dialogue}"`;
}

/**
 * Verifica si la lealtad del aliado cambia basado en tiradas aleatorias.
 * Actualiza la lealtad y la interfaz si cambia.
 */
function checkLoyaltyShift() {
    if (!window.ally || !window.ally.stats) return;

    const charismaMod = parseInt(window.ally.stats.CAR.split('+')[1]) || 0;
    let currentLoyalty = window.ally.stats['Lealtad'];
    const roll = Math.floor(window.rng() * 20) + 1;

    if (currentLoyalty === 'Baja' && roll < 5 - charismaMod) {
        currentLoyalty = 'Desleal';
        document.getElementById('dialogue-result').textContent = `${window.ally.name} dice: "¡Me voy por mi cuenta!" (Desleal)`;
    } else if (currentLoyalty === 'Media' && roll > 15 + charismaMod) {
        currentLoyalty = 'Alta';
        document.getElementById('dialogue-result').textContent = `${window.ally.name} dice: "¡Confío más en ti ahora!" (Lealtad a Alta)`;
    }
    window.ally.stats['Lealtad'] = currentLoyalty;
    // Actualizar en stats-detail
    const loyaltyDiv = document.querySelector('#stats-detail div:nth-child(5) span');
    if (loyaltyDiv) {
        loyaltyDiv.textContent = currentLoyalty;
        loyaltyDiv.className = `loyalty-indicator ${currentLoyalty === 'Alta' ? 'loyalty-high' : currentLoyalty === 'Media' ? 'loyalty-medium' : 'loyalty-low'}`;
    }
}

/**
 * Usa una habilidad de clase del aliado y muestra el resultado.
 * @param {string} skill - Nombre de la habilidad a usar
 */
window.useSkill = function(skill) {
    if (!window.ally || !window.ally.level) {
        logger('encounters', 'useSkill', 'No hay aliado disponible');
        return;
    }

    const level = window.ally.level;
    const result = useClassSkill(skill, level);
    document.getElementById('action-result').textContent = `${skill}: ${result}`;
    generateDialogueResponse();
};

/**
 * Guarda el aliado actual en localStorage.
 */
window.saveAlly = function() {
    if (window.ally) {
        localStorage.setItem('savedAlly', JSON.stringify(window.ally));
        alert(`${window.ally.name} ha sido guardado.`);
    } else {
        alert('No hay aliado para guardar.');
    }
};

/**
 * Carga un aliado guardado desde localStorage y actualiza la tarjeta.
 */
window.loadAlly = function() {
    const savedAlly = localStorage.getItem('savedAlly');
    if (savedAlly) {
        window.ally = JSON.parse(savedAlly);
        const allyCard = document.getElementById('ally-card-container');
        if (allyCard) {
            allyCard.style.display = 'block';
            generateAllyCard(window.ally);
            addToHistory('encounters', `Aliado: ${window.ally.type} ${window.ally.role.split(' ')[0]}, Habilidad: ${window.ally.abilities[0]}, Rasgo: ${window.ally.traits[0]}`);
        }
    } else {
        alert('No hay aliado guardado.');
    }
};

/**
 * Genera un aliado de ejemplo aleatorio y muestra su tarjeta.
 */
window.generateSampleAlly = function() {
    const skills = ['Combate', 'Magia', 'Sigilo', 'Conocimiento', 'Curación', 'Persuasión'];
    const race = safeRandom(npcRaces);
    const className = safeRandom(npcClasses);
    const skill = safeRandom(skills);
    const trait = safeRandom(npcTraits);
    const role = `${className} leal`;
    const level = '1';
    const randomName = safeRandom(allyNames);
    const description = `una ${race.toLowerCase()} que busca aventuras`;
    const loyaltyNote = 'Leal mientras se cumpla su código';
    const habitat = safeRandom(['Bosque encantado', 'Montaña nevada', 'Ruinas antiguas', 'Desierto ardiente', 'Cueva profunda', 'Ciudad flotante']);

    window.ally = {
        name: randomName,
        type: race,
        role: role,
        level: level,
        description: description,
        loyaltyNote: loyaltyNote,
        habitat: habitat,
        stats: customizeStats(className, level),
        abilities: [skill, 'Percepción'],
        traits: [trait, safeRandom(npcTraits)],
        specialAction: '+2 a Exploración / +1d4 Curación',
        classSkills: generateClassSkills(className)
    };

    const allyCard = document.getElementById('ally-card-container');
    if (allyCard) {
        allyCard.style.display = 'block';
        generateAllyCard(window.ally);
    }
};

function generateMonster() {
    logger('encounters', 'generateMonster', 'Iniciando generación de monstruo');
    logger('encounters', 'generateMonster', `window.monsters definido: ${!!window.monsters}, keys: ${window.monsters ? Object.keys(window.monsters).length : 'undefined'}`);
    if (!window.monsters) {
        logger('encounters', 'generateMonster', 'Cargando datos de monstruos desde monsters.json');
        displayResult('encounters', 'Loading monsters data...');
        fetch('./monsters.json')
            .then(response => response.json())
            .then(data => {
                window.monsters = data;
                logger('encounters', 'generateMonster', 'Datos de monstruos cargados, reintentando generación');
                generateMonster(); // retry
            })
            .catch(error => {
                console.error('Error loading monsters:', error);
                logger('encounters', 'generateMonster', `Error cargando monstruos: ${error.message}`);
                displayResult('encounters', 'Error loading monsters data.');
            });
        return;
    }
    const monsterNames = Object.keys(window.monsters);
    const monsterName = getRandomElement(monsterNames);
    const monster = window.monsters[monsterName];

    const res = `Monstruo: ${monster.name} (${monster.meta})`;
    logger('encounters', 'generateMonster', `Monstruo generado: ${monster.name}`);
    document.getElementById('encounter-result').textContent = res;
    addToHistory('encounters', res);

    const monsterCard = document.getElementById('monster-card-container');
    if (monsterCard) {
        // Clear previous monster card content
        const nameEl = monsterCard.querySelector('#monster-name');
        if (nameEl) nameEl.innerHTML = '';
        const metaEl = monsterCard.querySelector('#monster-meta');
        if (metaEl) metaEl.innerHTML = '';
        const statsEl = monsterCard.querySelector('#monster-stats');
        if (statsEl) statsEl.innerHTML = '';
        const traitsEl = monsterCard.querySelector('#monster-traits');
        if (traitsEl) traitsEl.innerHTML = '';
        const actionsEl = monsterCard.querySelector('#monster-actions');
        if (actionsEl) actionsEl.innerHTML = '';
        monsterCard.style.display = 'block';
        generateMonsterCard(monster);
    }
    logger('encounters', 'generateMonster', 'Monstruo generado y mostrado');
}

// Expose functions globally
window.generateEncounter = generateEncounter;
window.clearEncounters = clearEncounters;
window.generateNpc = generateNpc;
window.generateVillain = generateVillain;
window.generateAlly = generateAlly;
window.generateMonster = generateMonster;
window.saveAlly = saveAlly;
window.loadAlly = loadAlly;
window.generateSampleAlly = generateSampleAlly;

// Función para mostrar la tarjeta del monstruo
function generateMonsterCard(monster) {
    const card = document.getElementById('monster-card-container');
    if (!card) return;

    // Nombre
    const monsterNameEl = card.querySelector('#monster-name');
    if (monsterNameEl) monsterNameEl.innerHTML = `<i class="fas fa-dragon"></i> ${monster.name}`;

    // Meta
    const monsterMetaEl = card.querySelector('#monster-meta');
    if (monsterMetaEl) monsterMetaEl.innerHTML = `<i class="fas fa-info-circle"></i> ${monster.meta}`;

    // Atributos (FUE, DES, CON, INT, SAB, CAR)
    const abilityScores = card.querySelector('#monster-stats');
    if (abilityScores) {
        abilityScores.innerHTML = `
            <div class="stat-box">
                <i class="fas fa-dumbbell stat-icon"></i>
                <div class="stat-title">FUE</div>
                <div class="stat-value">${monster.STR || 'N/A'}</div>
                <div class="stat-mod">${monster.STR_mod || 'N/A'}</div>
            </div>
            <div class="stat-box">
                <i class="fas fa-running stat-icon"></i>
                <div class="stat-title">DES</div>
                <div class="stat-value">${monster.DEX || 'N/A'}</div>
                <div class="stat-mod">${monster.DEX_mod || 'N/A'}</div>
            </div>
            <div class="stat-box">
                <i class="fas fa-heart stat-icon"></i>
                <div class="stat-title">CON</div>
                <div class="stat-value">${monster.CON || 'N/A'}</div>
                <div class="stat-mod">${monster.CON_mod || 'N/A'}</div>
            </div>
            <div class="stat-box">
                <i class="fas fa-brain stat-icon"></i>
                <div class="stat-title">INT</div>
                <div class="stat-value">${monster.INT || 'N/A'}</div>
                <div class="stat-mod">${monster.INT_mod || 'N/A'}</div>
            </div>
            <div class="stat-box">
                <i class="fas fa-eye stat-icon"></i>
                <div class="stat-title">SAB</div>
                <div class="stat-value">${monster.WIS || 'N/A'}</div>
                <div class="stat-mod">${monster.WIS_mod || 'N/A'}</div>
            </div>
            <div class="stat-box">
                <i class="fas fa-theater-masks stat-icon"></i>
                <div class="stat-title">CAR</div>
                <div class="stat-value">${monster.CHA || 'N/A'}</div>
                <div class="stat-mod">${monster.CHA_mod || 'N/A'}</div>
            </div>
        `;
    }

    // Estadísticas destacadas (CA, HP, Velocidad)
    const statsHighlight = card.querySelector('#monster-stats-highlight');
    if (statsHighlight) {
        statsHighlight.innerHTML = `
            <div class="hp-highlight"><i class="fas fa-heart stat-icon"></i>Puntos de Golpe: ${monster['Hit Points'] || 'N/A'}</div>
            <div><i class="fas fa-shield-alt stat-icon"></i>Clase de Armadura: ${monster['Armor Class'] || 'N/A'}</div>
            <div><i class="fas fa-running stat-icon"></i>Velocidad: ${monster['Speed'] || 'N/A'}</div>
        `;
    }

    // Rasgos
    const traits = card.querySelector('#monster-traits');
    if (traits) {
        traits.innerHTML = monster['Traits'] ? monster['Traits'] : '<li>Sin rasgos</li>';
    }

    // Acciones
    const actions = card.querySelector('#monster-actions');
    if (actions) {
        actions.innerHTML = monster['Actions'] ? monster['Actions'] : '<li>Sin acciones</li>';
    }
}