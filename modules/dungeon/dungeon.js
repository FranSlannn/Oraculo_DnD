// Módulo Mazmorra

// Función para barajar un array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateRoom() {
    logger('dungeon', 'generateRoom', 'Iniciando generación de habitación');
    const type = getRandomElement(roomTypes);
    const feature = getRandomElement(roomFeatures);
    const room = `Habitación: ${type} con ${feature}`;
    logger('dungeon', 'generateRoom', `Habitación generada: ${room}`);
    displayResult('dungeon', room);
    addToHistory('dungeon', room);
    logger('dungeon', 'generateRoom', 'Habitación generada y mostrada');
}

function generateTrap() {
    logger('dungeon', 'generateTrap', 'Iniciando generación de trampa');
    const trap = getRandomElement(traps);
    logger('dungeon', 'generateTrap', `Trampa generada: ${trap}`);
    displayResult('dungeon', `Trampa: ${trap}`);
    addToHistory('dungeon', `Trampa: ${trap}`);
    logger('dungeon', 'generateTrap', 'Trampa generada y mostrada');
}

function generatePuzzle() {
    logger('dungeon', 'generatePuzzle', 'Iniciando generación de puzle');
    const puzzle = getRandomElement(puzzles);
    logger('dungeon', 'generatePuzzle', `Puzle generado: ${puzzle}`);
    displayResult('dungeon', `Puzle: ${puzzle}`);
    addToHistory('dungeon', `Puzle: ${puzzle}`);
    logger('dungeon', 'generatePuzzle', 'Puzle generado y mostrado');
}

function clearDungeon() {
    logger('dungeon', 'clearDungeon', 'Iniciando limpieza del historial y mapa de mazmorra');
    const history = document.getElementById('dungeon-history');
    if (history) history.innerHTML = '<div class="history-title">Historial de Mazmorra</div>';
    const result = document.getElementById('dungeon-result');
    if (result) result.textContent = '';
    const map = document.getElementById('dungeon-map');
    if (map) map.innerHTML = '';
    logger('dungeon', 'clearDungeon', 'Limpieza completada');
}

// Función para agregar al historial
function addDungeonHistory(text) {
    addToHistory('dungeon', text);
}

// Función para generar mazmorra visual
function generateDungeon() {
    logger('dungeon', 'generateDungeon', 'Iniciando generación de mazmorra');
    const sizeSelect = document.getElementById('dungeon-size');
    const sizeVal = sizeSelect ? sizeSelect.value : 'small';
    const n = sizeVal === 'small' ? 3 : sizeVal === 'medium' ? 5 : 7;
    logger('dungeon', 'generateDungeon', `Tamaño seleccionado: ${sizeVal}, dimensión: ${n}x${n}`);
    const map = document.getElementById('dungeon-map');
    if (!map) {
        logger('dungeon', 'generateDungeon', 'Mapa no encontrado, cancelando');
        return;
    }

    map.innerHTML = '';
    map.style.display = 'grid';
    map.style.gridTemplateColumns = `repeat(${n}, 60px)`;
    map.style.gridAutoRows = '60px';
    map.style.gridGap = '6px';

    const total = n * n;
    const roomCount = sizeVal === 'small' ? 2 + Math.floor(Math.random() * 2) : sizeVal === 'medium' ? 4 + Math.floor(Math.random() * 3) : 6 + Math.floor(Math.random() * 4);
    logger('dungeon', 'generateDungeon', `Total celdas: ${total}, habitaciones: ${roomCount}`);

    // Generar posiciones de habitaciones
    const rooms = [];
    const minDistance = 1; // Distancia mínima entre habitaciones
    let attempts = 0;
    while (rooms.length < roomCount && attempts < 100) {
        const x = Math.floor(Math.random() * n);
        const y = Math.floor(Math.random() * n);
        const tooClose = rooms.some(r => Math.abs(r.x - x) <= minDistance && Math.abs(r.y - y) <= minDistance);
        if (!tooClose) {
            rooms.push({ x, y });
        }
        attempts++;
    }

    // Crear grid
    const grid = Array.from({ length: n }, () => Array(n).fill(null));

    // Colocar habitaciones
    rooms.forEach((room, idx) => {
        grid[room.y][room.x] = { type: 'room', desc: buildRoomDescription('detailed'), index: idx };
    });

    // Conectar habitaciones con pasillos
    for (let i = 0; i < rooms.length - 1; i++) {
        connectRooms(grid, rooms[i], rooms[i + 1], n);
    }

    // Colocar elementos interactivos en habitaciones y pasillos
    const interactiveCount = Math.floor(roomCount * 0.5) + Math.floor(Math.random() * roomCount);
    let placed = 0;
    for (let y = 0; y < n && placed < interactiveCount; y++) {
        for (let x = 0; x < n && placed < interactiveCount; x++) {
            if (grid[y][x] === null) {
                const r = Math.random();
                if (r < 0.3) {
                    const roll = Math.random();
                    if (roll < 0.4) {
                        grid[y][x] = { type: 'object', feature: getRandomElement(roomFeatures) };
                    } else if (roll < 0.7) {
                        grid[y][x] = { type: 'puzzle', puzzle: getRandomElement(puzzles) };
                    } else {
                        grid[y][x] = { type: 'trap', trap: getRandomElement(traps), feature: getRandomElement(roomFeatures) };
                    }
                    placed++;
                }
            }
        }
    }

    // Renderizar grid
    for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
            const cell = document.createElement('div');
            cell.className = 'dungeon-cell';
            const index = y * n + x;
            cell.dataset.index = index;

            const content = grid[y][x];
            if (content) {
                if (content.type === 'room') {
                    cell.classList.add('dungeon-room');
                    cell.title = content.desc;
                    cell.textContent = 'R';
                    cell.style.cursor = 'pointer';
                    cell.addEventListener('click', () => {
                        cell.classList.add('explored');
                        document.getElementById('dungeon-result').textContent = content.desc;
                        addDungeonHistory(`Habitación (mapa): ${content.desc}`);
                    });
                } else if (content.type === 'corridor') {
                    cell.classList.add('corridor');
                    cell.textContent = 'C';
                    cell.addEventListener('click', () => {
                        document.getElementById('dungeon-result').textContent = 'Pasillo conectando habitaciones';
                        addDungeonHistory('Inspección: pasillo');
                    });
                } else if (content.type === 'object') {
                    cell.classList.add('object');
                    cell.textContent = 'O';
                    cell.title = `Objeto curioso: ${content.feature}`;
                    cell.style.cursor = 'pointer';
                    cell.addEventListener('click', () => {
                        document.getElementById('dungeon-result').textContent = `Has encontrado un objeto curioso: ${content.feature}`;
                        addDungeonHistory(`Objeto encontrado: ${content.feature}`);
                    });
                } else if (content.type === 'puzzle') {
                    cell.classList.add('puzzle');
                    cell.textContent = 'P';
                    cell.title = `Puzzle oculto: ${content.puzzle}`;
                    cell.style.cursor = 'pointer';
                    cell.addEventListener('click', () => {
                        document.getElementById('dungeon-result').textContent = `Puzzle oculto: ${content.puzzle}`;
                        addDungeonHistory(`Puzzle oculto descubierto: ${content.puzzle}`);
                    });
                } else if (content.type === 'trap') {
                    cell.classList.add('trap');
                    cell.textContent = 'T';
                    cell.title = `Trampa custodiando: ${content.feature} (${content.trap})`;
                    cell.style.cursor = 'pointer';
                    cell.addEventListener('click', () => {
                        document.getElementById('dungeon-result').textContent = `Has encontrado ${content.feature}, pero está custodiado por una trampa: ${content.trap}`;
                        addDungeonHistory(`Tesoro custodiado: ${content.feature} con trampa ${content.trap}`);
                    });
                }
            } else {
                cell.classList.add('empty');
                cell.textContent = '';
                cell.addEventListener('click', () => {
                    document.getElementById('dungeon-result').textContent = 'Espacio vacío';
                    addDungeonHistory('Inspección: espacio vacío');
                });
            }
            map.appendChild(cell);
        }
    }

    const summary = `Mazmorra ${sizeVal} generada (${n}x${n}). Habitaciones: ${roomCount}. Haz clic en las celdas para explorar.`;
    document.getElementById('dungeon-result').textContent = summary;
    addDungeonHistory(summary);

    // Activar leyenda interactiva
    setupDungeonLegend();
    logger('dungeon', 'generateDungeon', 'Mazmorra generada y mostrada');
}

// Función para conectar dos habitaciones con un pasillo
function connectRooms(grid, room1, room2, n) {
    const { x: x1, y: y1 } = room1;
    const { x: x2, y: y2 } = room2;

    // Primero horizontal, luego vertical
    const dx = x2 - x1;
    const dy = y2 - y1;

    // Línea horizontal
    const stepX = dx > 0 ? 1 : -1;
    for (let x = x1; x !== x2; x += stepX) {
        if (grid[y1][x] === null) grid[y1][x] = { type: 'corridor' };
    }

    // Línea vertical
    const stepY = dy > 0 ? 1 : -1;
    for (let y = y1; y !== y2; y += stepY) {
        if (grid[y][x2] === null) grid[y][x2] = { type: 'corridor' };
    }
}

// Función para construir descripción de habitación
function buildRoomDescription(complexity) {
    const type = getRandomElement(roomTypes);
    const feature = getRandomElement(roomFeatures);
    if (complexity === 'detailed') {
        return `${type} con ${feature}`;
    }
    return type;
}

// Función para configurar la leyenda interactiva
function setupDungeonLegend() {
    document.querySelectorAll('#dungeon-legend .legend-cell').forEach(cell => {
        const type = cell.dataset.type;

        cell.addEventListener('mouseenter', () => {
            document.querySelectorAll(`#dungeon-map .${type}`).forEach(el => {
                el.classList.add('highlight');
            });
        });

        cell.addEventListener('mouseleave', () => {
            document.querySelectorAll('#dungeon-map .dungeon-cell').forEach(el => {
                el.classList.remove('highlight');
            });
        });
    });
}

// Bindings
document.addEventListener('DOMContentLoaded', () => {
    const genDungeon = document.getElementById('generate-dungeon');
    if (genDungeon) genDungeon.addEventListener('click', generateDungeon);
});