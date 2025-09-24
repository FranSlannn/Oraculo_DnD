// =========================================================================
// JavaScript para Generador de Mazmorras - Estilo D&D 5e
// =========================================================================
// Genera un mapa con pasillos orgánicos (Prim+DFS), niebla de guerra,
// grupos de enemigos, eventos narrativos, y un jefe final con subordinados.
// =========================================================================

// Definir constantes locales para enemies, bosses, events, connections
const connections = ['puerta de madera reforzada', 'arco de piedra tallada', 'pasadizo secreto', 'escalera de caracol', 'puente de cuerda inestable'];

const enemies = [
    { name: 'Goblin', type: 'Humanoide', cr: '1/4', desc: 'un goblin astuto', role: 'emboscador' },
    { name: 'Esqueleto', type: 'No muerto', cr: '1/4', desc: 'un esqueleto animado', role: 'centinela' },
    { name: 'Araña gigante', type: 'Bestia', cr: '1', desc: 'una araña gigante', role: 'depredador' },
    { name: 'Bandido', type: 'Humanoide', cr: '1/8', desc: 'un bandido', role: 'merodeador' },
    { name: 'Lobo atroz', type: 'Bestia', cr: '1/4', desc: 'un lobo atroz', role: 'cazador' },
    { name: 'Sombra', type: 'No muerto', cr: '1/2', desc: 'una sombra', role: 'acechador' }
];

const bosses = [
    { name: 'Minotauro', type: 'Monstruosidad', cr: '3', desc: 'un minotauro', modifier: 'furioso' },
    { name: 'Dragón joven', type: 'Dragón', cr: '6', desc: 'un dragón joven', modifier: 'codicioso' },
    { name: 'Caballero de la muerte', type: 'No muerto', cr: '5', desc: 'un caballero de la muerte', modifier: 'implacable' },
    { name: 'Ogro mago', type: 'Gigante', cr: '4', desc: 'un ogro mago', modifier: 'arcano' }
];

const events = [
    { name: 'Emboscada', desc: 'Una emboscada te sorprende en la penumbra.' },
    { name: 'Ritual oscuro', desc: 'Interrumpes un ritual oscuro en progreso.' },
    { name: 'Enemigos heridos', desc: 'Los enemigos están heridos tras un combate reciente.' },
    { name: 'Trampa activada', desc: 'Los enemigos activan una trampa oculta contra ti.' },
    { name: 'Guardia distraída', desc: 'Los enemigos están distraídos, discutiendo entre sí.' }
];

// Función auxiliar para seleccionar elemento aleatorio
// Usar window.getRandomElement

// Generar grupo de enemigos
function generateEnemyGroup() {
    const count = Math.floor(window.rng() * 3) + 2; // 2-4 enemigos
    const group = [];
    for (let i = 0; i < count; i++) {
        group.push(window.getRandomElement(enemies));
    }
    const leader = group.reduce((max, enemy) => parseFloat(max.cr) > parseFloat(enemy.cr) ? max : enemy, group[0]);
    return { group, leader };
}

// Función para mostrar resultado
// Usar displayResult global

// Función para agregar al historial
// Usar addToHistory global

function generateRoom() {
    logger('dungeon', 'generateRoom', 'Iniciando generación de habitación');
    const type = window.getRandomElement(roomTypes);
    const feature = window.getRandomElement(roomFeatures);
    const room = `Habitación: ${type} con ${feature}`;
    logger('dungeon', 'generateRoom', `Habitación generada: ${room}`);
    displayResult('dungeon', room);
    addToHistory('dungeon', room);
    logger('dungeon', 'generateRoom', 'Habitación generada y mostrada');
}

function generateTrap() {
    logger('dungeon', 'generateTrap', 'Iniciando generación de trampa');
    const trap = window.getRandomElement(traps);
    logger('dungeon', 'generateTrap', `Trampa generada: ${trap}`);
    displayResult('dungeon', `Trampa: ${trap}`);
    addToHistory('dungeon', `Trampa: ${trap}`);
    logger('dungeon', 'generateTrap', 'Trampa generada y mostrada');
}

function generatePuzzle() {
    logger('dungeon', 'generatePuzzle', 'Iniciando generación de puzle');
    const puzzle = window.getRandomElement(puzzles);
    logger('dungeon', 'generatePuzzle', `Puzle generado: ${puzzle}`);
    displayResult('dungeon', `Puzle: ${puzzle}`);
    addToHistory('dungeon', `Puzle: ${puzzle}`);
    logger('dungeon', 'generatePuzzle', 'Puzle generado y mostrado');
}

function clearDungeon() {
    logger('dungeon', 'clearDungeon', 'Iniciando limpieza del historial y mapa de mazmorra');
    const history = document.getElementById('dungeon-history');
    if (history) history.innerHTML = '<div class="history-title">Diario de Exploración</div>';
    const result = document.getElementById('dungeon-result');
    if (result) result.textContent = '';
    const map = document.getElementById('dungeon-map');
    if (map) map.innerHTML = '';
    window.currentGrid = null;
    logger('dungeon', 'clearDungeon', 'Limpieza completada');
}

function exportDungeon() {
    const grid = window.currentGrid;
    if (grid) {
        const json = JSON.stringify(grid);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dungeon-map.json';
        a.click();
        URL.revokeObjectURL(url);
        addToHistory('dungeon', 'Mapa exportado como JSON');
    } else {
        displayResult('dungeon', 'No hay mazmorra para exportar');
    }
}

function generateDungeon() {
    logger('dungeon', 'generateDungeon', 'Iniciando generación de mazmorra');
    try {
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
        const roomCount = sizeVal === 'small' ? 3 : sizeVal === 'medium' ? 5 : 8;
        logger('dungeon', 'generateDungeon', `Total celdas: ${total}, habitaciones: ${roomCount}`);

        // Generar posiciones de habitaciones
        const rooms = [{ x: 0, y: 0, type: 'Entrada' }];
        const minDistance = 1;
        let attempts = 0;
        while (rooms.length < roomCount - 1 && attempts < 100) {
            const x = Math.floor(window.rng() * n);
            const y = Math.floor(window.rng() * n);
            const tooClose = rooms.some(r => Math.abs(r.x - x) <= minDistance && Math.abs(r.y - y) <= minDistance);
            if (!tooClose) rooms.push({ x, y });
            attempts++;
        }
        const finalRoom = rooms.length > 1 ? rooms.pop() : { x: n-1, y: n-1 };
        rooms.push({ x: finalRoom.x, y: finalRoom.y, type: 'Cámara del Tesoro' });

        // Crear grid
        const grid = Array.from({ length: n }, () => Array(n).fill(null));
        window.currentGrid = grid;

        // Colocar habitaciones
        rooms.forEach((room, idx) => {
            const isEntrance = room.type === 'Entrada';
            const isBoss = room.type === 'Cámara del Tesoro';
            const desc = buildRoomDescription('detailed', isEntrance, isBoss);
            const hasEnemy = !isEntrance && !isBoss && window.rng() < 0.5;
            const isGroup = hasEnemy && window.rng() < 0.4;
            const hasEvent = hasEnemy && window.rng() < 0.2;
            const hasTrap = hasEnemy && window.rng() < 0.3;
            const enemy = hasEnemy && !isGroup ? window.getRandomElement(enemies) : null;
            const group = hasEnemy && isGroup ? generateEnemyGroup() : null;
            const event = hasEvent ? window.getRandomElement(events) : null;
            const trap = hasTrap ? window.getRandomElement(traps) : null;
            const hasBoss = isBoss;
            const boss = hasBoss ? window.getRandomElement(bosses) : null;
            const bossGroup = hasBoss && window.rng() < 0.5 ? generateEnemyGroup() : null;
            grid[room.y][room.x] = {
                type: 'room',
                desc: desc,
                index: idx,
                hasEnemy: hasEnemy,
                isGroup: isGroup,
                enemy: enemy,
                group: group,
                event: event,
                trap: trap,
                hasBoss: hasBoss,
                boss: boss,
                bossGroup: bossGroup
            };
        });

        // Conectar con Prim's para MST, luego DFS para pasillos orgánicos
        const edges = [];
        for (let i = 0; i < rooms.length; i++) {
            for (let j = i + 1; j < rooms.length; j++) {
                const dist = Math.abs(rooms[i].x - rooms[j].x) + Math.abs(rooms[i].y - rooms[j].y);
                edges.push({ from: i, to: j, weight: dist });
            }
        }
        edges.sort((a, b) => a.weight - b.weight);

        const parent = Array(roomCount).fill().map((_, i) => i);
        function find(u) {
            if (parent[u] !== u) parent[u] = find(parent[u]);
            return parent[u];
        }
        function union(u, v) {
            const pu = find(u), pv = find(v);
            if (pu !== pv) parent[pu] = pv;
        }

        for (const edge of edges) {
            if (find(edge.from) !== find(edge.to)) {
                union(edge.from, edge.to);
                connectRoomsOrganic(grid, rooms[edge.from], rooms[edge.to], n);
            }
        }

        // Colocar elementos interactivos
        const interactiveCount = Math.floor(roomCount * 0.75) + Math.floor(window.rng() * roomCount);
        let placed = 0;
        for (let y = 0; y < n && placed < interactiveCount; y++) {
            for (let x = 0; x < n && placed < interactiveCount; x++) {
                if (grid[y][x] === null) {
                    const r = window.rng();
                    if (r < 0.4) {
                        const roll = window.rng();
                        if (roll < 0.4) {
                            grid[y][x] = { type: 'object', feature: window.getRandomElement(roomFeatures) };
                        } else if (roll < 0.7) {
                            grid[y][x] = { type: 'puzzle', puzzle: window.getRandomElement(puzzles) };
                        } else {
                            grid[y][x] = { type: 'trap', trap: window.getRandomElement(traps), feature: window.getRandomElement(roomFeatures) };
                        }
                        placed++;
                    }
                }
            }
        }

        // Renderizar grid con niebla de guerra
        const explored = new Set(['0,0']);
        for (let y = 0; y < n; y++) {
            for (let x = 0; x < n; x++) {
                const cell = document.createElement('div');
                cell.className = 'dungeon-cell';
                const index = `${y},${x}`;
                cell.dataset.index = index;

                const content = grid[y][x];
                if (content) {
                    cell.classList.add(content.type);
                    if (content.type === 'room') {
                        if (content.hasBoss) {
                            cell.innerHTML = '<i class="fas fa-dragon"></i>';
                            cell.classList.add('has-boss');
                        } else if (content.hasEnemy) {
                            cell.innerHTML = '<i class="fas fa-skull-crossbones"></i>';
                            cell.classList.add('has-enemy');
                        } else {
                            cell.innerHTML = '<i class="fas fa-door-open"></i>';
                        }
                        cell.title = content.desc;
                        cell.style.cursor = 'pointer';
                        cell.addEventListener('click', () => {
                            if (!isAdjacentExplored(x, y, explored, n)) return;
                            cell.classList.add('explored');
                            cell.classList.remove('fog');
                            explored.add(index);
                            revealAdjacentCells(x, y, n, grid, explored);
                            let desc = content.desc;
                            let historyPrefix = 'Habitación explorada';
                            if (content.hasEnemy) {
                                if (content.isGroup) {
                                    const groupDesc = content.group.group.map(e => `${e.desc} (${e.role}, CR ${e.cr})`).join(', ');
                                    desc += ` ¡Una patrulla liderada por ${content.group.leader.desc} (${content.group.leader.role}, CR ${content.group.leader.cr}) con ${content.group.group.length - 1} subordinados: ${groupDesc}!`;
                                    historyPrefix = 'Emboscada';
                                } else {
                                    desc += ` ¡${content.enemy.desc} (${content.enemy.role}, CR ${content.enemy.cr})!`;
                                    historyPrefix = 'Encuentro';
                                }
                                if (content.event) {
                                    desc += ` ${content.event.desc}`;
                                    historyPrefix = content.event.name;
                                }
                                if (content.trap) {
                                    desc += ` Los enemigos han preparado una trampa: ${content.trap}.`;
                                }
                            } else if (content.hasBoss) {
                                desc += ` ¡${content.boss.desc} (${content.boss.modifier}, CR ${content.boss.cr}) protege el tesoro!`;
                                if (content.bossGroup) {
                                    const groupDesc = content.bossGroup.group.map(e => `${e.desc} (${e.role}, CR ${e.cr})`).join(', ');
                                    desc += ` Acompañado por ${content.bossGroup.group.length} subordinados: ${groupDesc}.`;
                                }
                                historyPrefix = 'Enfrentamiento final';
                            }
                            document.getElementById('dungeon-result').textContent = desc;
                            addToHistory('dungeon', `${historyPrefix}: ${desc}`);
                        });
                    } else if (content.type === 'corridor') {
                        cell.innerHTML = '<i class="fas fa-link"></i>';
                        cell.addEventListener('click', () => {
                            if (!isAdjacentExplored(x, y, explored, n)) return;
                            cell.classList.add('explored');
                            cell.classList.remove('fog');
                            explored.add(index);
                            revealAdjacentCells(x, y, n, grid, explored);
                            document.getElementById('dungeon-result').textContent = `Pasillo conectado por ${content.connection}`;
                            addToHistory('dungeon', `Pasillo explorado: ${content.connection}`);
                        });
                    } else if (content.type === 'object') {
                        cell.innerHTML = '<i class="fas fa-gem"></i>';
                        cell.title = `Objeto curioso: ${content.feature}`;
                        cell.style.cursor = 'pointer';
                        cell.addEventListener('click', () => {
                            if (!isAdjacentExplored(x, y, explored, n)) return;
                            cell.classList.add('explored');
                            cell.classList.remove('fog');
                            explored.add(index);
                            revealAdjacentCells(x, y, n, grid, explored);
                            document.getElementById('dungeon-result').textContent = `Has encontrado un objeto curioso: ${content.feature}`;
                            addToHistory('dungeon', `Objeto encontrado: ${content.feature}`);
                        });
                    } else if (content.type === 'puzzle') {
                        cell.innerHTML = '<i class="fas fa-puzzle-piece"></i>';
                        cell.title = `Puzzle oculto: ${content.puzzle}`;
                        cell.style.cursor = 'pointer';
                        cell.addEventListener('click', () => {
                            if (!isAdjacentExplored(x, y, explored, n)) return;
                            cell.classList.add('explored');
                            cell.classList.remove('fog');
                            explored.add(index);
                            revealAdjacentCells(x, y, n, grid, explored);
                            document.getElementById('dungeon-result').textContent = `Puzzle oculto: ${content.puzzle}`;
                            addToHistory('dungeon', `Puzzle descubierto: ${content.puzzle}`);
                        });
                    } else if (content.type === 'trap') {
                        cell.innerHTML = '<i class="fas fa-skull"></i>';
                        cell.title = `Trampa custodiando: ${content.feature} (${content.trap})`;
                        cell.style.cursor = 'pointer';
                        cell.addEventListener('click', () => {
                            if (!isAdjacentExplored(x, y, explored, n)) return;
                            cell.classList.add('explored');
                            cell.classList.remove('fog');
                            explored.add(index);
                            revealAdjacentCells(x, y, n, grid, explored);
                            document.getElementById('dungeon-result').textContent = `Has encontrado ${content.feature}, pero está custodiado por una trampa: ${content.trap}`;
                            addToHistory('dungeon', `Tesoro custodiado: ${content.feature} con trampa ${content.trap}`);
                        });
                    }
                } else {
                    cell.classList.add('empty');
                    cell.textContent = '';
                    cell.addEventListener('click', () => {
                        if (!isAdjacentExplored(x, y, explored, n)) return;
                        cell.classList.add('explored');
                        cell.classList.remove('fog');
                        explored.add(index);
                        revealAdjacentCells(x, y, n, grid, explored);
                        document.getElementById('dungeon-result').textContent = 'Espacio vacío';
                        addToHistory('dungeon', 'Inspección: espacio vacío');
                    });
                }

                if (!explored.has(index)) cell.classList.add('fog');
                map.appendChild(cell);
            }
        }

        const summary = `Mazmorra ${sizeVal} generada (${n}x${n}). Habitaciones: ${roomCount}. Explora desde la entrada (0,0) hasta la Cámara del Tesoro.`;
        document.getElementById('dungeon-result').textContent = summary;
        addToHistory('dungeon', summary);

        setupDungeonLegend();
        logger('dungeon', 'generateDungeon', 'Mazmorra generada y mostrada');
    } catch (error) {
        logger('dungeon', 'generateDungeon', `Error: ${error.message}`);
        displayResult('dungeon', `Error al generar la mazmorra: ${error.message}`);
    }
}

function connectRoomsOrganic(grid, room1, room2, n) {
    const { x: startX, y: startY } = room1;
    const { x: goalX, y: goalY } = room2;
    const connection = window.getRandomElement(connections);
    const stack = [[startX, startY]];
    const visited = new Set([`${startY},${startX}`]);
    const parent = { [`${startY},${startX}`]: null };

    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    while (stack.length > 0) {
        const [x, y] = stack.pop();
        if (x === goalX && y === goalY) break;

        shuffleArray(directions);
        for (const [dx, dy] of directions) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < n && ny >= 0 && ny < n && !visited.has(`${ny},${nx}`)) {
                visited.add(`${ny},${nx}`);
                stack.push([nx, ny]);
                parent[`${ny},${nx}`] = [x, y];
            }
        }
    }

    let current = [goalX, goalY];
    while (current) {
        const [x, y] = current;
        if (grid[y][x] === null) {
            grid[y][x] = { type: 'corridor', connection };
        }
        current = parent[`${y},${x}`];
    }
}

function buildRoomDescription(complexity, isEntrance, isBoss) {
    const type = isEntrance ? 'Entrada' : isBoss ? 'Cámara del Tesoro' : window.getRandomElement(roomTypes);
    const feature = window.getRandomElement(roomFeatures);
    const state = window.getRandomElement(['en ruinas', 'intacta', 'oscura y húmeda']);
    if (complexity === 'detailed') {
        return `Habitación: ${type} (${state}) con ${feature}`;
    }
    return type;
}

function isAdjacentExplored(x, y, explored, n) {
    const adjacent = [
        [x-1, y], [x+1, y], [x, y-1], [x, y+1]
    ].filter(([nx, ny]) => nx >= 0 && nx < n && ny >= 0 && ny < n);
    return adjacent.some(([nx, ny]) => explored.has(`${ny},${nx}`));
}

function revealAdjacentCells(x, y, n, grid, explored) {
    const adjacent = [
        [x-1, y], [x+1, y], [x, y-1], [x, y+1]
    ].filter(([nx, ny]) => nx >= 0 && nx < n && ny >= 0 && ny < n);
    adjacent.forEach(([nx, ny]) => {
        const cell = document.querySelector(`.dungeon-cell[data-index="${ny},${nx}"]`);
        if (cell && !explored.has(`${ny},${nx}`)) {
            cell.classList.remove('fog');
            explored.add(`${ny},${nx}`);
        }
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(window.rng() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function setupDungeonLegend() {
    document.querySelectorAll('#dungeon-legend .legend-cell').forEach(cell => {
        const type = cell.dataset.type;
        cell.addEventListener('mouseenter', () => {
            document.querySelectorAll(`#dungeon-map .${type}:not(.fog)`).forEach(el => {
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
const genDungeon = document.getElementById('generate-dungeon');
if (genDungeon) genDungeon.addEventListener('click', generateDungeon);

// Expose functions globally
window.generateRoom = generateRoom;
window.generateTrap = generateTrap;
window.generatePuzzle = generatePuzzle;
window.clearDungeon = clearDungeon;
window.generateDungeon = generateDungeon;
window.exportDungeon = exportDungeon;