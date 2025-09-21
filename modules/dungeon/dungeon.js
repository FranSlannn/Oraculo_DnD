// Módulo Mazmorra
function generateRoom() {
    const type = getRandomElement(roomTypes);
    const feature = getRandomElement(roomFeatures);
    const room = `Habitación: ${type} con ${feature}`;
    displayResult('dungeon', room);
    addToHistory('dungeon', room);
}

function generateTrap() {
    const trap = getRandomElement(traps);
    displayResult('dungeon', `Trampa: ${trap}`);
    addToHistory('dungeon', `Trampa: ${trap}`);
}

function generatePuzzle() {
    const puzzle = getRandomElement(puzzles);
    displayResult('dungeon', `Puzle: ${puzzle}`);
    addToHistory('dungeon', `Puzle: ${puzzle}`);
}

function clearDungeon() {
    const history = document.getElementById('dungeon-history');
    if (history) history.innerHTML = '<div class="history-title">Historial de Mazmorra</div>';
    const result = document.getElementById('dungeon-result');
    if (result) result.textContent = '';
    const map = document.getElementById('dungeon-map');
    if (map) map.innerHTML = '';
}

// Función para agregar al historial
function addDungeonHistory(text) {
    addToHistory('dungeon', text);
}

// Función para generar mazmorra visual
function generateDungeon() {
    const sizeSelect = document.getElementById('dungeon-size');
    const sizeVal = sizeSelect ? sizeSelect.value : 'small';
    const n = sizeVal === 'small' ? 3 : sizeVal === 'medium' ? 5 : 7;
    const map = document.getElementById('dungeon-map');
    if (!map) return;

    map.innerHTML = '';
    map.style.display = 'grid';
    map.style.gridTemplateColumns = `repeat(${n}, 60px)`;
    map.style.gridAutoRows = '60px';
    map.style.gridGap = '6px';

    const total = n * n;
    const roomCount = Math.max(1, Math.floor(total * (0.30 + Math.random() * 0.2)));
    const indices = Array.from({ length: total }, (_, i) => i);
    const shuffledIndices = shuffleArray(indices);
    const roomIndices = new Set(shuffledIndices.slice(0, roomCount));

    for (let i = 0; i < total; i++) {
        const cell = document.createElement('div');
        cell.className = 'dungeon-cell';
        cell.dataset.index = i;

        if (roomIndices.has(i)) {
            // Habitaciones
            const desc = buildRoomDescription('detailed');
            cell.classList.add('dungeon-room');
            cell.title = desc;
            cell.textContent = 'R';
            cell.style.cursor = 'pointer';
            cell.addEventListener('click', () => {
                cell.classList.add('explored');
                document.getElementById('dungeon-result').textContent = desc;
                addDungeonHistory(`Habitación (mapa): ${desc}`);
            });
        } else {
            // Casillas vacías con posibilidad de algo especial
            const r2 = Math.random();
            if (r2 < 0.3) {
                const roll = Math.random();
                if (roll < 0.4) {
                    // Objeto curioso
                    const feature = getRandomElement(roomFeatures);
                    cell.classList.add('object');
                    cell.textContent = 'O';
                    cell.title = `Objeto curioso: ${feature}`;
                    cell.style.cursor = 'pointer';
                    cell.addEventListener('click', () => {
                        document.getElementById('dungeon-result').textContent = `Has encontrado un objeto curioso: ${feature}`;
                        addDungeonHistory(`Objeto encontrado: ${feature}`);
                    });
                } else if (roll < 0.7) {
                    // Puzzle
                    const puzzle = getRandomElement(puzzles);
                    cell.classList.add('puzzle');
                    cell.textContent = 'P';
                    cell.title = `Puzzle oculto: ${puzzle}`;
                    cell.style.cursor = 'pointer';
                    cell.addEventListener('click', () => {
                        document.getElementById('dungeon-result').textContent = `Puzzle oculto: ${puzzle}`;
                        addDungeonHistory(`Puzzle oculto descubierto: ${puzzle}`);
                    });
                } else {
                    // Trampa custodiando un objeto
                    const trap = getRandomElement(traps);
                    const feature = getRandomElement(roomFeatures);
                    cell.classList.add('trap');
                    cell.textContent = 'T';
                    cell.title = `Trampa custodiando: ${feature} (${trap})`;
                    cell.style.cursor = 'pointer';
                    cell.addEventListener('click', () => {
                        document.getElementById('dungeon-result').textContent = `Has encontrado ${feature}, pero está custodiado por una trampa: ${trap}`;
                        addDungeonHistory(`Tesoro custodiado: ${feature} con trampa ${trap}`);
                    });
                }
            } else {
                // Espacio vacío
                cell.classList.add('empty');
                cell.textContent = '';
                cell.addEventListener('click', () => {
                    document.getElementById('dungeon-result').textContent = 'Espacio vacío / pasillo';
                    addDungeonHistory('Inspección: espacio vacío/pasillo');
                });
            }
        }
        map.appendChild(cell);
    }

    const summary = `Mazmorra ${sizeVal} generada (${n}x${n}). Habitaciones: ${roomCount}. Haz clic en las celdas para explorar.`;
    document.getElementById('dungeon-result').textContent = summary;
    addDungeonHistory(summary);

    // Activar leyenda interactiva
    setupDungeonLegend();
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