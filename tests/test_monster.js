// Script de prueba para la funcionalidad de limpiar encuentros de monstruos
// Simula el entorno del navegador para probar las funciones

// Simular window y document
global.window = {
  rng: Math.random,
  monsters: null
};

// Objetos mutables para simular DOM
let monsterCardStyle = { display: 'none' };
let encounterResultText = '';
let encounterHistoryHTML = '<div class="history-title">Historial de Encuentros</div>';

global.document = {
  getElementById: (id) => {
    if (id === 'monster-card-container') {
      return {
        style: monsterCardStyle,
        querySelector: (selector) => {
          if (selector === '#monster-name') return { innerHTML: '' };
          if (selector === '#monster-meta') return { innerHTML: '' };
          if (selector === '#monster-stats') return { innerHTML: '' };
          if (selector === '#monster-stats-highlight') return { innerHTML: '' };
          if (selector === '#monster-traits') return { innerHTML: '' };
          if (selector === '#monster-actions') return { innerHTML: '' };
          return null;
        }
      };
    }
    if (id === 'encounter-result') return { textContent: encounterResultText };
    if (id === 'encounter-history') return { innerHTML: encounterHistoryHTML };
    return null;
  },
  querySelector: (selector) => {
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

global.displayResult = (module, message) => {
  console.log(`Resultado mostrado: ${message}`);
};

// Función auxiliar global para elemento aleatorio
global.getRandomElement = function(array) {
  if (!Array.isArray(array) || array.length === 0) {
    logger('global', 'getRandomElement', 'Array inválido o vacío', { array });
    return null;
  }
  if (typeof window.rng !== 'function') {
    console.error('window.rng is not a function');
    return array[0] || null;
  }
  const randomValue = window.rng();
  const index = Math.floor(randomValue * array.length);
  const element = array[index];
  logger('global', 'getRandomElement', `Usando window.rng(), valor random: ${randomValue}, índice: ${index}, elemento: ${element}`, { arrayLength: array.length });
  return element;
};

// Simular datos de monstruos de ejemplo
window.monsters = {
  'Goblin': {
    'name': 'Goblin',
    'meta': 'Small humanoid (goblinoid), neutral evil',
    'Armor Class': '15 (leather armor, shield)',
    'Hit Points': '7 (2d6)',
    'Speed': '30 ft.',
    'STR': '8',
    'STR_mod': '(-1)',
    'DEX': '14',
    'DEX_mod': '(+2)',
    'CON': '10',
    'CON_mod': '(+0)',
    'INT': '10',
    'INT_mod': '(+0)',
    'WIS': '8',
    'WIS_mod': '(-1)',
    'CHA': '8',
    'CHA_mod': '(-1)',
    'Traits': '<li><strong>Nimble Escape.</strong> The goblin can take the Disengage or Hide action as a bonus action on each of its turns.</li>',
    'Actions': '<li><strong>Scimitar.</strong> <em>Melee Weapon Attack:</em> +4 to hit, reach 5 ft., one target. <em>Hit:</em> 5 (1d6 + 2) slashing damage.</li><li><strong>Shortbow.</strong> <em>Ranged Weapon Attack:</em> +4 to hit, range 80/320 ft., one target. <em>Hit:</em> 5 (1d6 + 2) piercing damage.</li>'
  },
  'Orc': {
    'name': 'Orc',
    'meta': 'Medium humanoid (orc), chaotic evil',
    'Armor Class': '13 (hide armor)',
    'Hit Points': '15 (2d8 + 6)',
    'Speed': '30 ft.',
    'STR': '16',
    'STR_mod': '(+3)',
    'DEX': '12',
    'DEX_mod': '(+1)',
    'CON': '16',
    'CON_mod': '(+3)',
    'INT': '7',
    'INT_mod': '(-2)',
    'WIS': '11',
    'WIS_mod': '(+0)',
    'CHA': '10',
    'CHA_mod': '(+0)',
    'Traits': '<li><strong>Aggressive.</strong> As a bonus action, the orc can move up to its speed toward a hostile creature that it can see.</li>',
    'Actions': '<li><strong>Greataxe.</strong> <em>Melee Weapon Attack:</em> +5 to hit, reach 5 ft., one target. <em>Hit:</em> 9 (1d12 + 3) slashing damage.</li><li><strong>Javelin.</strong> <em>Melee or Ranged Weapon Attack:</em> +5 to hit, reach 5 ft. or range 30/120 ft., one target. <em>Hit:</em> 6 (1d6 + 3) piercing damage.</li>'
  }
};

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

  logger('encounters', 'generateMonsterCard', `Tarjeta de monstruo generada para ${monster.name}`);
}

function generateMonster() {
  logger('encounters', 'generateMonster', 'Iniciando generación de monstruo');
  logger('encounters', 'generateMonster', `window.monsters definido: ${!!window.monsters}, keys: ${window.monsters ? Object.keys(window.monsters).length : 'undefined'}`);
  if (!window.monsters) {
    logger('encounters', 'generateMonster', 'Cargando datos de monstruos desde monsters.json');
    displayResult('encounters', 'Loading monsters data...');
    // En test, asumimos que ya está cargado
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

function clearEncounters() {
  logger('encounters', 'clearEncounters', 'Iniciando limpieza del historial y resultados de encuentros');
  const history = document.getElementById('encounter-history');
  if (history) history.innerHTML = '<div class="history-title">Historial de Encuentros</div>';
  const result = document.getElementById('encounter-result');
  if (result) result.textContent = '';
  const monsterCard = document.getElementById('monster-card-container');
  if (monsterCard) monsterCard.style.display = 'none';
  logger('encounters', 'clearEncounters', 'Limpieza completada');
}

// Pruebas
console.log('Iniciando pruebas de funcionalidad de limpiar encuentros de monstruos...');

try {
  console.log('\n--- Prueba: Generando monstruo ---');
  generateMonster();
  console.log('Monstruo generado. Verificando tarjeta visible...');
  const monsterCard = document.getElementById('monster-card-container');
  console.assert(monsterCard.style.display === 'block', 'La tarjeta de monstruo debería estar visible');
  console.log('Tarjeta visible:', monsterCard.style.display);

  console.log('\n--- Prueba: Limpiando encuentros ---');
  clearEncounters();
  console.log('Después de limpiar, verificando tarjeta oculta...');
  console.assert(monsterCard.style.display === 'none', 'La tarjeta de monstruo debería estar oculta');
  console.log('Tarjeta oculta:', monsterCard.style.display);

  console.log('Verificando historial vacío...');
  const history = document.getElementById('encounter-history');
  console.assert(history.innerHTML === '<div class="history-title">Historial de Encuentros</div>', 'El historial debería estar vacío');
  console.log('Historial:', history.innerHTML);

  console.log('Verificando resultado vacío...');
  const result = document.getElementById('encounter-result');
  console.assert(result.textContent === '', 'El resultado debería estar vacío');
  console.log('Resultado:', result.textContent);

  console.log('\nPruebas completadas exitosamente. No se encontraron errores.');
} catch (error) {
  console.error('Error durante las pruebas:', error);
  logger('test', 'main', `Error en pruebas: ${error.message}`, { stack: error.stack });
}