// Módulo Encuentros
function generateEncounter() {
    const location = document.getElementById('encounter-location').value;
    const time = document.getElementById('encounter-time').value;
    const cr = parseFloat(document.getElementById('encounter-cr').value);

    // Intentar encontrar monstruo por CR
    const monsterNames = Object.keys(window.monsters || {});
    const matchingMonsters = monsterNames.filter(name => window.monsters[name].challenge_rating === cr);

    let encounter;
    if (matchingMonsters.length > 0) {
        const monster = getRandomElement(matchingMonsters);
        encounter = `Encuentro con ${window.monsters[monster].name} (CR ${cr}) en ${location} (${time}).`;
    } else {
        // Usar tabla de encuentros
        const encounters = encounterTables[location][time];
        encounter = `Encuentro en ${location} (${time}): ${getRandomElement(encounters)}`;
    }

    displayResult('encounters', encounter);
    addToHistory('encounters', encounter);
}

function clearEncounters() {
    const history = document.getElementById('encounter-history');
    if (history) history.innerHTML = '<div class="history-title">Historial de Encuentros</div>';
    const result = document.getElementById('encounter-result');
    if (result) result.textContent = '';
    const allyCard = document.getElementById('ally-card-container');
    if (allyCard) allyCard.style.display = 'none';
}

// Constantes para NPCs
const allyNames = [
    "Aelar", "Bryn", "Caelum", "Drenna", "Eldrin", "Faelar", "Gwendolyn", "Haldir", "Isolde", "Jorvik",
    "Kaelen", "Liora", "Mirael", "Nyx", "Orin", "Peyton", "Quorin", "Rhea", "Sylvara", "Thalion",
    "Ursula", "Veylin", "Wren", "Xyra", "Ysolde", "Zephyr", "Aerith", "Brenna", "Cyril", "Darius",
    "Elowen", "Finnian", "Galen", "Hadrian", "Ilyana", "Jasper", "Kaelith", "Lorien", "Maelis", "Nero",
    "Oryn", "Phaedra", "Quillian", "Rhydian", "Seraphine", "Tarian", "Ulric", "Virelle", "Wylfred", "Xandor",
    "Ysmera", "Zorak"
];

const safeRandom = (arr) => Array.isArray(arr) && arr.length ? arr[Math.floor(Math.random() * arr.length)] : '';

function generateNpc() {
    const complexity = 'detailed'; // o random, pero usar detailed
    let res = "";
    res = `${safeRandom(npcRaces)} ${safeRandom(npcClasses)}, ${safeRandom(npcTraits)}, Objetivo: ${safeRandom(npcGoals)}`;
    const el = document.getElementById('encounter-result');
    if (el) el.textContent = res;
    addToHistory('encounters', res);
}

function generateVillain() {
    const goals = [
        "Poder", "Venganza", "Riqueza", "Destrucción", "Conquista", "Corrupción",
        "Dominación", "Caos", "Inmortalidad", "Traición", "Odio", "Control Mental",
        "Supremacía", "Desesperación", "Genocidio", "Rebelión", "Codicia", "Maldición"
    ];
    const flaws = [
        "Arrogancia", "Avaricia", "Paranoia", "Ira", "Orgullo", "Impaciencia",
        "Codicia", "Celos", "Cobardía", "Fanatismo", "Desconfianza", "Obstinación",
        "Vanidad", "Lujuria", "Envidia", "Gula", "Prejuicio", "Debilidad Física"
    ];
    const res = `Villano: ${safeRandom(npcRaces)} ${safeRandom(npcClasses)}, Motivo: ${safeRandom(goals)}, Debilidad: ${safeRandom(flaws)}`;
    const el = document.getElementById('encounter-result');
    if (el) el.textContent = res;
    addToHistory('encounters', res);
}

function generateAlly() {
    const skills = ["Combate", "Magia", "Sigilo", "Conocimiento", "Curación", "Persuasión"];
    const race = safeRandom(npcRaces);
    const className = safeRandom(npcClasses);
    const skill = safeRandom(skills);
    const trait = safeRandom(npcTraits);
    const role = `${className} leal`;
    const level = "1";
    const randomName = safeRandom(allyNames);
    const description = `una ${race.toLowerCase()} que ${safeRandom(npcGoals).toLowerCase()}`;
    const loyaltyNote = `Leal mientras se cumpla su ${safeRandom(npcGoals).toLowerCase()}`;
    const habitat = safeRandom(["Bosque encantado", "Montaña nevada", "Ruinas antiguas", "Desierto ardiente", "Cueva profunda", "Ciudad flotante"]);

    window.ally = {
        name: randomName,
        type: race,
        role: role,
        level: level,
        description: description,
        loyaltyNote: loyaltyNote,
        habitat: habitat,
        stats: customizeStats(className, level),
        abilities: [skill, "Percepción"],
        traits: [trait, safeRandom(npcTraits)],
        specialAction: "+2 a Exploración / +1d4 Curación",
        classSkills: generateClassSkills(className)
    };

    const res = `Aliado: ${race} ${className}, Habilidad: ${skill}, Rasgo: ${trait}`;
    document.getElementById('encounter-result').textContent = res;
    addToHistory('encounters', res);

    const allyCard = document.getElementById('ally-card-container');
    if (allyCard) {
        allyCard.style.display = 'block';
        generateAllyCard(window.ally);
    }
}

// Funciones auxiliares para aliado
function getProficiencyBonus(level) {
    const levelMap = { "0": 2, "1": 2, "2": 2, "3": 2, "4": 2, "5": 3, "6": 3, "7": 3, "8": 3, "9": 4, "10": 4, "11": 4, "12": 4, "13": 5, "14": 5, "15": 5, "16": 5, "17+": 6 };
    return levelMap[level] || 2;
}

function calculateHitPoints(level, conMod, type) {
    const hitDieCount = Math.max(1, Math.floor((parseInt(level) || 1) * 1.5));
    let hitDice = 6;
    if (type.includes("Elfo") || type.includes("Humanoide")) hitDice = 6;
    else if (type.includes("Bestia")) hitDice = 8;
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
    if (role.includes("Leal")) return baseLoyalty >= 3 ? "Alta" : "Media";
    else if (role.includes("Neutral")) return baseLoyalty >= 2 ? "Media" : "Baja";
    else return baseLoyalty >= 1 ? "Baja" : "Desleal";
}

function generateInventory(type, role) {
    const baseItems = ["Cuchillo", "Cantimplora"];
    if (type.includes("Elfo") || role.includes("Exploradora")) return [...baseItems, "Arco corto", "2 Pociones de curación"];
    return baseItems;
}

function generateSpecialAction(traits, level) {
    return "+2 a Exploración / +1d4 Curación";
}

function generateDialogue(loyalty, charismaMod) {
    const responses = {
        "Alta": ["¡Claro, te ayudaré con gusto!", "Juntos somos invencibles.", "Confío en tu liderazgo."],
        "Media": ["Hmm, supongo que puedo ayudar...", "Solo si me conviene.", "Dime qué necesitas."],
        "Baja": ["No estoy seguro de esto...", "Solo si no hay otro modo.", "¿Por qué debería ayudarte?"],
        "Desleal": ["¡No confío en ti!", "Mejor me voy por mi cuenta.", "¡Traición es mi juego!"]
    };
    const chaosFactor = Math.random() < 0.3 ? " (con un giro inesperado)" : "";
    const validLoyalty = responses[loyalty] ? loyalty : "Media";
    const baseIndex = Math.floor(Math.random() * responses[validLoyalty].length);
    const modifier = charismaMod > 0 ? Math.min(charismaMod, 2) : 0;
    const adjustedIndex = (baseIndex + modifier) % responses[validLoyalty].length;
    return responses[validLoyalty][adjustedIndex] + chaosFactor;
}

function getPrimaryStat(role) {
    const roleMap = { "Guerrero": "FUE", "Mago": "INT", "Clérigo": "SAB", "Pícaro": "DES", "Bárbaro": "FUE", "Bardo": "CAR", "Explorador": "DES",
                       "Paladín": "FUE", "Druida": "SAB", "Monje": "DES", "Hechicero": "CAR", "Brujo": "CAR", "Alquimista": "INT",
                       "Cazador de Demonios": "DES", "Caballero Negro": "FUE", "Artificiero": "INT", "Samurái": "FUE", "Guardabosques": "DES",
                       "Invocador": "INT", "Nigromante": "INT", "Gladiador": "FUE", "Mercenario": "FUE", "Sacerdote de Guerra": "SAB",
                       "Maestro de Bestias": "SAB", "Espadachín": "FUE", "Ilusionista": "INT" };
    return roleMap[role.split(" ")[0]] || "FUE";
}

function customizeStats(role, level) {
    const baseStats = { FUE: "10 (+0)", DES: "10 (+0)", CON: "10 (+0)", INT: "10 (+0)", SAB: "10 (+0)", CAR: "10 (+0)" };
    const roleBoosts = { "Guerrero": { FUE: "16 (+3)" }, "Mago": { INT: "16 (+3)" }, "Clérigo": { SAB: "16 (+3)" }, "Pícaro": { DES: "16 (+3)" },
                           "Bárbaro": { FUE: "16 (+3)" }, "Bardo": { CAR: "16 (+3)" }, "Explorador": { DES: "16 (+3)" }, "Paladín": { FUE: "16 (+3)" },
                           "Druida": { SAB: "16 (+3)" }, "Monje": { DES: "16 (+3)" }, "Hechicero": { CAR: "16 (+3)" }, "Brujo": { CAR: "16 (+3)" },
                           "Alquimista": { INT: "16 (+3)" }, "Cazador de Demonios": { DES: "16 (+3)" }, "Caballero Negro": { FUE: "16 (+3)" },
                           "Artificiero": { INT: "16 (+3)" }, "Samurái": { FUE: "16 (+3)" }, "Guardabosques": { DES: "16 (+3)" },
                           "Invocador": { INT: "16 (+3)" }, "Nigromante": { INT: "16 (+3)" }, "Gladiador": { FUE: "16 (+3)" },
                           "Mercenario": { FUE: "16 (+3)" }, "Sacerdote de Guerra": { SAB: "16 (+3)" }, "Maestro de Bestias": { SAB: "16 (+3)" },
                           "Espadachín": { FUE: "16 (+3)" }, "Ilusionista": { INT: "16 (+3)" } };
    let stats = { ...baseStats, ...roleBoosts[role.split(" ")[0]] };
    stats.CA = "14";
    stats.Velocidad = "30 pies";
    stats.Daño = "1d6";
    return stats;
}

function generateClassSkills(role) {
    const classSkills = { "Guerrero": ["Golpe potente"], "Mago": ["Lanzamiento de conjuros"], "Clérigo": ["Curación divina"], "Pícaro": ["Sigilo"],
                           "Bárbaro": ["Furia"], "Bardo": ["Inspiración"], "Explorador": ["Rastreo", "Disparo Preciso"], "Paladín": ["Golpe sagrado"],
                           "Druida": ["Forma salvaje"], "Monje": ["Golpe de ki"], "Hechicero": ["Explosión mágica"], "Brujo": ["Pacto oscuro"],
                           "Alquimista": ["Poción explosiva"], "Cazador de Demonios": ["Ataque demoníaco"], "Caballero Negro": ["Golpe sombrío"],
                           "Artificiero": ["Dispositivo mágico"], "Samurái": ["Corte preciso"], "Guardabosques": ["Tiro certero"],
                           "Invocador": ["Invocación menor"], "Nigromante": ["Resurrección menor"], "Gladiador": ["Golpe teatral"],
                           "Mercenario": ["Ataque rápido"], "Sacerdote de Guerra": ["Bendición bélica"], "Maestro de Bestias": ["Llamado animal"],
                           "Espadachín": ["Estocada"], "Ilusionista": ["Ilusión menor"] };
    return classSkills[role.split(" ")[0]] || ["Sin habilidades"];
}

function useClassSkill(skill, level) {
    const skillEffects = {
        "Rastreo": () => `Rastreo exitoso (1d20 + ${getProficiencyBonus(level)}): ${Math.floor(Math.random() * 20) + 1 + getProficiencyBonus(level)}`,
        "Disparo Preciso": () => `Daño adicional (1d4): +${Math.floor(Math.random() * 4) + 1}`,
        "Lanzamiento de conjuros": () => `Daño mágico (1d6): ${Math.floor(Math.random() * 6) + 1}`,
        "Golpe potente": () => `Daño extra (1d6): +${Math.floor(Math.random() * 6) + 1}`,
        "Curación divina": () => `Curación (1d6): +${Math.floor(Math.random() * 6) + 1} PV`,
        "Sigilo": () => `Sigilo exitoso (1d20 + ${getProficiencyBonus(level)}): ${Math.floor(Math.random() * 20) + 1 + getProficiencyBonus(level)}`,
        "Furia": () => `Daño aumentado (1d8): +${Math.floor(Math.random() * 8) + 1}`,
        "Inspiración": () => `Inspiración otorgada (+${getProficiencyBonus(level)})`,
        "Golpe sagrado": () => `Daño divino (1d6): ${Math.floor(Math.random() * 6) + 1}`,
        "Forma salvaje": () => `Transformación activa (1d4 rondas)`,
        "Golpe de ki": () => `Daño ki (1d4): +${Math.floor(Math.random() * 4) + 1}`,
        "Explosión mágica": () => `Daño mágico (1d8): ${Math.floor(Math.random() * 8) + 1}`,
        "Pacto oscuro": () => `Daño oscuro (1d6): ${Math.floor(Math.random() * 6) + 1}`,
        "Poción explosiva": () => `Daño explosivo (1d6): ${Math.floor(Math.random() * 6) + 1}`,
        "Ataque demoníaco": () => `Daño infernal (1d8): ${Math.floor(Math.random() * 8) + 1}`,
        "Golpe sombrío": () => `Daño sombrío (1d6): ${Math.floor(Math.random() * 6) + 1}`,
        "Dispositivo mágico": () => `Efecto mágico (1d4): +${Math.floor(Math.random() * 4) + 1}`,
        "Corte preciso": () => `Daño preciso (1d6): ${Math.floor(Math.random() * 6) + 1}`,
        "Tiro certero": () => `Daño certero (1d4): +${Math.floor(Math.random() * 4) + 1}`,
        "Invocación menor": () => `Criatura invocada (1d4 HP)`,
        "Resurrección menor": () => `Esqueleto animado (1d6 HP)`,
        "Golpe teatral": () => `Daño escénico (1d6): ${Math.floor(Math.random() * 6) + 1}`,
        "Ataque rápido": () => `Daño rápido (1d4): +${Math.floor(Math.random() * 4) + 1}`,
        "Bendición bélica": () => `Curación (1d6): +${Math.floor(Math.random() * 6) + 1} PV`,
        "Llamado animal": () => `Aliado animal (1d4 rondas)`,
        "Estocada": () => `Daño penetrante (1d6): ${Math.floor(Math.random() * 6) + 1}`,
        "Ilusión menor": () => `Ilusión creada (1d4 rondas)`
    };
    return skillEffects[skill] ? skillEffects[skill]() : "Habilidad no disponible";
}

function generateAllyCard(allyData) {
    const card = document.getElementById('ally-card-container');
    card.querySelector('.ally-name').innerHTML = `<i class="fas fa-user-friends"></i> ${allyData.name}`;
    card.querySelector('.ally-type').textContent = `${allyData.type} • ${allyData.role} • Nivel ${allyData.level}`;

    const conMod = parseInt(allyData.stats.CON.split('+')[1]) || 0;
    const hp = calculateHitPoints(allyData.level, conMod, allyData.type);
    const primaryStat = getPrimaryStat(allyData.role);
    const mainAbilityMod = parseInt(allyData.stats[primaryStat].split('+')[1]) || 0;
    const attackBonus = calculateAttackBonus(mainAbilityMod, allyData.level);
    const savingThrows = calculateSavingThrows(allyData.stats, allyData.level);
    const charismaMod = parseInt(allyData.stats.CAR.split('+')[1]) || 0;
    const loyalty = getLoyalty(charismaMod, allyData.role);
    const inventory = generateInventory(allyData.type, allyData.role);
    const specialAction = generateSpecialAction(allyData.traits, allyData.level);
    const classSkills = generateClassSkills(allyData.role);

    allyData.stats.HP = `${hp} (${Math.floor(hp / (conMod + 1))}d${Math.floor(hp / (conMod + 1) * 2)} + ${conMod * Math.floor(hp / (conMod + 1))})`;
    allyData.stats["Bonificador de Ataque"] = `+${attackBonus}`;
    allyData.stats["Salvaciones"] = `DES +${savingThrows.DES}, SAB +${savingThrows.SAB}`;
    allyData.stats["Acción especial"] = specialAction;
    allyData.stats["Lealtad"] = loyalty;
    allyData.stats["EXP"] = allyData.stats["EXP"] || 0;
    allyData.stats["Nivel"] = allyData.level;
    allyData.stats["Inventario"] = inventory.join(", ");
    allyData.classSkills = classSkills;

    const statsHighlight = card.querySelector('.stats-highlight');
    statsHighlight.innerHTML = `
        <div class="hp-highlight"><i class="fas fa-heart stat-icon"></i>Puntos de Golpe: ${allyData.stats.HP}</div>
        <div><i class="fas fa-shield-alt stat-icon"></i>Clase de Armadura: ${allyData.stats.CA}</div>
        <div><i class="fas fa-dice-d20 stat-icon"></i>${primaryStat}: ${allyData.stats[primaryStat]}</div>
    `;
    const statsDetail = card.querySelector('.stats-detail');
    statsDetail.innerHTML = `
        <div><i class="fas fa-running stat-icon"></i>Velocidad: ${allyData.stats.Velocidad}</div>
        <div><i class="fas fa-dice-d20 stat-icon"></i>Destreza: ${allyData.stats.DES}</div>
        <div><i class="fas fa-heart stat-icon"></i>Constitución: ${allyData.stats.CON}</div>
        <div><i class="fas fa-brain stat-icon"></i>Inteligencia: ${allyData.stats.INT}</div>
        <div><i class="fas fa-eye stat-icon"></i>Sabiduría: ${allyData.stats.SAB}</div>
        <div><i class="fas fa-fire stat-icon"></i>Carisma: ${allyData.stats.CAR}</div>
        <div><i class="fas fa-dice stat-icon"></i>Daño típico: ${allyData.stats.Daño}</div>
        <div><i class="fas fa-sword stat-icon"></i>Bonificador de Ataque: ${allyData.stats["Bonificador de Ataque"]}</div>
        <div><i class="fas fa-shield stat-icon"></i>Salvaciones: ${allyData.stats["Salvaciones"]}</div>
        <div><i class="fas fa-compass stat-icon"></i>Acción especial: ${allyData.stats["Acción especial"]}</div>
        <div><i class="fas fa-handshake stat-icon"></i>Lealtad: <span class="loyalty-indicator ${loyalty === 'Alta' ? 'loyalty-high' : loyalty === 'Media' ? 'loyalty-medium' : 'loyalty-low'}">${allyData.stats["Lealtad"]}</span></div>
        <button class="action-button" onclick="useSpecialAction()">Usar Acción Especial</button>
        <button class="exp-button" onclick="gainExperience()">Ganar EXP</button>
        <div id="action-result"></div>
        <div id="exp-result"></div>
        <div id="dialogue-result"></div>
    `;
    const narrative = card.querySelector('.narrative');
    narrative.innerHTML = `
        <i class="fas fa-book narrative-icon"></i>${allyData.name}, ${allyData.description}. <i class="fas fa-heart narrative-icon"></i>${allyData.loyaltyNote}. Encontrada en: <i class="fas fa-tree narrative-icon"></i>${allyData.habitat}.
    `;
    const abilities = card.querySelector('.section-content:nth-child(2)');
    abilities.textContent = allyData.abilities.join(', ') || 'Sin items';
    const classAbilities = card.querySelector('#class-skills-content');
    classAbilities.textContent = allyData.classSkills.join(', ') || 'Sin habilidades';
    const skillButtons = card.querySelector('#skill-buttons');
    skillButtons.innerHTML = allyData.classSkills.map(skill => `<button class="skill-button" onclick="useSkill('${skill}')">${skill}</button>`).join(' ');
    const traits = card.querySelector('#traits-content');
    traits.textContent = allyData.traits.join(', ') || 'Sin rasgos';
    const inventorySection = card.querySelector('#inventory-content');
    inventorySection.textContent = allyData.stats["Inventario"];

    const table = card.querySelector('.stats-table');
    table.innerHTML = '';
    for (const [key, value] of Object.entries(allyData.stats)) {
        const row = table.insertRow();
        row.insertCell().textContent = key;
        row.insertCell().textContent = value;
    }
}

let actionIndex = 0;
window.useSpecialAction = function() {
    const table = document.querySelector('#ally-card-container .stats-table');
    const d20 = Math.floor(Math.random() * 20) + 1;
    const actions = table.rows[table.rows.length - 8].cells[1].textContent.split(" / ");
    const currentAction = actions[actionIndex % actions.length].trim();
    let result;

    if (currentAction.startsWith("+") && currentAction.includes("a Exploración")) {
        const bonus = parseInt(currentAction.match(/\+\d+/)[0]);
        result = d20 + bonus;
        document.getElementById('action-result').textContent = `Exploración: ${result} (1d20 + ${bonus})`;
    } else if (currentAction.includes("Curación")) {
        const die = parseInt(currentAction.match(/\d+/)[0]);
        result = Math.floor(Math.random() * die) + 1;
        document.getElementById('action-result').textContent = `Curación: +${result} PV (1d${die})`;
    }
    actionIndex++;
    generateDialogueResponse();
};

window.gainExperience = function() {
    const table = document.querySelector('#ally-card-container .stats-table');
    let exp = parseInt(table.rows[table.rows.length - 5].cells[1].textContent) || 0;
    exp += 100;
    let level = parseInt(table.rows[table.rows.length - 4].cells[1].textContent) || 1;

    if (exp >= level * 300) {
        level++;
        exp = 0;
        document.getElementById('exp-result').textContent = `¡${window.ally.name} sube a Nivel ${level}!`;
        window.ally.level = level.toString();
        window.ally.stats = customizeStats(window.ally.role.split(" ")[0], level);
        generateAllyCard(window.ally);
    } else {
        document.getElementById('exp-result').textContent = `${window.ally.name} gana 100 EXP. Total: ${exp} EXP`;
    }
    table.rows[table.rows.length - 5].cells[1].textContent = exp;
    table.rows[table.rows.length - 4].cells[1].textContent = level;
    window.ally.stats.EXP = exp;
    checkLoyaltyShift();
};

function generateDialogueResponse() {
    const table = document.querySelector('#ally-card-container .stats-table');
    let charismaMod = 0;
    for (let i = 0; i < table.rows.length; i++) {
        if (table.rows[i].cells[0].textContent === "CAR") {
            const carValue = table.rows[i].cells[1].textContent;
            charismaMod = parseInt(carValue.split('+')[1]) || 0;
            break;
        }
    }
    const loyalty = table.rows[table.rows.length - 6].cells[1].textContent;
    const dialogue = generateDialogue(loyalty, charismaMod);
    document.getElementById('dialogue-result').textContent = `${window.ally.name} dice: "${dialogue}"`;
}

function checkLoyaltyShift() {
    const table = document.querySelector('#ally-card-container .stats-table');
    let charismaMod = 0;
    for (let i = 0; i < table.rows.length; i++) {
        if (table.rows[i].cells[0].textContent === "CAR") {
            const carValue = table.rows[i].cells[1].textContent;
            charismaMod = parseInt(carValue.split('+')[1]) || 0;
            break;
        }
    }
    const currentLoyalty = table.rows[table.rows.length - 6].cells[1].textContent;
    const roll = Math.floor(Math.random() * 20) + 1;

    if (currentLoyalty === "Baja" && roll < 5 - charismaMod) {
        table.rows[table.rows.length - 6].cells[1].textContent = "Desleal";
        document.getElementById('dialogue-result').textContent = `${window.ally.name} dice: "¡Me voy por mi cuenta!" (Desleal)`;
    } else if (currentLoyalty === "Media" && roll > 15 + charismaMod) {
        table.rows[table.rows.length - 6].cells[1].textContent = "Alta";
        document.getElementById('dialogue-result').textContent = `${window.ally.name} dice: "¡Confío más en ti ahora!" (Lealtad a Alta)`;
    }
}

window.useSkill = function(skill) {
    const table = document.querySelector('#ally-card-container .stats-table');
    const level = table.rows[table.rows.length - 4].cells[1].textContent;
    const result = useClassSkill(skill, level);
    document.getElementById('action-result').textContent = `${skill}: ${result}`;
    generateDialogueResponse();
};

window.saveAlly = function() {
    if (window.ally) {
        localStorage.setItem('savedAlly', JSON.stringify(window.ally));
        alert(`${window.ally.name} ha sido guardado.`);
    } else {
        alert('No hay aliado para guardar.');
    }
};

window.loadAlly = function() {
    const savedAlly = localStorage.getItem('savedAlly');
    if (savedAlly) {
        window.ally = JSON.parse(savedAlly);
        const allyCard = document.getElementById('ally-card-container');
        if (allyCard) {
            allyCard.style.display = 'block';
            generateAllyCard(window.ally);
            addToHistory('encounters', `Aliado: ${window.ally.type} ${window.ally.role.split(" ")[0]}, Habilidad: ${window.ally.abilities[0]}, Rasgo: ${window.ally.traits[0]}`);
        }
    } else {
        alert('No hay aliado guardado.');
    }
};

function generateMonster() {
    if (!window.monsters) {
        displayResult('encounters', 'Loading monsters data...');
        fetch('monsters.json')
            .then(response => response.json())
            .then(data => {
                window.monsters = data;
                generateMonster(); // retry
            })
            .catch(error => {
                console.error('Error loading monsters:', error);
                displayResult('encounters', 'Error loading monsters data.');
            });
        return;
    }
    const monsterNames = Object.keys(window.monsters);
    const monsterName = getRandomElement(monsterNames);
    const monster = window.monsters[monsterName];

    const res = `Monstruo: ${monster.name} (${monster.meta})`;
    document.getElementById('encounter-result').textContent = res;
    addToHistory('encounters', res);

    const monsterCard = document.getElementById('monster-card-container');
    if (monsterCard) {
        monsterCard.style.display = 'block';
        generateMonsterCard(monster);
    }
}

function generateMonsterCard(monster) {
    const card = document.getElementById('monster-card-container');
    card.querySelector('.monster-name').innerHTML = `<i class="fas fa-dragon"></i> ${monster.name}`;
    card.querySelector('.monster-meta').innerHTML = `<i class="fas fa-info-circle"></i> ${monster.meta}`;

    let stats = `<i class="fas fa-shield-alt"></i> <strong>Armor Class:</strong> ${monster['Armor Class']}<br>`;
    stats += `<i class="fas fa-heart"></i> <strong>Hit Points:</strong> ${monster['Hit Points']}<br>`;
    stats += `<i class="fas fa-running"></i> <strong>Speed:</strong> ${monster['Speed']}<br>`;
    stats += `<i class="fas fa-dumbbell"></i> <strong>STR:</strong> ${monster['STR']} <i class="fas fa-dumbbell"></i> <strong>DEX:</strong> ${monster['DEX']} <i class="fas fa-dumbbell"></i> <strong>CON:</strong> ${monster['CON']}<br>`;
    stats += `<i class="fas fa-brain"></i> <strong>INT:</strong> ${monster['INT']} <i class="fas fa-brain"></i> <strong>WIS:</strong> ${monster['WIS']} <i class="fas fa-brain"></i> <strong>CHA:</strong> ${monster['CHA']}<br>`;
    if (monster['Saving Throws']) stats += `<i class="fas fa-save"></i> <strong>Saving Throws:</strong> ${monster['Saving Throws']}<br>`;
    if (monster['Skills']) stats += `<i class="fas fa-tools"></i> <strong>Skills:</strong> ${monster['Skills']}<br>`;
    if (monster['Damage Resistances']) stats += `<i class="fas fa-shield-virus"></i> <strong>Damage Resistances:</strong> ${monster['Damage Resistances']}<br>`;
    if (monster['Damage Immunities']) stats += `<i class="fas fa-shield-alt"></i> <strong>Damage Immunities:</strong> ${monster['Damage Immunities']}<br>`;
    if (monster['Condition Immunities']) stats += `<i class="fas fa-shield-alt"></i> <strong>Condition Immunities:</strong> ${monster['Condition Immunities']}<br>`;
    if (monster['Senses']) stats += `<i class="fas fa-eye"></i> <strong>Senses:</strong> ${monster['Senses']}<br>`;
    if (monster['Languages']) stats += `<i class="fas fa-comments"></i> <strong>Languages:</strong> ${monster['Languages']}<br>`;
    stats += `<i class="fas fa-star"></i> <strong>Challenge:</strong> ${monster['Challenge']}`;

    card.querySelector('.monster-stats').innerHTML = stats;

    let traits = '';
    if (monster['Traits']) {
        traits = monster['Traits'].map(t => `<i class="fas fa-star"></i> <strong>${t.name}:</strong> ${t.description}`).join('<br>');
    }
    card.querySelector('.monster-traits').innerHTML = traits;

    let actions = '';
    if (monster['Actions']) {
        actions = monster['Actions'].map(a => `<i class="fas fa-sword"></i> <strong>${a.name}:</strong> ${a.description}`).join('<br>');
    }
    card.querySelector('.monster-actions').innerHTML = actions;
}