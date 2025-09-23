// Script de prueba para la funcionalidad de aliados
// Simula el entorno del navegador para probar las funciones

// Simular window y document
global.window = {
  rng: Math.random,
  ally: null
};

global.document = {
  getElementById: (id) => {
    if (id === 'ally-card-container') {
      return {
        style: { display: 'none' },
        querySelector: (selector) => {
          if (selector === '#ally-name') return { innerHTML: '' };
          if (selector === '#ally-type') return { textContent: '' };
          if (selector === '#ability-scores') return { innerHTML: '' };
          if (selector === '#stats-highlight') return { innerHTML: '' };
          if (selector === '#stats-detail') return { innerHTML: '' };
          if (selector === '#narrative') return { innerHTML: '' };
          if (selector === '#abilities-content') return { innerHTML: '' };
          if (selector === '#class-skills-content') return { innerHTML: '' };
          if (selector === '#skill-buttons') return { innerHTML: '' };
          if (selector === '#traits-content') return { innerHTML: '' };
          if (selector === '#inventory-content') return { innerHTML: '' };
          return null;
        }
      };
    }
    if (id === 'action-result') return { textContent: '' };
    if (id === 'exp-result') return { textContent: '' };
    if (id === 'dialogue-result') return { textContent: '' };
    if (id === 'encounter-result') return { textContent: '' };
    if (id === 'encounter-history') return { innerHTML: '<div class="history-title">Historial de Encuentros</div>' };
    return null;
  },
  querySelector: (selector) => {
    if (selector === '#stats-detail div:nth-child(6)') return { innerHTML: '' };
    if (selector === '#stats-detail div:nth-child(5) span') return { textContent: '', className: '' };
    return null;
  }
};

global.localStorage = {
  getItem: (key) => null,
  setItem: (key, value) => {}
};

global.logger = (module, func, message, params) => {
  console.log(`[${new Date().toISOString()}] [${module}] ${func}: ${message}`, params || '');
};

global.addToHistory = (module, message) => {
  console.log(`Agregado al historial: ${message}`);
};

// Definir constantes necesarias (simulando constants.js)
const allyNames = [
    'Aelar', 'Bryn', 'Caelum', 'Drenna', 'Eldrin', 'Faelar', 'Gwendolyn', 'Haldir', 'Isolde', 'Jorvik',
    'Kaelen', 'Liora', 'Mirael', 'Nyx', 'Orin', 'Peyton', 'Quorin', 'Rhea', 'Sylvara', 'Thalion',
    'Ursula', 'Veylin', 'Wren', 'Xyra', 'Ysolde', 'Zephyr', 'Aerith', 'Brenna', 'Cyril', 'Darius',
    'Elowen', 'Finnian', 'Galen', 'Hadrian', 'Ilyana', 'Jasper', 'Kaelith', 'Lorien', 'Maelis', 'Nero',
    'Oryn', 'Phaedra', 'Quillian', 'Rhydian', 'Seraphine', 'Tarian', 'Ulric', 'Virelle', 'Wylfred', 'Xandor',
    'Ysmera', 'Zorak'
];

const npcRaces = [
    'Humano', 'Elfo Alto', 'Elfo del Bosque', 'Elfo Oscuro', 'Enano de las Colinas', 'Enano de la Montaña',
    'Mediano Leal', 'Mediano Pie ligero', 'Mediano Robusto', 'Tiefling', 'Dragonborn', 'Gnomo de la Roca',
    'Gnomo del Bosque', 'Elfo Marino', 'Enano Duergar', 'Mediano Pelirrojo', 'Tiefling Asmodeus'
];

const npcClasses = [
    'Guerrero', 'Mago', 'Clérigo', 'Pícaro', 'Bárbaro', 'Bardo', 'Explorador',
    'Paladín', 'Druida', 'Monje', 'Hechicero', 'Brujo', 'Alquimista', 'Cazador de Demonios',
    'Caballero Negro', 'Artificiero', 'Samurái', 'Guardabosques', 'Invocador', 'Nigromante',
    'Gladiador', 'Mercenario', 'Sacerdote de Guerra', 'Maestro de Bestias', 'Espadachín', 'Ilusionista'
];

const npcTraits = [
    'Amigable', 'Desconfiado', 'Nervioso', 'Valiente', 'Sabio', 'Hábil', 'Astuto', 'Honorable',
    'Arrogante', 'Tímido', 'Leal', 'Traicionero', 'Cínico', 'Optimista', 'Sarcástico', 'Misterioso',
    'Compasivo', 'Avaricioso', 'Fanático', 'Melancólico', 'Intrépido', 'Curioso', 'Sutil', 'Salvaje',
    'Piadoso', 'Engreído', 'Reservado', 'Egoísta', 'Generoso', 'Enigmático'
];

const npcGoals = [
    'Busca ayuda', 'Ofrece información', 'Intenta engañar', 'Necesita protección', 'Tiene una misión', 'Esconde un secreto',
    'Busca venganza', 'Ofrece un trato', 'Necesita un guía', 'Quiere un artefacto', 'Planea un robo', 'Busca redención',
    'Ofrece una profecía', 'Necesita curación', 'Intenta reclutar', 'Guarda un tesoro', 'Quiere traicionar a alguien', 'Busca un aliado',
    'Ofrece un ritual', 'Necesita escapar', 'Intenta advertir', 'Tiene un mapa valioso', 'Busca un duelo', 'Planea una emboscada'
];

const safeRandom = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return '';
    const randomValue = window.rng();
    const index = Math.floor(randomValue * arr.length);
    const element = arr[index];
    console.log(`Seleccionando elemento aleatorio: ${element}`);
    return element;
};

// Funciones auxiliares
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

function generateAllyCard(allyData) {
  if (!allyData || !allyData.stats) {
    logger('encounters', 'generateAllyCard', 'Datos de aliado inválidos o faltantes', { allyData });
    return;
  }

  const card = document.getElementById('ally-card-container');
  if (!card) {
    logger('encounters', 'generateAllyCard', 'Contenedor de tarjeta de aliado no encontrado');
    return;
  }

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

  allyData.stats.HP = `${hp} (${Math.floor(hp / (conMod + 1))}d${Math.floor(hp / (conMod + 1) * 2)} + ${conMod * Math.floor(hp / (conMod + 1))})`;
  allyData.stats['Bonificador de Ataque'] = `+${attackBonus}`;
  allyData.stats['Salvaciones'] = `DES +${savingThrows.DES}, SAB +${savingThrows.SAB}`;
  allyData.stats['Acción especial'] = specialAction;
  allyData.stats['Lealtad'] = loyalty;
  allyData.stats['EXP'] = allyData.stats['EXP'] || 0;
  allyData.stats['Nivel'] = allyData.level;
  allyData.stats['Inventario'] = inventory.join(', ');
  allyData.classSkills = classSkills;

  console.log('Tarjeta de aliado generada para:', allyData.name);
}

let actionIndex = 0;

function useSpecialAction() {
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
}

function gainExperience() {
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
  const expDiv = document.querySelector('#stats-detail div:nth-child(6)');
  if (expDiv) expDiv.innerHTML = `<i class="fas fa-star stat-icon"></i>EXP: ${exp}`;
  checkLoyaltyShift();
}

function generateDialogueResponse() {
  if (!window.ally || !window.ally.stats) return;

  const charismaMod = parseInt(window.ally.stats.CAR.split('+')[1]) || 0;
  const loyalty = window.ally.stats['Lealtad'];
  const dialogue = generateDialogue(loyalty, charismaMod);
  document.getElementById('dialogue-result').textContent = `${window.ally.name} dice: "${dialogue}"`;
}

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
  const loyaltyDiv = document.querySelector('#stats-detail div:nth-child(5) span');
  if (loyaltyDiv) {
    loyaltyDiv.textContent = currentLoyalty;
    loyaltyDiv.className = `loyalty-indicator ${currentLoyalty === 'Alta' ? 'loyalty-high' : currentLoyalty === 'Media' ? 'loyalty-medium' : 'loyalty-low'}`;
  }
}

function useSkill(skill) {
  if (!window.ally || !window.ally.level) {
    logger('encounters', 'useSkill', 'No hay aliado disponible');
    return;
  }

  const level = window.ally.level;
  const result = useClassSkill(skill, level);
  document.getElementById('action-result').textContent = `${skill}: ${result}`;
  generateDialogueResponse();
}

function generateSampleAlly() {
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

// Pruebas
console.log('Iniciando pruebas de funcionalidad de aliados...');

// Generar 10 aliados y probar botones
for (let i = 0; i < 10; i++) {
  console.log(`\n--- Prueba ${i + 1}: Generando aliado ---`);
  generateSampleAlly();
  console.log('Aliado generado:', window.ally.name, window.ally.type, window.ally.role);

  // Probar usar acción especial
  console.log('Probando usar acción especial...');
  useSpecialAction();

  // Probar ganar EXP
  console.log('Probando ganar EXP...');
  gainExperience();

  // Probar usar habilidad de clase (si tiene)
  if (window.ally.classSkills && window.ally.classSkills.length > 0) {
    console.log('Probando usar habilidad de clase...');
    useSkill(window.ally.classSkills[0]);
  }

  // Probar limpiar
  console.log('Probando limpiar...');
  clearEncounters();
  console.log('Después de limpiar, tarjeta display:', document.getElementById('ally-card-container').style.display);
}

console.log('\nPruebas completadas. No se encontraron errores críticos.');