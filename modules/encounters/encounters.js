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
    if (allyCard) {
        allyCard.style.display = 'none';
        // Clear ally card content to prevent remnants
        const allyNameEl = allyCard.querySelector('#ally-name');
        if (allyNameEl) allyNameEl.innerHTML = '';
        const allyTypeEl = allyCard.querySelector('#ally-type');
        if (allyTypeEl) allyTypeEl.innerHTML = '';
        const abilityScores = allyCard.querySelector('#ability-scores');
        if (abilityScores) abilityScores.innerHTML = '';
        const statsHighlight = allyCard.querySelector('#stats-highlight');
        if (statsHighlight) statsHighlight.innerHTML = '';
        const statsDetail = allyCard.querySelector('#stats-detail');
        if (statsDetail) statsDetail.innerHTML = '';
        const narrative = allyCard.querySelector('#narrative');
        if (narrative) narrative.innerHTML = '';
        const abilities = allyCard.querySelector('#abilities-content');
        if (abilities) abilities.innerHTML = '';
        const classSkills = allyCard.querySelector('#class-skills-content');
        if (classSkills) classSkills.innerHTML = '';
        const skillButtons = allyCard.querySelector('#skill-buttons');
        if (skillButtons) skillButtons.innerHTML = '';
        const traits = allyCard.querySelector('#traits-content');
        if (traits) traits.innerHTML = '';
        const inventory = allyCard.querySelector('#inventory-content');
        if (inventory) inventory.innerHTML = '';
        // Clear action results
        const actionResult = document.getElementById('action-result');
        if (actionResult) actionResult.textContent = '';
        const expResult = document.getElementById('exp-result');
        if (expResult) expResult.textContent = '';
        const dialogueResult = document.getElementById('dialogue-result');
        if (dialogueResult) dialogueResult.textContent = '';
    }
    const monsterCard = document.getElementById('monster-card-container');
    if (monsterCard) {
        monsterCard.style.display = 'none';
        // Clear monster card content to prevent remnants
        const monsterNameEl = monsterCard.querySelector('#monster-name');
        if (monsterNameEl) monsterNameEl.innerHTML = '';
        const monsterMetaEl = monsterCard.querySelector('#monster-meta');
        if (monsterMetaEl) monsterMetaEl.innerHTML = '';
        const monsterStats = monsterCard.querySelector('#monster-stats');
        if (monsterStats) monsterStats.innerHTML = '';
        const monsterStatsHighlight = monsterCard.querySelector('#monster-stats-highlight');
        if (monsterStatsHighlight) monsterStatsHighlight.innerHTML = '';
        const monsterTraits = monsterCard.querySelector('#monster-traits');
        if (monsterTraits) monsterTraits.innerHTML = '';
        const monsterActions = monsterCard.querySelector('#monster-actions');
        if (monsterActions) monsterActions.innerHTML = '';
    }
    logger('encounters', 'clearEncounters', 'Limpieza completada');
}

// =========================================================================
// Sección: Funciones auxiliares para equilibrio
// =========================================================================

/**
 * Calcula el CR efectivo basado en stats del aliado/monstruo, usando fórmulas simplificadas del DMG.
 * @param {Object} stats - Stats del personaje (HP, attackBonus, etc.)
 * @returns {number} CR estimado
 */
function calculateEffectiveCR(stats) {
    const hp = parseInt(stats.HP) || 0;
    const attackBonus = parseInt(stats['Bonificador de Ataque']) || 0;
    const ac = parseInt(stats.CA) || 10;
    const damage = stats.Daño || '1d6';

    // Fórmula simplificada: CR ≈ (HP / 20) + (attackBonus / 2) + (ac / 5) - 5
    let cr = Math.floor((hp / 20) + (attackBonus / 2) + (ac / 5) - 5);
    return Math.max(1, Math.min(20, cr)); // Clamp entre 1 y 20
}

// Funciones de mapeo para iconos dinámicos
function getIconForAlignment(alignment) {
    const icons = {
        'bueno': 'fa-heart',
        'malvado': 'fa-skull',
        'neutral': 'fa-balance-scale',
        'caótico': 'fa-dizzy',
        'legal': 'fa-gavel'
    };
    // Parsear alineamiento compuesto, e.g. "malvado legal" -> "malvado" y "legal"
    const parts = alignment.toLowerCase().split(' ');
    for (let part of parts) {
        if (icons[part]) return icons[part];
    }
    return 'fa-question';
}

function getIconForType(type) {
    const icons = {
        'dragón': 'fa-dragon',
        'humanoide': 'fa-user',
        'bestia': 'fa-paw',
        'monstruosidad': 'fa-spider',
        'no': 'fa-skull-crossbones', // para "no muerto"
        'constructo': 'fa-cogs',
        'planta': 'fa-leaf',
        'elemental': 'fa-fire',
        'hada': 'fa-magic',
        'gigante': 'fa-mountain',
        'diablo': 'fa-devil',
        'celestial': 'fa-angel',
        'aberración': 'fa-eye',
        'limo': 'fa-tint'
    };
    return icons[type.toLowerCase()] || 'fa-question';
}

function getIconForClass(className) {
    const icons = {
        'guerrero': 'fa-sword',
        'mago': 'fa-magic',
        'clérigo': 'fa-pray',
        'pícaro': 'fa-dagger',
        'bárbaro': 'fa-axe-battle',
        'bardo': 'fa-music',
        'explorador': 'fa-bow-arrow',
        'paladín': 'fa-shield-alt',
        'druida': 'fa-leaf',
        'monje': 'fa-fist-raised',
        'hechicero': 'fa-wand-magic',
        'brujo': 'fa-book-dead',
        'alquimista': 'fa-flask',
        'cazador': 'fa-crosshairs',
        'caballero': 'fa-chess-knight',
        'artificiero': 'fa-tools',
        'samurái': 'fa-sword',
        'guardabosques': 'fa-tree',
        'invocador': 'fa-hand-sparkles',
        'nigromante': 'fa-skull',
        'gladiador': 'fa-fist-raised',
        'mercenario': 'fa-coins',
        'sacerdote': 'fa-hammer-war',
        'maestro': 'fa-dragon',
        'espadachín': 'fa-sword',
        'ilusionista': 'fa-eye'
    };
    return icons[className.toLowerCase()] || 'fa-user';
}

function getIconForDamageType(damageType) {
    const icons = {
        'fuego': 'fa-fire',
        'frío': 'fa-snowflake',
        'eléctrico': 'fa-bolt',
        'veneno': 'fa-skull-poison',
        'ácido': 'fa-flask',
        'fuerza': 'fa-fist-raised',
        'necrótico': 'fa-skull',
        'psíquico': 'fa-brain',
        'radiante': 'fa-sun',
        'trueno': 'fa-volume-up'
    };
    return icons[damageType.toLowerCase()] || 'fa-dice-d20';
}

function parseMonsterMeta(meta) {
    // Ejemplo: "Aberración grande, malvado legal"
    const parts = meta.split(',');
    const typeSize = parts[0].trim();
    const alignment = parts[1] ? parts[1].trim() : '';
    const type = typeSize.split(' ')[0]; // Primera palabra
    return { type, alignment };
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

const traitDescriptions = {
    'Amigable': 'Siempre dispuesto a ayudar, facilita interacciones positivas y reduce tensiones en el grupo.',
    'Desconfiado': 'Dudoso de extraños, puede causar conflictos pero es cauteloso en situaciones peligrosas.',
    'Nervioso': 'Ansioso en combate, pero alerta a amenazas ocultas, otorgando +1 a iniciativas.',
    'Valiente': 'Enfrenta el peligro sin miedo, inspirando coraje en aliados cercanos.',
    'Sabio': 'Posee conocimiento antiguo, puede proporcionar pistas o consejos valiosos.',
    'Hábil': 'Diestro en tareas manuales, añade +1d4 a tiradas de habilidad relacionadas.',
    'Astuto': 'Inteligente y tramposo, bueno para engaños y planes complicados.',
    'Honorable': 'Sigue un código estricto, nunca traiciona pero puede ser inflexible.'
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
    const cr = parseFloat(document.getElementById('encounter-cr').value) || 1;
    const crInt = Math.max(1, Math.floor(cr)); // CR como entero, mínimo 1
    const skills = ['Combate', 'Magia', 'Sigilo', 'Conocimiento', 'Curación', 'Persuasión'];
    const race = safeRandom(npcRaces);
    const className = safeRandom(npcClasses);
    const skill = safeRandom(skills);
    const trait = safeRandom(npcTraits);
    const role = `${className} leal`;
    const randomName = safeRandom(allyNames);
    const description = `una ${race.toLowerCase()} que ${safeRandom(npcGoals).toLowerCase()}`;
    const loyaltyNote = `Leal mientras se cumpla su ${safeRandom(npcGoals).toLowerCase()}`;
    const habitat = safeRandom(['Bosque encantado', 'Montaña nevada', 'Ruinas antiguas', 'Desierto ardiente', 'Cueva profunda', 'Ciudad flotante']);

    const stats = customizeStats(className, crInt);
    // Calcular HP usando crProgression
    const progression = crProgression[crInt] || crProgression[1];
    const conMod = parseInt(stats.CON.split('(')[1].split(')')[0]) || 0;
    const hpDice = progression.hpDice;
    const hpCount = parseInt(hpDice.split('d')[0]);
    const hpDie = parseInt(hpDice.split('d')[1]);
    const averageHp = Math.floor((hpDie / 2) + 0.5) * hpCount + (conMod * hpCount);
    stats.HP = `${averageHp} (${hpCount}d${hpDie} + ${conMod * hpCount})`;

    window.ally = {
        name: randomName,
        type: race,
        role: role,
        level: crInt.toString(), // Usar CR como level
        description: description,
        loyaltyNote: loyaltyNote,
        habitat: habitat,
        stats: stats,
        abilities: [skill, 'Percepción'],
        traits: [trait, safeRandom(npcTraits)].map(t => ({name: t, description: traitDescriptions[t] || 'Rasgo único que influye en su comportamiento y decisiones en el juego.'})),
        specialAction: generateSpecialAction([trait, safeRandom(npcTraits)], crInt),
        classSkills: generateClassSkills(className, crInt)
    };

    const res = `Aliado: ${race} ${className}, Habilidad: ${skill}, Rasgo: ${trait}`;
    logger('encounters', 'generateAlly', `Aliado generado: ${randomName}, ${race} ${className}`);
    document.getElementById('encounter-result').textContent = res;
    addToHistory('encounters', res);

    const allyCard = document.getElementById('ally-card-container');
    if (allyCard) {
        // Hide monster card if visible
        const monsterCard = document.getElementById('monster-card-container');
        if (monsterCard && monsterCard.style.display !== 'none') {
            monsterCard.style.display = 'none';
        }
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
 * Devuelve una descripción narrativa y mecánica, similar a traits de monstruos.
 * @param {Array} traits - Rasgos del aliado
 * @param {string} level - Nivel del aliado
 * @returns {string} Descripción completa de la acción especial
 */
function generateSpecialAction(traits, level) {
    const lvl = parseInt(level) || 1;
    const actions = [
        {name: 'Ayuda Exploratoria', description: `El aliado asiste en la exploración, otorgando +${2 + Math.floor(lvl / 2)} a tiradas de Percepción o Supervivencia. Narrativamente, su experiencia local guía al grupo a través de terrenos peligrosos.`},
        {name: 'Curación Rápida', description: `Proporciona curación inmediata, restaurando ${4 + lvl} puntos de golpe. Mecánicamente, cura como un hechizo de curación menor, con un efecto narrativo de primeros auxilios expertos.`},
        {name: 'Inspiración Valiente', description: `Motiva a los aliados cercanos, otorgando +1d${4 + Math.floor(lvl / 3)} a la próxima tirada. En la historia, sus palabras valientes elevan el ánimo del grupo en momentos de duda.`},
        {name: 'Ataque de Oportunidad', description: `Realiza un ataque sorpresa, causando 1d${6 + Math.floor(lvl / 2)} daño. Narrativamente, aprovecha una distracción para golpear con precisión letal.`}
    ];
    const selected = safeRandom(actions);
    return `${selected.name.toUpperCase()}. ${selected.description}`;
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

function customizeStats(role, cr) {
    const crVal = parseInt(cr) || 1;
    const progression = crProgression[crVal] || crProgression[1]; // Fallback a CR 1
    const baseStats = { FUE: 10, DES: 10, CON: 10, INT: 10, SAB: 10, CAR: 10 };
    const primaryStat = getPrimaryStat(role);

    // Escalar stat primaria: base 13 + 1 por CR (similar a nivel)
    baseStats[primaryStat] = 13 + (crVal - 1);
    // Otras stats aumentan ligeramente: +1 por cada 3 CR
    Object.keys(baseStats).forEach(stat => {
        if (stat !== primaryStat) {
            baseStats[stat] += Math.floor((crVal - 1) / 3);
        }
    });

    // Formatear como 'valor (+mod)'
    const formattedStats = {};
    Object.keys(baseStats).forEach(stat => {
        const val = baseStats[stat];
        const mod = Math.floor((val - 10) / 2);
        formattedStats[stat] = `${val} (${mod >= 0 ? '+' : ''}${mod})`;
    });

    // Usar valores de crProgression para CA, daño, etc.
    formattedStats.CA = progression.acBase;
    formattedStats.Velocidad = '30 pies';
    formattedStats.Daño = progression.damage;
    formattedStats['Bonificador de Ataque'] = `+${progression.attackBonus}`;
    formattedStats['Proficiency Bonus'] = progression.proficiencyBonus;

    return formattedStats;
}

function generateClassSkills(role, level) {
    const classSkills = {
        'Guerrero': [{name: 'Golpe potente', description: 'Un ataque poderoso que inflige daño extra. Mecánicamente, añade +1d6 de daño por nivel del aliado.'}],
        'Mago': [{name: 'Lanzamiento de conjuros', description: 'Invoca magia arcana para diversos efectos. Permite lanzar hechizos básicos con bonificador de ataque igual al nivel.'}],
        'Clérigo': [{name: 'Curación divina', description: 'Canaliza energía sagrada para sanar heridas. Cura 1d8 + modificador de Sabiduría puntos de golpe.'}],
        'Pícaro': [{name: 'Sigilo', description: 'Se mueve silenciosamente y evade detección. Otorga ventaja en tiradas de Sigilo y permite ataques sorpresa.'}],
        'Bárbaro': [{name: 'Furia', description: 'Entra en un trance de ira bestial. Aumenta daño y resistencia, durando 1d4 rondas.'}],
        'Bardo': [{name: 'Inspiración', description: 'Motiva a los aliados con música o palabras. Otorga +1d6 a una tirada de un aliado cercano.'}],
        'Explorador': [{name: 'Rastreo', description: 'Sigue huellas y rastrea criaturas. Éxito automático en terrenos favorables, +bonificador en otros.'}, {name: 'Disparo Preciso', description: 'Apunta con precisión letal. Ignora cobertura parcial y añade +1d4 daño.'}],
        'Paladín': [{name: 'Golpe sagrado', description: 'Infunde el ataque con luz divina. Causa daño radiante extra igual al nivel del aliado.'}],
        'Druida': [{name: 'Forma salvaje', description: 'Se transforma en animal. Gana velocidad y sentidos mejorados por 1d4 rondas.'}],
        'Monje': [{name: 'Golpe de ki', description: 'Golpea con energía interna. Añade +1d4 daño y puede empujar al objetivo.'}],
        'Hechicero': [{name: 'Explosión mágica', description: 'Libera una ráfaga de energía. Daño de 1d6 por nivel en área pequeña.'}],
        'Brujo': [{name: 'Pacto oscuro', description: 'Invoca ayuda de un patrón sobrenatural. Invoca un aliado menor o lanza una maldición.'}],
        'Alquimista': [{name: 'Poción explosiva', description: 'Lanza una bomba alquímica. Causa 1d6 daño de ácido en explosión.'}],
        'Cazador de Demonios': [{name: 'Ataque demoníaco', description: 'Golpea con odio infernal. +1d6 daño necrótico y debilita al demonio.'}],
        'Caballero Negro': [{name: 'Golpe sombrío', description: 'Ataca desde las sombras. Daño extra y reduce velocidad del objetivo.'}],
        'Artificiero': [{name: 'Dispositivo mágico', description: 'Activa un gadget inventado. Efecto varía: daño, curación o utilidad.'}],
        'Samurái': [{name: 'Corte preciso', description: 'Un tajo maestro. Ignora armadura y añade +1d6 daño.'}],
        'Guardabosques': [{name: 'Tiro certero', description: 'Dispara con puntería infalible. Golpea automáticamente si el objetivo es visible.'}],
        'Invocador': [{name: 'Invocación menor', description: 'Llama a una criatura elemental. Aparece un elemental pequeño con 1d6 PV.'}],
        'Nigromante': [{name: 'Resurrección menor', description: 'Levanta un esqueleto. Crea un esqueleto guerrero con 1d6 PV.'}],
        'Gladiador': [{name: 'Golpe teatral', description: 'Un ataque dramático. +1d6 daño y asusta a espectadores cercanos.'}],
        'Mercenario': [{name: 'Ataque rápido', description: 'Golpea velozmente. Permite un ataque extra por ronda.'}],
        'Sacerdote de Guerra': [{name: 'Bendición bélica', description: 'Inspira valor en batalla. +1 a ataques y daño para aliados cercanos.'}],
        'Maestro de Bestias': [{name: 'Llamado animal', description: 'Convoca bestias aliadas. Aparecen 1d4 animales con 1d4 PV cada uno.'}],
        'Espadachín': [{name: 'Estocada', description: 'Una puñalada precisa. Ignora armadura y añade +1d6 daño perforante.'}],
        'Ilusionista': [{name: 'Ilusión menor', description: 'Crea una ilusión convincente. Engaña sentidos por 1d4 rondas.'}]
    };
    return classSkills[role.split(' ')[0]] || [{name: 'Sin habilidades', description: 'Este aliado no tiene habilidades especiales definidas.'}];
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
    const primaryStat = getPrimaryStat(allyData.role);
    const mainAbilityMod = parseInt((allyData.stats[primaryStat] || '10 (+0)').split('+')[1]) || 0;
    const attackBonus = parseInt(allyData.stats['Bonificador de Ataque']) || 0;
    const savingThrows = calculateSavingThrows(allyData.stats, allyData.level);
    const charismaMod = parseInt((allyData.stats.CAR || '10 (+0)').split('+')[1]) || 0;
    const loyalty = getLoyalty(charismaMod, allyData.role);
    const inventory = generateInventory(allyData.type, allyData.role);
    const specialAction = generateSpecialAction(allyData.traits, allyData.level);
    const classSkills = generateClassSkills(allyData.role);

    // Actualizar stats del aliado (HP ya calculado en generateAlly)
    allyData.stats['Salvaciones'] = `DES +${savingThrows.DES}, SAB +${savingThrows.SAB}`;
    allyData.stats['Acción especial'] = specialAction;
    allyData.stats['Lealtad'] = loyalty;
    allyData.stats['EXP'] = allyData.stats['EXP'] || 0;
    allyData.stats['Nivel'] = allyData.level;
    allyData.stats['Inventario'] = inventory.join(', ');
    allyData.classSkills = classSkills;

    // Actualizar elementos DOM con manejo de errores
    const allyNameEl = card.querySelector('#ally-name');
    if (allyNameEl) allyNameEl.innerHTML = `<i class="fas ${getIconForClass(allyData.role.split(' ')[0])}"></i> ${allyData.name}`;

    const allyTypeEl = card.querySelector('#ally-type');
    if (allyTypeEl) allyTypeEl.innerHTML = `<i class="fas ${getIconForType(allyData.type)}"></i> ${allyData.type} • <i class="fas ${getIconForClass(allyData.role.split(' ')[0])}"></i> ${allyData.role} • Nivel ${allyData.level}`;

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
    if (abilities) abilities.innerHTML = allyData.abilities.map(ab => `<li>${ab.toUpperCase()}</li>`).join('') || '<li>Sin habilidades</li>';

    const classAbilities = card.querySelector('#class-skills-content');
    if (classAbilities) classAbilities.innerHTML = allyData.classSkills.map(sk => `<li><strong>${sk.name.toUpperCase()}.</strong> ${sk.description}</li>`).join('') || '<li>Sin habilidades</li>';

    const skillButtons = card.querySelector('#skill-buttons');
    if (skillButtons) skillButtons.innerHTML = allyData.classSkills.map(skill => `<button class="skill-button" onclick="useSkill('${skill.name}')"><i class="fas fa-star"></i> ${skill.name}</button>`).join(' ');

    const traits = card.querySelector('#traits-content');
    if (traits) traits.innerHTML = allyData.traits.map(tr => `<li><strong>${tr.name.toUpperCase()}.</strong> ${tr.description}</li>`).join('') || '<li>Sin rasgos</li>';

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
    let cr = parseInt(window.ally.level) || 1; // CR como level
    exp += 100;

    if (exp >= cr * 300) {
        cr++;
        exp = 0;
        document.getElementById('exp-result').textContent = `¡${window.ally.name} sube a CR ${cr}!`;
        window.ally.level = cr.toString();
        window.ally.stats = customizeStats(window.ally.role, cr);
        // Recalcular HP
        const progression = crProgression[cr] || crProgression[1];
        const conMod = parseInt(window.ally.stats.CON.split('(')[1].split(')')[0]) || 0;
        const hpDice = progression.hpDice;
        const hpCount = parseInt(hpDice.split('d')[0]);
        const hpDie = parseInt(hpDice.split('d')[1]);
        const averageHp = Math.floor((hpDie / 2) + 0.5) * hpCount + (conMod * hpCount);
        window.ally.stats.HP = `${averageHp} (${hpCount}d${hpDie} + ${conMod * hpCount})`;
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
 * Guarda el aliado actual en localStorage como parte de un array de aliados guardados.
 */
window.saveAlly = function() {
    if (window.ally) {
        let savedAllies = JSON.parse(localStorage.getItem('savedAllies')) || [];
        // Verificar si ya existe un aliado con el mismo nombre, reemplazarlo
        const existingIndex = savedAllies.findIndex(a => a.name === window.ally.name);
        if (existingIndex !== -1) {
            savedAllies[existingIndex] = { id: Date.now(), name: window.ally.name, data: window.ally };
        } else {
            savedAllies.push({ id: Date.now(), name: window.ally.name, data: window.ally });
        }
        localStorage.setItem('savedAllies', JSON.stringify(savedAllies));
        alert(`${window.ally.name} ha sido guardado.`);
    } else {
        alert('No hay aliado para guardar.');
    }
};

/**
 * Carga un aliado guardado desde localStorage y actualiza la tarjeta.
 * Si hay múltiples aliados guardados, muestra un selector para elegir cuál cargar.
 */
window.loadAlly = function() {
    // Migrar de versión anterior si existe
    if (!localStorage.getItem('savedAllies') && localStorage.getItem('savedAlly')) {
        const oldAlly = JSON.parse(localStorage.getItem('savedAlly'));
        const savedAllies = [{ id: Date.now(), name: oldAlly.name, data: oldAlly }];
        localStorage.setItem('savedAllies', JSON.stringify(savedAllies));
        localStorage.removeItem('savedAlly');
    }
    const savedAllies = JSON.parse(localStorage.getItem('savedAllies')) || [];
    const select = document.getElementById('ally-select');

    if (savedAllies.length === 0) {
        alert('No hay aliados guardados.');
        return;
    }

    let allyToLoad;
    if (savedAllies.length === 1) {
        allyToLoad = savedAllies[0].data;
        select.style.display = 'none';
    } else {
        // Si hay múltiples, mostrar selector si no está visible
        if (select.style.display === 'none') {
            select.innerHTML = '<option value="">Selecciona un aliado</option>';
            savedAllies.forEach(ally => {
                const option = document.createElement('option');
                option.value = ally.id;
                option.textContent = ally.name;
                select.appendChild(option);
            });
            select.style.display = 'block';
            alert('Selecciona un aliado del dropdown y presiona Cargar de nuevo.');
            return;
        } else {
            // Cargar el seleccionado
            const selectedId = select.value;
            if (!selectedId) {
                alert('Selecciona un aliado.');
                return;
            }
            const selectedAlly = savedAllies.find(a => a.id == selectedId);
            if (selectedAlly) {
                allyToLoad = selectedAlly.data;
                select.style.display = 'none';
            } else {
                alert('Aliado no encontrado.');
                return;
            }
        }
    }

    if (allyToLoad) {
        window.ally = allyToLoad;
        const allyCard = document.getElementById('ally-card-container');
        if (allyCard) {
            // Hide monster card if visible
            const monsterCard = document.getElementById('monster-card-container');
            if (monsterCard && monsterCard.style.display !== 'none') {
                monsterCard.style.display = 'none';
            }
            allyCard.style.display = 'block';
            generateAllyCard(window.ally);
            addToHistory('encounters', `Aliado cargado: ${window.ally.name}, ${window.ally.type} ${window.ally.role.split(' ')[0]}`);
        }
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

    // Si no tiene Challenge, calcular CR efectivo basado en stats
    if (!monster.Challenge) {
        const effectiveCR = calculateEffectiveCR({
            HP: monster['Hit Points'] || '0',
            'Bonificador de Ataque': monster['Actions'] ? monster['Actions'].match(/\+(\d+)/)?.[1] || '0' : '0',
            CA: monster['Armor Class'] || '10',
            Daño: monster['Actions'] ? monster['Actions'].match(/(\d+d\d+)/)?.[1] || '1d6' : '1d6'
        });
        monster.Challenge = `${effectiveCR} (${effectiveCR * 100} XP)`;
        logger('encounters', 'generateMonster', `CR calculado para ${monster.name}: ${monster.Challenge}`);
    }

    const res = `Monstruo: ${monster.name} (${monster.meta})`;
    logger('encounters', 'generateMonster', `Monstruo generado: ${monster.name}`);
    document.getElementById('encounter-result').textContent = res;
    addToHistory('encounters', res);

    const monsterCard = document.getElementById('monster-card-container');
    if (monsterCard) {
        // Hide ally card if visible
        const allyCard = document.getElementById('ally-card-container');
        if (allyCard && allyCard.style.display !== 'none') {
            allyCard.style.display = 'none';
        }
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

// Función para mostrar la tarjeta del monstruo
function generateMonsterCard(monster) {
    const card = document.getElementById('monster-card-container');
    if (!card) return;

    const parsed = parseMonsterMeta(monster.meta);

    // Nombre
    const monsterNameEl = card.querySelector('#monster-name');
    if (monsterNameEl) monsterNameEl.innerHTML = `<i class="fas ${getIconForType(parsed.type)}"></i> ${monster.name}`;

    // Meta
    const monsterMetaEl = card.querySelector('#monster-meta');
    if (monsterMetaEl) monsterMetaEl.innerHTML = `<i class="fas ${getIconForAlignment(parsed.alignment)}"></i> ${monster.meta}`;

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
        if (monster['Traits']) {
            traits.innerHTML = monster['Traits'].replace(/<strong>(.*?)<\/strong>/g, (match, name) => `<strong>${name.toUpperCase()}</strong>`);
        } else {
            traits.innerHTML = '<li>Sin rasgos</li>';
        }
    }

    // Acciones
    const actions = card.querySelector('#monster-actions');
    if (actions) {
        if (monster['Actions']) {
            actions.innerHTML = monster['Actions'].replace(/<strong>(.*?)<\/strong>/g, (match, name) => `<strong>${name.toUpperCase()}</strong>`);
        } else {
            actions.innerHTML = '<li>Sin acciones</li>';
        }
    }
}