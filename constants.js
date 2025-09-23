// =========================================================================
// =========================================================================
// 						COSTANTES
// =========================================================================
// =========================================================================

/*
Guía rápida de este archivo
================================
Propósito: Centralizar TODAS las tablas y constantes compartidas por los módulos.
Carga: Asegúrate de cargar este archivo antes de JS/script.js en Index.html.

Estructura de secciones:
- Generador de Nombres (nameGenerators): Nombres por raza (masc/fem/apellidos).
- Nombres de Lugares (placeNames): Prefijos y sufijos para topónimos.
- Clima (weatherSystems): Sistemas climáticos y condiciones.
- Encuentros (encounterTables): Encuentros por entorno (urbano, bosque, etc.) y horario.
- Oráculo (oracleAnswersSimple/Detailed/Mythic): Respuestas tipo sí/no con diferentes granularidades.
- Consecuencias (consequences): Efectos/post-resultado para enriquecer decisiones.
- Cambios de Escena (sceneChanges): Transiciones/ambiente por categorías.
- PNJ (npcRaces, npcClasses, npcTraits, npcGoals): Atributos para generadores de NPCs.
- Mazmorra (roomTypes, roomFeatures, traps, puzzles): Tablas para generar interiores y desafíos.
- Ítems (itemList): Ítems por rareza/categoría para botín o hallazgos.
- Progreso de Metas (goalProgress): Tablas temáticas para evaluar avance/retroceso de objetivos.
- Rumores (rumorTypes/…/rumorReliability): Componentes para construir rumores completos.
- Narrativa (narrativeMeaningTables, narrativeRandomEvents): Interpretación y eventos aleatorios.
- Combate (combatTacticsPool, combatActions): Tácticas y acciones usadas por el tracker.
- Botín (lootTables): Tablas de botín por rareza.

Notas de diseño:
- No duplicar tablas en los módulos; usar siempre estas globales.
- Si necesitas ampliar, añade aquí nuevos valores manteniendo el estilo.
- Se integraron tablas sociales/exploración en encounterTables y para enemigos se usa monsters.json.
*/

// =========================================================================
// Sección: Generador de Nombres
// =========================================================================
// Objeto con generadores de nombres por raza (humano, elfo, enano, etc.), incluyendo nombres masculinos, femeninos y apellidos.
// Basado en D&D 5e, sirve para crear PNJs con identidades únicas y culturalmente coherentes.                 

const nameGenerators = {
  human: {
    male: ['Adrian', 'Borin', 'Cedric', 'Darian', 'Eldon', 'Favian', 'Gareth', 'Harold', 'Ivan', 'Jasper'],
    female: ['Arria', 'Bryn', 'Cora', 'Daphne', 'Elora', 'Faye', 'Gwen', 'Helena', 'Irene', 'Jasmine'],
    surnames: ['Blackwood', 'Rivera', 'Stonehand', 'Ironwill', 'Goldleaf', 'Fairchild', 'Stormwind', 'Hawthorne']
  },
  elf: {
    male: ['Aelar', 'Beiro', 'Cyran', 'Doral', 'Erevan', 'Faelar', 'Galad', 'Harmon', 'Ivellios', 'Jandar'],
    female: ['Arya', 'Brialla', 'Cyrene', 'Drusilia', 'Elaria', 'Fianna', 'Gwyn', 'Halla', 'Ilyana', 'Jastra'],
    surnames: ['Moonshadow', 'Starweaver', 'Windrider', 'Nightbreeze', 'Sunstrider', 'Dawnwhisper', 'Leafrunner']
  },
  dwarf: {
    male: ['Balin', 'Dorin', 'Fargrim', 'Gimli', 'Harbek', 'Kildrak', 'Morgran', 'Orin', 'Rurik', 'Thorin'],
    female: ['Anbera', 'Bardryn', 'Dagnal', 'Fenryl', 'Gunnloda', 'Hlin', 'Kathra', 'Liftrasa', 'Mardred', 'Riswynn'],
    surnames: ['Ironforge', 'Stonehammer', 'Goldhand', 'Bronzebeard', 'Fireforge', 'Deepdelver', 'Anvilmar']
  },
  halfling: {
    male: ['Alton', 'Bilbo', 'Cade', 'Drogo', 'Eldon', 'Frodo', 'Gerbo', 'Halfred', 'Isembard', 'Jolly'],
    female: ['Apple', 'Bell', 'Daisy', 'Esme', 'Fenna', 'Gilly', 'Hilda', 'Ivy', 'Jenna', 'Lily'],
    surnames: ['Goodbody', 'Greenhill', 'Highhill', 'Lightfoot', 'Longhole', 'Proudfoot', 'Smallburrow']
  },
  dragonborn: {
    male: ['Arjhan', 'Balasar', 'Bharash', 'Donaar', 'Ghesh', 'Heskan', 'Kriv', 'Medrash', 'Mehen', 'Nadarr'],
    female: ['Akra', 'Biri', 'Daar', 'Farideh', 'Harann', 'Havilar', 'Jheri', 'Kava', 'Korinn', 'Mishann'],
    surnames: ['Clethtinthiallor', 'Daardendrian', 'Delmirev', 'Drachedandion', 'Fenkenkabradon', 'Kepeshkmolik']
  },
  gnome: {
    male: ['Alston', 'Alvyn', 'Boddynock', 'Brocc', 'Burgell', 'Dimble', 'Eldon', 'Erky', 'Fonkin', 'Frug'],
    female: ['Bimpnottin', 'Breena', 'Caramip', 'Carlin', 'Donella', 'Duvamil', 'Ellyjobell', 'Ellywick', 'Lilli', 'Loopmottin'],
    surnames: ['Beren', 'Daergel', 'Folkor', 'Garrick', 'Nackle', 'Murnig', 'Ningel', 'Raulnor', 'Scheppen', 'Timbers']
  },
  tiefling: {
    male: ['Akmenos', 'Amnon', 'Barakas', 'Damakos', 'Ekemon', 'Iados', 'Kairon', 'Leucis', 'Melech', 'Mordai'],
    female: ['Akta', 'Anakis', 'Bryseis', 'Criella', 'Damaia', 'Ea', 'Kallista', 'Lerissa', 'Makaria', 'Nemeia'],
    surnames: ['Art', 'Carrion', 'Chant', 'Creed', 'Despair', 'Excellence', 'Fear', 'Glory', 'Hope', 'Ideal']
  }
};

// =========================================================================
// Sección: Generador de Nombres de Lugares
// =========================================================================
// Objeto con prefijos y sufijos para generar nombres de lugares de forma dinámica.
// Inspirado en D&D, permite crear nombres evocadores para ciudades, bosques o mazmorras.

const placeNames = {
  prefixes: [
    'Verde', 'Plata', 'Oscuro', 'Alto', 'Profundo', 'Sombra', 'Brillante', 'Piedra', 'Hierro', 'Viento', 
    'Ébano', 'Cristal', 'Fuego', 'Luz', 'Trueno', 'Runa', 'Dorado', 'Azul', 'Nublado', 'Río', 
    'Montaña', 'Tóxico', 'Eterno', 'Lunar', 'Sagrado', 'Salvaje', 'Cielo', 'Oro', 'Púrpura', 'Mar'
  ],
  suffixes: [
    'bosque', 'refugio', 'colina escarpada', 'cresta', 'valle', 'puente', 'vado', 'colina', 'roca', 'fortaleza', 
    'torre', 'cueva', 'castillo', 'pantano', 'lago', 'desierto', 'templo', 'ruinas', 'playa', 'isla', 
    'clave', 'camino', 'paso', 'glaciar', 'volcán', 'abismo', 'santuario', 'ciudadela', 'jardín', 'barranco'
  ]
};

// =========================================================================
// Sección: Generador de Clima
// =========================================================================
// Objeto con sistemas climáticos (templado, frío, árido, tropical) y condiciones asociadas.
// Basado en D&D, añade realismo y desafíos ambientales a las escenas.

const weatherSystems = {
  temperate: {
    conditions: [
      'Despejado', 'Parcialmente nublado', 'Nublado', 'Lluvia ligera', 'Lluvia intensa', 'Tormenta eléctrica', 'Vientos fuertes', 'Niebla', 
      'Llovizna mágica', 'Brisa encantada', 'Nubes danzantes', 'Chubascos breves', 'Arcoíris místico', 'Viento susurrante', 'Humedad espesa', 
      'Tormenta de cenizas leves', 'Luz de luna filtrada', 'Brisa fresca de bosque', 'Niebla dorada', 'Lluvia bendita'
    ]
  },
  cold: {
    conditions: [
      'Despejado y gélido', 'Nevando levemente', 'Nevada intensa', 'Ventisca', 'Escarcha', 'Hielo', 'Niebla helada', 
      'Tormenta de nieve mágica', 'Viento cortante', 'Aurora boreal', 'Congelación repentina', 'Nieve brillante', 'Hielo encantado', 
      'Ventisca de espíritus', 'Frío sobrenatural', 'Nubes heladas', 'Escarcha de runas', 'Tormenta de granizo', 'Niebla gélida densa', 
      'Viento de tundra'
    ]
  },
  arid: {
    conditions: [
      'Despejado y caluroso', 'Calor extremo', 'Vientos arenosos', 'Tormenta de arena', 'Seco y polvoriento', 'Calor abrasador', 
      'Vórtice de polvo', 'Olas de calor mágico', 'Tormenta de cenizas', 'Viento ardiente', 'Espejismo brillante', 'Calma desértica', 
      'Tormenta de arena dorada', 'Calor infernal', 'Viento de especias', 'Brisa seca y polvorienta', 'Tormenta de escorpiones', 
      'Cielo rojizo', 'Calina tóxica'
    ]
  },
  tropical: {
    conditions: [
      'Caluroso y húmedo', 'Lluvias tropicales', 'Tormenta tropical', 'Calor sofocante', 'Niebla densa', 'Chubascos dispersos', 
      'Lluvia de monzón', 'Viento huracanado', 'Niebla encantada', 'Tormenta de relámpagos', 'Humedad mágica', 'Chubasco de flores', 
      'Vapor volcánico', 'Lluvia ácida leve', 'Brisa de selva', 'Tormenta de sirenas', 'Calor opresivo', 'Niebla de jungla', 
      'Chubascos de luz', 'Viento tropical místico'
    ]
  }
};

// =========================================================================
// Sección: Generador de Encuentros
// =========================================================================
// Objeto con tablas de encuentros por tipo de ubicación (urbano, bosque, montaña, mazmorra, camino, costa) y horario.
// Proporciona encuentros aleatorios para enriquecer la narrativa y el combate.

const encounterTables = {
  urbano: {
    day: [
      'Guardia patrullando', 'Mendigo pidiendo limosna', 'Vendedor ambulante', 'Niños jugando', 
      'Mercader de pociones dudosas', 'Bardo callejero cantando', 'Ladrón intentando robar', 'Clérigo ofreciendo bendiciones', 
      'Carroza noble pasando', 'Grupo de aventureros descansando', 'Perro callejero hambriento', 'Herrero forjando armas', 
      'Mensajero apresurado', 'Cultista disfrazado', 'Mercenario buscando trabajo', 'Danza de festivales locales', 
      'Pintor retratando la plaza', 'Niña perdida llorando', 'Caravana de especias exóticas', 'Guardia interrogando a un sospechoso', 
      'Cazador de recompensas rastreando', 'Bufón entreteniendo a la multitud', 'Comerciante de mapas antiguos'
    ],
    night: [
      'Asaltante en callejón', 'Guardia nocturno', 'Amante de los secretos', 'Reunión clandestina', 
      'Vampiro acechando', 'Ladrón escalando muros', 'Espía observando desde las sombras', 'Fantasma de un noble fallecido', 
      'Culto realizando un ritual', 'Guardia corrupto aceptando sobornos', 'Hombre lobo bajo la luna', 'Asesino contratado', 
      'Mercader negro vendiendo objetos robados', 'Prostituta ofreciendo información', 'Niños de la calle robando', 'Bruja lanzando un hechizo', 
      'Guardia patrullando con linterna', 'Duende travieso jugando bromas', 'Carroza abandonada con pistas', 'Lamento de un espíritu perdido', 
      'Mercenario emboscando', 'Fuego misterioso en un callejón'
    ]
  },
  bosque: {
    day: [
      'Ciervo bebiendo agua', 'Arañas gigantes', 'Dryad curiosa', 'Explorador perdido', 
      'Elfo arquero vigilando', 'Oso pardo husmeando', 'Unicornio blanco apareciendo', 'Cazador tendiendo trampas', 
      'Fae danzando en un claro', 'Lobo solitario aullando', 'Dríada protegiendo un árbol', 'Ciervo alado volando', 
      'Explorador herido pidiendo ayuda', 'Enjambre de abejas mágicas', 'Rastros de un troglodita', 'Arpía cantando desde un árbol', 
      'Fuente mágica brillando', 'Cérvido encantado observando', 'Guardabosques patrullando', 'Plantas carnívoras acechando', 
      'Centauro galopando', 'Hada ofreciendo un trato'
    ],
    night: [
      'Lobos cazando', 'Hada traviesa', 'Espíritu del bosque', 'Cazador furtivo', 
      'Ogro durmiendo cerca de un fuego', 'Will-o\'-wisp guiando', 'Trol acechando en la oscuridad', 'Sombra de un druida antiguo', 
      'Pantera espectral rugiendo', 'Enjambre de murciélagos vampíricos', 'Luz de un ritual druídico', 'Cisne negro profético', 
      'Hiena riendo en la distancia', 'Fantasmas de viajeros perdidos', 'Serpiente constrictora gigante', 'Bruja recolectando hierbas', 
      'Luz de un farol goblin', 'Grifo posado en un árbol', 'Eco de un llanto sobrenatural', 'Corcel nocturno galopando', 
      'Árbol animado moviéndose', 'Nido de wyrmling dragón'
    ]
  },
  montana: {
    day: [
      'Águila gigante', 'Cabras montesas', 'Enano explorador', 'Avalancha menor', 
      'Montaraz buscando minerales', 'Grifo planeando', 'Cabra demoníaca pastando', 'Explorador escalando', 
      'Torreón en ruinas visible', 'Oso de las nieves cazando', 'Mercenario buscando un paso', 'Escarabajo gigante rascando', 
      'Cueva con ecos extraños', 'Caravana de enanos mineros', 'Viento mágico susurrando', 'Yeti joven explorando', 
      'Roca rodante peligrosa', 'Águila dorada vigilante', 'Sendero bloqueado por escombros', 'Guardián pétreo inmóvil', 
      'Explorador herido pidiendo ayuda', 'Fuente termal humeante'
    ],
    night: [
      'Yeti merodeador', 'Tempestad de nieve', 'Eco misterioso', 'Luz en la distancia', 
      'Gigante de las colinas durmiendo', 'Lobo de invierno aullando', 'Espíritu de un montañés', 'Cueva iluminada por runas', 
      'Avalancha sobrenatural', 'Ogro de las montañas rugiendo', 'Fuego de campamento goblin', 'Viento helado con voces', 
      'Roca animada moviéndose', 'Luz de un faro mágico', 'Huellas de un dragón antiguo', 'Guardián de piedra activado', 
      'Tormenta eléctrica repentina', 'Eco de un cuerno lejano', 'Sombra de un coloso', 'Caravana perdida congelada', 
      'Luz de un ritual chamánico', 'Nevada cegadora'
    ]
  },
  mazmorra: {
    common: [
      'Goblins patrullando', 'Trampa antigua', 'Restos de anterior explorador', 'Inscripciones en la pared', 
      'Ratas gigantes correteando', 'Cofre oxidado cerrado', 'Esqueleto animado', 'Eco de pasos lejanos', 
      'Hongo luminoso creciendo', 'Puerta sellada con runas', 'Araña tejedora en esquina', 'Pozo profundo y oscuro', 
      'Guardia esquelético vigilante', 'Luz de una antorcha parpadeante', 'Trampa de dardos oculta', 'Cráneo con joya incrustada', 
      'Cadáver reciente con pistas', 'Río subterráneo fluyendo', 'Estatua misteriosa', 'Olor a moho y humedad', 
      'Pasillo colapsado parcialmente', 'Guardia orco dormido'
    ],
    rare: [
      'Dragón durmiendo', 'Artefacto mágico', 'Fantasma atormentado', 'Portal dimensional', 
      'Liches estudiando grimorios', 'Tesoro custodiado por golems', 'Altar demoníaco activo', 'Espejo profético roto', 
      'Guardián elemental invocado', 'Trono de un rey olvidado', 'Cristal de poder pulsante', 'Demonio sellado rugiendo', 
      'Sala de teletransportación', 'Reliquia divina brillando', 'Esqueleto de dragón animado', 'Laberinto mágico infinito', 
      'Guardián de sombras', 'Fuente de juventud seca', 'Cámara de ecos proféticos', 'Trono de un dios menor', 
      'Portal a otro plano', 'Corona maldita brillando'
    ]
  },
  camino: {
    day: [
      'Comerciante con carromato', 'Grupo de peregrinos', 'Guardias reales', 'Bandidos exigiendo peaje', 
      'Caravana de mercaderes', 'Viajero solitario con capa', 'Caballero errante montado', 'Mago buscando componentes', 
      'Carro de suministros roto', 'Explorador con mapa antiguo', 'Grupo de refugiados', 'Mensajero con carta urgente', 
      'Carroza noble escoltada', 'Pastor con ovejas', 'Cazador vendiendo pieles', 'Caravana de esclavos', 
      'Guerrero herido pidiendo ayuda', 'Mercader de armas', 'Grupo de bardos viajeros', 'Patrulla de elfos silvanos', 
      'Comerciante de pociones', 'Carro atrapado en el lodo'
    ],
    night: [
      'Ladrones de caminos', 'Fantasma de viajero', 'Lobos al acecho', 'Fuego de campamento a lo lejos', 
      'Bandidos armando una emboscada', 'Caravana atacada y abandonada', 'Espectro de un caballero', 'Luz de un farol goblin', 
      'Carroza fantasma flotando', 'Ogro bloqueando el camino', 'Viajero perdido con linterna', 'Rastro de sangre fresca', 
      'Fuego de un campamento orco', 'Lamento de un espíritu', 'Grupo de contrabandistas', 'Caballo desbocado corriendo', 
      'Sombras de jinetes oscuros', 'Eco de un cuerno de guerra', 'Caravana saqueada', 'Luz de un ritual pagano', 
      'Rostro en la niebla', 'Carro abandonado con tesoros'
    ]
  },
  costa: {
    day: [
      'Pescadores locales', 'Delfines jugando', 'Barco a lo lejos', 'Restos de naufragio', 
      'Marinero reparando redes', 'Sirena observando desde lejos', 'Comerciante de perlas', 'Barco pirata en el horizonte', 
      'Tortuga marina gigante', 'Explorador cartografiando', 'Pescador atrapado en rocas', 'Ave marina cazando', 
      'Naufragio con cofre visible', 'Guardia costero patrullando', 'Comerciante de sal', 'Barca con remeros', 
      'Faro dañado parpadeando', 'Pescador ofreciendo pescado', 'Rastro de un kraken', 'Marinero cantando canciones', 
      'Caravana de comerciantes marinos', 'Olas con brillo mágico'
    ],
    night: [
      'Contrabandistas', 'Sirenas cantando', 'Tormenta en el mar', 'Faro iluminando', 
      'Fantasma de un marinero', 'Piratas desembarcando', 'Luz de un barco fantasma', 'Kraken emergiendo', 
      'Marinero perdido gritando', 'Tormenta con relámpagos', 'Sirena atrayendo a un barco', 'Fuego de una fogata costera', 
      'Sombras de un naufragio', 'Eco de campanas submarinas', 'Luz de un faro maldito', 'Barco hundido resurgiendo', 
      'Contrabandista herido', 'Olas con murmullos', 'Espectro de un capitán', 'Luz de un ritual marítimo', 
      'Rastro de un leviatán', 'Niebla densa sobrenatural'
    ]
  }
};

// =========================================================================
// Sección: Respuestas de Oráculo Simple
// =========================================================================
// Lista de respuestas binarias o simples para preguntas de sí/no en el oráculo.
// Ideal para decisiones rápidas y directas en la narrativa.

const oracleAnswersSimple = ['Sí', 'No', 'Sí, pero...', 'No, pero...', 'Probablemente sí', 'Probablemente no', 'Tal vez', 'Depende de las circunstancias', 'No lo sé', 'Pregunta de nuevo', 'Es incierto', 'Posiblemente'];

// =========================================================================
// Sección: Respuestas de Oráculo Detalladas
// =========================================================================
// Lista de respuestas más elaboradas para preguntas de sí/no, con matices y contextos.
// Añade profundidad a las decisiones del oráculo, útil para narrativas complejas.

const oracleAnswersDetailed = [
  'Sí, definitivamente', 'Sí', 'Sí, pero con un costo', 'Mayormente sí',
  'Las señales apuntan a que sí', 'Depende de tus acciones', 'Incierto, intenta de nuevo',
  'Mayormente no', 'No', 'No, y además...', 'Definitivamente no', 'Casi seguro que no',
  'Sí, con reservas', 'No, pero hay esperanza', 'Las estrellas dicen sí', 'El destino es favorable',
  'No es el momento', 'Sí, inesperadamente', 'No, definitivamente', 'Tal vez en el futuro',
  'Depende del contexto', 'Las señales son confusas', 'Sí, con consecuencias', 'No, pero aprende de ello'
];

// =========================================================================
// Sección: Respuestas de Oráculo Mythic
// =========================================================================
// Lista de respuestas al estilo Mythic GME, con resultados impredecibles y narrativos.
// Incluye excepciones, caos y modificadores de suerte, alineado con el sistema Mythic.

const oracleAnswersMythic = [
  'Sí, excepcionalmente', 'Sí', 'Sí, pero...', 'No, pero...', 'No', 'No, y además...',
  'Sí, y además...', 'No, excepcionalmente', 'Incierto', 'Caótico', 'La suerte está de tu lado',
  'La suerte está en tu contra', 'Depende de tus acciones', 'El destino tiene otros planes',
  'Sí, con un giro', 'No, pero hay una oportunidad', 'El caos interviene', 'La fortuna sonríe',
  'El azar decide', 'Sí, contra todo pronóstico', 'No, y el caos reina', 'Incierto y peligroso',
  'Depende del caos', 'El destino se ríe', 'Sí, pero el caos cambia todo', 'No, excepcionalmente malo'
];

// =========================================================================
// Sección: Consecuencias
// =========================================================================
// Lista de posibles consecuencias tras una respuesta del oráculo.
// Añade efectos narrativos o mecánicos, desde recompensas hasta cambios de escena.

const consequences = [
  'Consecuencia positiva menor', 'Consecuencia positiva mayor',
  'Consecuencia negativa menor', 'Consecuencia negativa mayor',
  'Consecuencia neutral', 'Cambio de escena', 'Personaje inesperado aparece',
  'Objeto importante encontrado', 'Revelación de información', 'Cambio de ambiente',
  'Aliado temporal se une', 'Enemigo nuevo surge', 'Recurso perdido', 'Habilidad mejorada',
  'Maldición temporal', 'Bendición inesperada', 'Información falsa revelada', 'Evento aleatorio ocurre',
  'Cambio en motivaciones', 'Descubrimiento oculto', 'Pérdida de tiempo', 'Ganancia de conocimiento'
];

// =========================================================================
// Sección: Cambios de Escena
// =========================================================================
// Objeto con categorías (Narrativo, Entorno, Conflicto, Evento Especial) y 30 elementos cada una.
// Proporciona transiciones narrativas, ambientaciones y eventos para guiar la historia.

const sceneChanges = {
  Narrativo: [
    'tranquilo al amanecer', 'acción frenética', 'misterio oculto', 'social animado', 
    'melancólico tras la batalla', 'épico con héroes', 'sombrío en la noche', 'esperanzador al alba', 
    'nostalgia de tiempos pasados', 'tensión silenciosa en la espera', 'alegría festiva en la plaza', 'tristeza profunda por la pérdida', 
    'reverencia ante un altar', 'caos emocional en el caos', 'paz espiritual en meditación', 'furia desatada de un enemigo', 
    'reflexión solitaria en las estrellas', 'euforia colectiva tras la victoria', 'desesperación ante el fracaso', 'redención por un acto noble', 
    'intriga política en la corte', 'humor ligero entre compañeros', 'terror psicológico por visiones', 'unión familiar en el exilio', 
    'sacrificio heroico por otros', 'duda existencial en la duda', 'celebración victoriosa con tambores', 'luto por un caído', 
    'esperanza frágil en la oscuridad', 'ambición desmedida por el poder'
  ],
  Entorno: [
    'exploración en tierras desconocidas', 'combate en campo abierto', 'descanso junto al fuego', 'viaje por senderos polvorientos', 
    'ruinas antiguas cubiertas de musgo', 'bosque encantado con luces', 'montaña helada con ventiscas', 'mazmorra oscura con ecos', 
    'pueblo desierto bajo cenizas', 'templo profanado con runas', 'pantano brumoso con niebla', 'cueva subterránea con gemas', 
    'costa tormentosa con olas', 'castillo en ruinas con fantasmas', 'selva densa con enredaderas', 'glaciar resquebrajado con grietas', 
    'llanura abierta bajo el sol', 'torre mágica con portales', 'cañón profundo con sombras', 'oasis perdido con espejismos', 
    'ciudad flotante entre nubes', 'cripta sellada con cadenas', 'río caudaloso con corrientes', 'planicie ardiente con lava', 
    'bosque petrificado con estatuas', 'isla desierta con naufragios', 'abismo infinito con bruma', 'valle oculto con niebla', 
    'fortaleza voladora con guardias', 'tundra helada con nieve'
  ],
  Conflicto: [
    'traición entre aliados', 'emboscada en el camino', 'negociación tensa con enemigos', 'ritual interrumpido por intrusos', 
    'huida desesperada de un peligro', 'duelo honorable con espadas', 'caos mágico por hechizo fallido', 'invasión de criaturas', 
    'rebelión contra un tirano', 'enfrentamiento tribal por tierras', 'sabotaje en la noche', 'juicio injusto ante un rey', 
    'asedio a una ciudad', 'venganza personal por traición', 'traición doble en el consejo', 'captura por bandidos', 
    'liberación forzada de prisioneros', 'conspiración en las sombras', 'batalla naval con tormentas', 'exorcismo de un espíritu', 
    'robo fallido en un templo', 'revuelta popular en las calles', 'desafío mágico entre magos', 'tregua rota por engaño', 
    'persecución aérea con grifos', 'interrogatorio brutal en mazmorra', 'defensa heroica de un puente', 'traición interna en el grupo', 
    'ataque sorpresa al amanecer', 'guerra civil entre clanes'
  ],
  'Evento Especial': [
    'profecía revelada por un vidente', 'tormenta sobrenatural con relámpagos', 'portal activado a otro plano', 'aparición divina con luz', 
    'eclipse extraño cubriendo el sol', 'tesoro maldito brillando', 'pacto demoníaco sellado', 'resurrección de un héroe', 
    'cometa profético cruzando el cielo', 'invasión planar de demonios', 'visión mística en un sueño', 'cataclismo con terremotos', 
    'bendición celestial con auras', 'maldición ancestral en un objeto', 'ritual de sangre en un altar', 'ascenso divino de un mortal', 
    'portal fallido explotando', 'aurora mágica en el horizonte', 'sacrificio voluntario por paz', 'señal profana en el aire', 
    'erupción volcánica con lava', 'lluvia de estrellas fugaces', 'avatar aparecido con poder', 'pacto roto con un ente', 
    'portal dimensional abierto', 'eco del pasado en visiones', 'juicio divino con truenos', 'despertar antiguo de una bestia', 
    'tormenta planar con portales', 'reliquia descubierta en ruinas'
  ]
};

// (Eliminado) socialEncounters y explorationEncounters se integran en encounterTables

// =========================================================================
// Sección: Eventos Ambientales
// =========================================================================
// Lista de eventos climáticos o naturales que afectan la escena.
// Añade desafíos o belleza al entorno, vinculado con weatherSystems.

const environmentEvents = [
  'Tormenta repentina', 'Niebla espesa', 'Amanecer especialmente bello', 'Lluvia de meteoritos', 
  'Tormenta eléctrica', 'Vientos fuertes', 'Nevada intensa', 'Ventisca', 'Tormenta de arena', 'Calor abrasador', 
  'Lluvias tropicales', 'Tormenta tropical', 'Llovizna mágica', 'Aurora boreal', 'Tormenta de cenizas leves', 
  'Niebla helada', 'Vórtice de polvo', 'Lluvia ácida leve', 'Tormenta de relámpagos', 'Niebla densa sobrenatural'
];


// (Eliminado) enemies: usar monsters.json para encuentros por CR


// =========================================================================
// Sección: Razas de PNJs
// =========================================================================
// Lista de razas disponibles para personajes no jugables (PNJs) en la campaña.
// Basada en el Player's Handbook 5e, sirve para generar variedad cultural y mecánica.

const npcRaces = [
  'Humano', 'Elfo Alto', 'Elfo del Bosque', 'Elfo Oscuro', 'Enano de las Colinas', 'Enano de la Montaña', 
  'Mediano Leal', 'Mediano Pie ligero', 'Mediano Robusto', 'Tiefling', 'Dragonborn', 'Gnomo de la Roca', 
  'Gnomo del Bosque', 'Elfo Marino', 'Enano Duergar', 'Mediano Pelirrojo', 'Tiefling Asmodeus'
];

// =========================================================================
// Sección: Clases de PNJs
// =========================================================================
// Lista de clases y arquetipos para PNJs, basada en el Player's Handbook 5e.
// Define roles y habilidades, útil para crear enemigos, aliados o encuentros.

const npcClasses = [
  'Guerrero', 'Mago', 'Clérigo', 'Pícaro', 'Bárbaro', 'Bardo', 'Explorador', 
  'Paladín', 'Druida', 'Monje', 'Hechicero', 'Brujo', 'Alquimista', 'Cazador de Demonios', 
  'Caballero Negro', 'Artificiero', 'Samurái', 'Guardabosques', 'Invocador', 'Nigromante', 
  'Gladiador', 'Mercenario', 'Sacerdote de Guerra', 'Maestro de Bestias', 'Espadachín', 'Ilusionista'
];

// =========================================================================
// Sección: Rasgos de PNJs
// =========================================================================
// Lista de rasgos de personalidad para PNJs.
// Añade profundidad a los personajes generados con npcRaces y npcClasses.

const npcTraits = [
  'Amigable', 'Desconfiado', 'Nervioso', 'Valiente', 'Sabio', 'Hábil', 'Astuto', 'Honorable', 
  'Arrogante', 'Tímido', 'Leal', 'Traicionero', 'Cínico', 'Optimista', 'Sarcástico', 'Misterioso', 
  'Compasivo', 'Avaricioso', 'Fanático', 'Melancólico', 'Intrépido', 'Curioso', 'Sutil', 'Salvaje', 
  'Piadoso', 'Engreído', 'Reservado', 'Egoísta', 'Generoso', 'Enigmático'
];

// =========================================================================
// Sección: Objetivos de PNJs
// =========================================================================
// Lista de posibles objetivos o motivaciones para PNJs.
// Enriquecen las interacciones y dan propósito a los personajes generados.

const npcGoals = [
  'Busca ayuda', 'Ofrece información', 'Intenta engañar', 'Necesita protección', 'Tiene una misión', 'Esconde un secreto', 
  'Busca venganza', 'Ofrece un trato', 'Necesita un guía', 'Quiere un artefacto', 'Planea un robo', 'Busca redención', 
  'Ofrece una profecía', 'Necesita curación', 'Intenta reclutar', 'Guarda un tesoro', 'Quiere traicionar a alguien', 'Busca un aliado', 
  'Ofrece un ritual', 'Necesita escapar', 'Intenta advertir', 'Tiene un mapa valioso', 'Busca un duelo', 'Planea una emboscada'
];

// =========================================================================
// Sección: Tipos de Habitaciones
// =========================================================================
// Lista de tipos de habitaciones para mazmorras o interiores.
// Útil para generar mapas o describir áreas en encuentros de exploración.

const roomTypes = [
  'Cámara', 'Sala del trono', 'Vestíbulo', 'Almacén', 'Biblioteca', 'Capilla',
  'Sala de guardias', 'Cámara de tortura', 'Cueva', 'Cripta', 'Forja', 'Sala de té',
  'Invernadero', 'Observatorio', 'Sala de rituales', 'Santuario', 'Cámara secreta',
  'Laboratorio', 'Cuartel', 'Prisión', 'Salón de banquetes', 'Torre', 'Patio interior',
  'Sala de tesoros', 'Galería'
];

// =========================================================================
// Sección: Características de Habitaciones
// =========================================================================
// Lista de características o detalles para habitaciones.
// Añade ambiente y desafíos a las áreas generadas con roomTypes.

const roomFeatures = [
  'pozo central', 'foso', 'altar', 'trampa de presión', 'mural antiguo', 'estatua',
  'puerta sellada', 'escalera descendente', 'tesoro escondido', 'rastro de sangre',
  'alfombra lujosa', 'cristales incrustados', 'runas brillantes', 'lago subterráneo',
  'puente colgante', 'ruinas desmoronadas', 'maquinaria antigua', 'espejo mágico',
  'estanterías polvorientas', 'foco de energía', 'mobiliario arcaico', 'nube venenosa',
  'portal débil', 'pozo sin fondo'
];

// =========================================================================
// Sección: Trampas
// =========================================================================
// Lista de trampas para mazmorras u otros entornos peligrosos.
// Añade desafíos mecánicos y narrativos a las áreas exploradas.

const traps = [
  'losa que cae a presión', 'flechas disparadas desde la pared', 'pozo con estacas',
  'gas soporífero liberado', 'trampa de fuego súbita', 'chorro de ácido',
  'suelo colapsable', 'cadenas que atrapan', 'llamas saltarinas ocultas',
  'alud de escombros', 'estatuas que disparan dardos', 'manchas venenosas',
  'trampilla camuflada', 'lanzas emergentes', 'alfombra explosiva (runas)',
  'picos retráctiles', 'cilindro giratorio que aplasta', 'brazo mecánico',
  'truco de ilusión que confunde', 'trampa sonora que atrae bestias',
  'portal mini-teletransporte (desorientador)', 'trampa de congelación',
  'trampa eléctrica', 'muro aplastante'
];

// =========================================================================
// Sección: Puzles
// =========================================================================
// Lista de puzles para mazmorras u otros entornos de exploración.
// Ofrece desafíos intelectuales que los jugadores pueden resolver.

const puzzles = [
  'alfombra con botones secuenciales', 'rompecabezas de espejo', 'palancas de peso',
  'código de runas que hay que traducir', 'laberinto móvil', 'engranajes que giran',
  'piedras con inscripciones que hay que alinear', 'combinación de vasos',
  'acertijo del guardián', 'llave dividida en tres partes', 'puzzle musical',
  'puzzle de luz y sombras', 'anillos giratorios con símbolos', 'rutas de color',
  'puzle de presión por pasos', 'cilindros alineados', 'puzle de memoria visual',
  'mosaico que cambia con peso', 'puzle temporal (secuencias)', 'enigmas en verso',
  'balanza donde falta una pieza', 'ruedas con símbolos', 'torres que ordenar',
  'secuencia de botones ocultos'
];

// =========================================================================
// Sección: Lista de Ítems
// =========================================================================
// Objeto con ítems organizados por rareza (común, poco común, raro) y categorías (armas, armaduras, consumibles, tesoros).
// Basado en D&D 5e, sirve para generar botín o recompensas en la campaña.

const itemList = {
    'común': {
        'armas': ['Daga', 'Daga con runas', 'Espada corta', 'Hacha de mano', 'Lanza', 'Maza', 'Garrote', 'Ballesta ligera'],
        'armaduras': ['Cuero tachonado', 'Armadura de cuero', 'Escudo de madera', 'Cota de anillas ligera'],
        'consumibles': ['Poción de curación menor', 'Ración de viaje', 'Antorchas', 'Pergamino ilegible', 'Cuerda de 15 metros', 'Yesca y acero'],
        'tesoros': ['5-20 monedas de cobre', 'Bolsa con monedas extrañas', 'Amuleto roto', 'Anillo de cobre', 'Dije de madera']
    },
    'poco común': {
        'armas': ['Espada larga +1', 'Arco corto +1', 'Martillo de guerra', 'Daga con runas brillante', 'Tridente ceremonial', 'Hacha de doble filo'],
        'armaduras': ['Coraza ligera', 'Armadura de cuero +1', 'Escudo reforzado', 'Cota de mallas parcial'],
        'consumibles': ['Poción de curación', 'Pergamino de conjuro (Nivel 1)', 'Aceite alquímico', 'Diario con páginas arrancadas', 'Polvo cegador'],
        'tesoros': ['50-200 monedas de plata', 'Gema tallada (valor 50po)', 'Collar de plata', 'Broche con esmeralda pequeña']
    },
    'raro': {
        'armas': ['Espada flamígera', 'Arco de los bosques +1', 'Hacha vorpal (versión debilitada)', 'Varita de misiles mágicos', 'Maza de truenos', 'Daga de veneno'],
        'armaduras': ['Armadura completa +1', 'Manto de protección', 'Escudo de la fe', 'Coraza encantada'],
        'consumibles': ['Poción de curación superior', 'Pergamino de conjuro (Nivel 3)', 'Poción de invisibilidad', 'Elixir de fuerza', 'Pergamino: Identificar'],
        'tesoros': ['500+ monedas de oro', 'Gema de alma menor', 'Corona antigua', 'Mapa hacia un tesoro oculto', 'Anillo de poder debilitado']
    }
};

// =========================================================================
// Sección: Progreso de Metas
// =========================================================================
// Sistema generativo para simular el progreso o retroceso hacia una meta, inspirado en Mythic GME.
// Incluye tablas dinámicas (Actions, Subjects, Circumstances, Themes, Intensity) para combinaciones infinitas.


const goalProgress = {
  Actions: [
    'Avance', 'Progreso', 'Obstáculo', 'Barrera', 'Retroceso', 'Pérdida', 'Estancamiento', 'Pausa', 
    'Triunfo', 'Derrota', 'Ascenso', 'Caída', 'Impulso', 'Resistencia', 'Revelación', 
    'Exploración', 'Conquista', 'Fracaso', 'Salvación', 'Perdición', 'Renacimiento', 'Colapso', 
    'Descubrimiento', 'Bloqueo', 'Auge', 'Declive', 'Redención', 'Castigo', 'Alerta', 'Amenaza', 
    'Reunión', 'Separación', 'Fortalecimiento', 'Debilidad', 'Transformación'
  ],
  Subjects: [
    'con aliados leales', 'por un oráculo anciano', 'con un dragón guardián', 'tras un clérigo sanador', 
    'por un espíritu benevolente', 'esquivando kobolds', 'con un mapa estelar', 'por un mago traicionero', 
    'con un ejército goblin', 'ante un rey tirano', 'tras un caballero rival', 'con un elfo errante', 
    'por un portal mágico', 'con una visión profética', 'junto a tambores de guerra', 'por un río embravecido', 
    'con un wyvern furioso', 'por una maldición ancestral', 'ante una horda de zombis', 'en ruinas encantadas', 
    'por un elemental del fuego', 'con un ladrón astuto', 'en un laberinto viviente', 'ante un lich poderoso', 
    'por un veneno sutil', 'en un templo profanado', 'por un enigma antiguo', 'por una tormenta planar', 
    'ante un abismo insondable', 'por un noble corrupto'
  ],
  Circumstances: [
    'bajo la luz de la luna', 'en un combate feroz', 'tras un hechizo fallido', 'durante una tregua', 
    'con un viento divino', 'en una noche oscura', 'tras una emboscada', 'durante un ritual', 
    'bajo un eclipse extraño', 'en un desierto ardiente', 'tras una victoria épica', 'durante una persecución', 
    'con un trueno resonante', 'en una selva densa', 'tras un sacrificio', 'durante un banquete', 
    'bajo una maldición', 'en un campo de batalla', 'tras un sueño místico', 'durante una tormenta', 
    'con un amanecer glorioso', 'en una mazmorra fría', 'tras un robo', 'durante un juicio', 
    'bajo un cielo tormentoso', 'en un pueblo en llamas', 'tras una traición', 'durante un éxodo'
  ],
  Themes: [
    'de magia arcana', 'de naturaleza salvaje', 'de guerra épica', 'de intriga política', 
    'de fe divina', 'de traición oculta', 'de exploración mística', 'de venganza personal', 
    'de poder ancestral', 'de caos elemental', 'de alianza frágil', 'de destino profético', 
    'de horror sobrenatural', 'de redención heroica', 'de ambición desmedida', 'de lucha tribal', 
    'de misterio antiguo', 'de sacrificio noble', 'de corrupción demoníaca', 'de renacimiento espiritual'
  ],
  Intensity: [
    'con impacto leve', 'con efecto moderado', 'con fuerza notable', 'con intensidad extrema', 'con consecuencias catastróficas'
  ],
};  

// =========================================================================
// Sección: Rumores
// =========================================================================
// Tablas de generación de rumores y fiabilidad.

const rumorTypes = [
  'Historia olvidada', 'Secretos personales', 'Evento pasado',
  'Debilidad oculta', 'Relación secreta', 'Orígenes misteriosos',
  'Tesoro escondido', 'Maldición ancestral', 'Alianza oculta', 'Traición inminente',
  'Profecía olvidada', 'Criatura legendaria', 'Artefacto perdido', 'Conspiración política',
  'Poder sobrenatural', 'Evento futuro'
];

const rumorSources = [
  'Un borracho en la taberna murmuró que', 'Un anciano cuenta que',
  'Un mercader extranjero comenta que', 'Un niño jugando dice que',
  'Un guardia ebrio confesó que', 'Un sacerdote rezando menciona que',
  'Un mapa antiguo sugiere que', 'Una inscripción desgastada indica que',
  'Un espía susurra que', 'Un viajero herido revela que', 'Un libro prohibido menciona que',
  'Un fantasma en la noche dice que', 'Un oráculo predice que', 'Un animal parlante afirma que',
  'Un sueño profético muestra que', 'Un mensaje en una botella indica que'
];

const rumorSubjects = [
  'el noble Lord Valerius', 'la Hermandad de la Serpiente',
  'el mago Arcanus', 'el dragón ancestral', 'el templo olvidado',
  'la reina desaparecida', 'el capitán de la guardia', 'el bosque encantado',
  'el ladrón fantasma', 'la bruja del pantano', 'el caballero caído',
  'el mercader rico', 'la ciudad sumergida', 'el dios olvidado',
  'el ejército invasor', 'la profecía antigua', 'el tesoro maldito'
];

const rumorActions = [
  'tiene una debilidad por', 'oculta el secreto de',
  'está conectado con', 'tiene miedo de',
  'traicionó a', 'robó', 'protege', 'escapó de',
  'busca venganza contra', 'adora en secreto', 'planea destruir',
  'guarda un poder de', 'fue maldecido por', 'descendió de',
  'invocó a', 'fue poseído por', 'lidera un culto a'
];

const rumorObjects = [
  'un amor prohibido', 'un artefacto maldito', 'su verdadero origen',
  'un crimen no resuelto', 'una puerta dimensional', 'un poder ancestral',
  'una profecía olvidada', 'un familiar perdido',
  'un tesoro enterrado', 'una criatura mitológica', 'un ritual prohibido',
  'un ejército fantasma', 'un dios caído', 'una llave antigua',
  'un veneno letal', 'un espejo mágico', 'un libro de hechizos'
];

const rumorReliability = [
  { text: 'Fuente confiable', class: 'reliable' },
  { text: 'Posiblemente cierto', class: 'reliable' },
  { text: 'Origen dudoso', class: 'unreliable' },
  { text: 'Probable exageración', class: 'unreliable' },
  { text: 'Posiblemente falso', class: 'unreliable' },
  { text: 'Completamente inventado', class: 'unreliable' },
  { text: 'Basado en hechos reales', class: 'reliable' },
  { text: 'Mezcla de verdad y mentira', class: 'unreliable' },
  { text: 'Confirmado por testigos', class: 'reliable' },
  { text: 'Susurro de un loco', class: 'unreliable' }
];

// =========================================================================
// Sección: Narrativa (Interpretación y Eventos)
// =========================================================================

const narrativeMeaningTables = {
  action: [
    'Abandonar', 'Acompañar', 'Adquirir', 'Avanzar', 'Cambiar',
    'Capturar', 'Confrontar', 'Controlar', 'Crear', 'Defender',
    'Destruir', 'Descubrir', 'Engañar', 'Escapar', 'Explorar',
    'Enfrentar', 'Forjar', 'Encontrar', 'Ocultar', 'Influir'
  ],
  subject: [
    'Objetivos', 'Conocimiento', 'Peligro', 'Oportunidad', 'Aliados',
    'Enemigos', 'Recursos', 'Secretos', 'Obstáculos', 'Tesoro',
    'Información', 'Poder', 'Transporte', 'Armas', 'Protección',
    'Magia', 'Tecnología', 'Territorio', 'Salud', 'Tiempo'
  ]
};

const narrativeRandomEvents = {
  enfocado: [
    'NPC positivo aparece', 'NPC negativo aparece', 'Evento neutral ocurre',
    'Objeto importante encontrado', 'Revelación sobre un hilo actual',
    'Cambio en relación de facciones', 'Descubrimiento de ubicación',
    'Personaje muestra nueva habilidad', 'Se revela motivación oculta',
    'Surge dilema moral'
  ],
  inexperado: [
    'Desastre natural ocurre', 'Intervención divina/mágica',
    'Revelación impactante cambia todo', 'Traición inesperada',
    'Aliado inesperado aparece', 'Cambio drástico de ambiente',
    'Enemigo revela intención oculta', 'Pérdida importante',
    'Golpe de suerte extraordinario', 'Evento cataclísmico comienza'
  ],
  remoto: [
    'Noticias de lugar lejano', 'Mensaje urgente recibido',
    'Profecía o visión revelada', 'Sueño premonitorio',
    'Cambio en equilibrio de poder distante', 'Evento histórico ocurre elsewhere',
    'Personaje ausente se comunica', 'Crisis en ubicación lejana',
    'Recurso inesperado disponible', 'Tema de rumor resulta ser verdad'
  ]
};

// =========================================================================
// Sección: Combate (Tácticas y Acciones)
// =========================================================================

const combatTacticsPool = [
  'Enfocar fuego', 'Flanquear', 'Disparar desde lejos', 'Cargar', 'Retirarse y reagrupar',
  'Interrumpir', 'Protege al lanzador', 'Curar aliado', 'Preparar acción', 'Emboscar',
  'Sacrificio', 'Distracción', 'Lanzar área', 'Usar objeto', 'Snipe (frágil)',
  'Provocar', 'Caza al más cercano', 'Romper formación', 'Aprovechar terreno', 'Huir y reagruparse'
];

const combatActions = [
  'Ataca y acierta', 'Ataca y falla', 'Ataca con crítico',
  'Usa habilidad', 'Se mueve', 'Usa objeto',
  'Prepara acción', 'Rinde', 'Huye',
  'Defiende', 'Contraataca', 'Lanza hechizo', 'Usa terreno',
  'Ayuda a aliado', 'Provoca', 'Intimida', 'Se esconde',
  'Carga', 'Retrocede', 'Usa táctica especial'
];

// =========================================================================
// Sección: Botín (Tablas por rareza)
// =========================================================================

const lootTables = {
  common: ['Poción de curación menor (2d4+2, 50 po)', '50 piezas de oro', 'Arma común de buena factura (10–20 po)', 'Armadura de cuero reforzado (10 po)', 'Pergamino de truco (25 po)', 'Gema semipreciosa (10 po)', 'Kit de herramientas especializado', 'Ropa elegante (15 po)', 'Mapa viejo con pista', 'Bolsa de gemas pequeñas (20 po)', 'Pergamino con runa menor', 'Arco corto común (25 po)', 'Espada corta grabada (20 po)', 'Escudo de madera reforzada (10 po)', 'Anillo simple de plata (5 po)', 'Túnica con protección menor', 'Poción de resistencia menor (25 po)', 'Antorcha encantada (10 po)', 'Amuleto de la suerte (ventaja 1 tirada menor)', 'Pergamino de ilusión menor (25 po)', 'Set de explorador', 'Joya tallada (10 po)', 'Instrumento musical sencillo (15 po)', 'Collar ritual de aldea (15 po)', 'Piedra mágica que brilla débilmente'],
  uncommon: ['Poción de gran curación (4d4+4, 150 po)', '200 piezas de oro', 'Arma +1 (500 po)', 'Armadura de mithril ligera (400 po)', 'Pergamino de hechizo de nivel 1 (75 po)', 'Gema (50 po)', 'Botas élficas (250 po)', 'Capa de protección +1 (300 po)', 'Anillo de salto (200 po)', 'Guantes de destreza (250 po)', 'Poción de invisibilidad menor (180 po)', 'Varita de proyectil mágico (400 po)', 'Bolsa de contención pequeña (250 po)', 'Tomo de conocimiento (200 po)', 'Escudo +1 (250 po)', 'Casco con visión en la oscuridad (200 po)', 'Arma élfica decorada (500 po)', 'Pergamino curativo nivel 2 (150 po)', 'Gema fina (100 po)', 'Anillo que brilla en la oscuridad (50 po)', 'Capa de camuflaje menor (200 po)', 'Instrumento musical encantado (150 po)', 'Set de gemas variadas (250 po)', 'Poción de escalada (75 po)', 'Amuleto que repele insectos (50 po)'],
  rare: ['Poción de curación superior (8d4+8, 500 po)', '500 piezas de oro', 'Arma +2 (2000 po)', 'Armadura de placas +1 (1500 po)', 'Pergamino de hechizo de nivel 2 (250 po)', 'Gema preciosa (500 po)', 'Varita de fuego (2500 po)', 'Anillo de protección +1 (2000 po)', 'Botas de velocidad (2500 po)', 'Arco largo compuesto +2 (2000 po)', 'Casco de visión verdadera (3000 po)', 'Amuleto de salud (2500 po)', 'Pergamino de hechizo de nivel 3 (350 po)', 'Poción de resistencia elemental (300 po)', 'Espada larga rúnica +2 (2000 po)', 'Capa de invisibilidad breve (2500 po)', 'Escudo +2 ornamentado (2000 po)', 'Instrumento inspirador (1000 po)', 'Varita de relámpago (2500 po)', 'Anillo de teletransporte corto (3000 po)', 'Tomo de saber arcano (3500 po)', 'Set de gemas exóticas (2000 po)', 'Báculo menor (2500 po)', 'Arma baneada +2 (2500 po)', 'Caja mágica de comunicación (1000 po)'],
  'very-rare': ['Poción de curación suprema (10d4+20, 5000 po)', '1000 piezas de oro', 'Arma +3 (15000 po)', 'Armadura mágica +2 (12000 po)', 'Pergamino de hechizo de nivel 4 (1000 po)', 'Gema de 500 po', 'Varita de metamagia (15000 po)', 'Capa de invisibilidad (20000 po)', 'Anillo de regeneración (15000 po)', 'Espada legendaria menor (15000 po)', 'Báculo de poder medio (18000 po)', 'Armadura de escamas de dragón (20000 po)', 'Cuerno elemental (12000 po)', 'Casco de visión omnidireccional (10000 po)', 'Pergamino de control mental (5000 po)', 'Anillo de resistencia doble (15000 po)', 'Escudo antimagia (15000 po)', 'Guantes de hechicería (8000 po)', 'Tomo de sabiduría +2 (12000 po)', 'Arma baneada +3 (18000 po)', 'Cetro de mando (20000 po)', 'Instrumento mágico poderoso (10000 po)', 'Amuleto de viaje planar limitado (15000 po)', 'Báculo de rayos múltiples (18000 po)', 'Set de gemas raras (5000 po)'],
  legendary: ['Poción de vitalidad (10000 po)', '5000 piezas de oro', 'Arma legendaria (25000+ po)', 'Armadura legendaria (25000+ po)', 'Pergamino de hechizo de nivel 5–9 (5000+ po)', 'Gema de 1000 po', 'Cetro del destino (artefacto)', 'Anillo de los tres deseos (artefacto)', 'Casco de los ancestros (artefacto)', 'Armadura de dragón mayor (artefacto)', 'Varita de tormenta eterna (artefacto)', 'Pergamino de resurrección verdadera (artefacto)', 'Capa de invisibilidad y vuelo (artefacto)', 'Escudo que refleja conjuros (artefacto)', 'Anillo de cambio de forma total (artefacto)', 'Báculo de control absoluto (artefacto)', 'Pergamino de invocación épica (artefacto)', 'Gema de dragón ancestral (artefacto)', 'Instrumento legendario de bardos (artefacto)', 'Orbe de anulación mágica (artefacto)', 'Corona de mando mundial (artefacto)', 'Cetro de las estrellas (artefacto)', 'Libro de los planos infinitos (artefacto)', 'Lágrima de un dios (artefacto)', 'Reliquia única ligada a la campaña']
};
// =========================================================================
// Función Logger Centralizada
// =========================================================================
// Registra módulo, función, timestamp y resultado para debugging.
// Ahora también almacena logs en array global y actualiza UI.

let logHistory = []; // Array global para almacenar logs

function logger(module, functionName, result, params = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp: timestamp,
        module: module,
        functionName: functionName,
        result: result,
        params: params
    };

    // Agregar al array
    logHistory.push(logEntry);

    // Mantener solo los últimos 100 logs para no sobrecargar memoria
    if (logHistory.length > 100) {
        logHistory.shift();
    }

    // Log a consola
    console.log(`[${timestamp}] [${module}] ${functionName}: ${result}`);

    // Actualizar UI si existe
    updateLogPanel(logEntry);
}

function updateLogPanel(logEntry) {
    const logPanel = document.getElementById('log-panel-content');
    if (logPanel) {
        const logLine = document.createElement('div');
        logLine.className = 'log-entry';
        logLine.innerHTML = `<span class="log-timestamp">[${logEntry.timestamp}]</span> <span class="log-module">[${logEntry.module}]</span> <span class="log-function">${logEntry.functionName}:</span> <span class="log-result">${logEntry.result}</span>`;
        if (logEntry.params) {
            logLine.innerHTML += ` <span class="log-params">(params: ${JSON.stringify(logEntry.params)})</span>`;
        }
        logPanel.appendChild(logLine);
        logPanel.scrollTop = logPanel.scrollHeight; // Auto-scroll al final
    }
}