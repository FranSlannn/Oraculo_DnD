// Script de prueba para verificar equilibrio de aliados
// Ejecutar con node test_ally_balance.js

// Simular constantes y funciones necesarias
const crProgression = {
  1: { hpDice: '1d8', proficiencyBonus: 2, acBase: 12, attackBonus: 3, damage: '1d6' },
  2: { hpDice: '2d8', proficiencyBonus: 2, acBase: 13, attackBonus: 3, damage: '1d6+1' },
  3: { hpDice: '3d8', proficiencyBonus: 2, acBase: 13, attackBonus: 3, damage: '1d8' },
  4: { hpDice: '4d8', proficiencyBonus: 2, acBase: 14, attackBonus: 4, damage: '1d8+1' },
  5: { hpDice: '5d8', proficiencyBonus: 3, acBase: 15, attackBonus: 5, damage: '1d10' },
  6: { hpDice: '6d8', proficiencyBonus: 3, acBase: 15, attackBonus: 5, damage: '1d10+1' },
  7: { hpDice: '7d8', proficiencyBonus: 3, acBase: 15, attackBonus: 5, damage: '1d12' },
  8: { hpDice: '8d8', proficiencyBonus: 3, acBase: 16, attackBonus: 6, damage: '1d12+1' },
  9: { hpDice: '9d8', proficiencyBonus: 4, acBase: 16, attackBonus: 6, damage: '2d6' },
  10: { hpDice: '10d8', proficiencyBonus: 4, acBase: 17, attackBonus: 7, damage: '2d6+1' },
  11: { hpDice: '11d8', proficiencyBonus: 4, acBase: 17, attackBonus: 7, damage: '2d8' },
  12: { hpDice: '12d8', proficiencyBonus: 4, acBase: 18, attackBonus: 8, damage: '2d8+1' },
  13: { hpDice: '13d8', proficiencyBonus: 5, acBase: 18, attackBonus: 8, damage: '2d10' },
  14: { hpDice: '14d8', proficiencyBonus: 5, acBase: 18, attackBonus: 8, damage: '2d10+1' },
  15: { hpDice: '15d8', proficiencyBonus: 5, acBase: 18, attackBonus: 9, damage: '2d12' },
  16: { hpDice: '16d8', proficiencyBonus: 5, acBase: 19, attackBonus: 9, damage: '2d12+1' },
  17: { hpDice: '17d8', proficiencyBonus: 6, acBase: 19, attackBonus: 10, damage: '3d6' },
  18: { hpDice: '18d8', proficiencyBonus: 6, acBase: 20, attackBonus: 10, damage: '3d6+1' },
  19: { hpDice: '19d8', proficiencyBonus: 6, acBase: 20, attackBonus: 10, damage: '3d8' },
  20: { hpDice: '20d8', proficiencyBonus: 6, acBase: 20, attackBonus: 11, damage: '3d8+1' }
};

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
    const progression = crProgression[crVal] || crProgression[1];
    const baseStats = { FUE: 10, DES: 10, CON: 10, INT: 10, SAB: 10, CAR: 10 };
    const primaryStat = getPrimaryStat(role);
    baseStats[primaryStat] = 13 + (crVal - 1);
    Object.keys(baseStats).forEach(stat => {
        if (stat !== primaryStat) {
            baseStats[stat] += Math.floor((crVal - 1) / 3);
        }
    });
    const formattedStats = {};
    Object.keys(baseStats).forEach(stat => {
        const val = baseStats[stat];
        const mod = Math.floor((val - 10) / 2);
        formattedStats[stat] = `${val} (${mod >= 0 ? '+' : ''}${mod})`;
    });
    formattedStats.CA = progression.acBase;
    formattedStats.Velocidad = '30 pies';
    formattedStats.Daño = progression.damage;
    formattedStats['Bonificador de Ataque'] = `+${progression.attackBonus}`;
    formattedStats['Proficiency Bonus'] = progression.proficiencyBonus;
    return formattedStats;
}

function calculateEffectiveCR(stats) {
    const hp = parseInt(stats.HP) || 0;
    const attackBonus = parseInt(stats['Bonificador de Ataque']) || 0;
    const ac = parseInt(stats.CA) || 10;
    const damage = stats.Daño || '1d6';
    let cr = Math.floor((hp / 20) + (attackBonus / 2) + (ac / 5) - 5);
    return Math.max(1, Math.min(20, cr));
}

// Pruebas
console.log('Prueba de equilibrio para aliados:');
for (let cr = 1; cr <= 5; cr++) {
    const stats = customizeStats('Guerrero', cr);
    const conMod = parseInt(stats.CON.split('(')[1].split(')')[0]) || 0;
    const progression = crProgression[cr];
    const hpDice = progression.hpDice;
    const hpCount = parseInt(hpDice.split('d')[0]);
    const hpDie = parseInt(hpDice.split('d')[1]);
    const averageHp = Math.floor((hpDie / 2) + 0.5) * hpCount + (conMod * hpCount);
    stats.HP = `${averageHp} (${hpCount}d${hpDie} + ${conMod * hpCount})`;

    const effectiveCR = calculateEffectiveCR(stats);
    console.log(`CR ${cr}: HP=${stats.HP}, Ataque=${stats['Bonificador de Ataque']}, CA=${stats.CA}, Daño=${stats.Daño}, CR efectivo=${effectiveCR}`);
}