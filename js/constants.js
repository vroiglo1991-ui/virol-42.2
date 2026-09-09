/**
 * BIOFLOW - VALENCIA 42K PRO
 * constants.js - Constantes y Datos por Defecto
 */

// 1. BASE DE ENTRENAMIENTOS POR DEFECTO
const DEFAULT_WORKOUTS = {
  1: { // LUNES
    name: "LUNES",
    discipline: "GYM // PULL",
    typeBadge: "GIMNASIO • TREN SUPERIOR",
    title: "TRACCIÓN & ESPALDA DE HIERRO",
    intensity: "RPE 8 • FUERZA PURA",
    meta: "ENFOQUE: DORSALES, BÍCEPS & CORE (PIERNAS 100% FRESCAS)",
    isRest: false,
    km: 0,
    steps: [
      { name: "Dominadas pronadas o Jalón al pecho", reps: "4 series x 8-10 reps (pesado, parada 1s abajo)" },
      { name: "Remo con barra o mancuerna pesada", reps: "4 series x 8-10 reps (foco dorsal ancho)" },
      { name: "Pájaros / Deltoides posterior en polea", reps: "3 series x 12 reps (postura de carrera)" },
      { name: "Curl de bíceps con barra Z o mancuernas", reps: "3 series x 10 reps" },
      { name: "Rueda abdominal o Planchas dinámicas", reps: "3 series x 15 reps (estabilidad pélvica)" }
    ]
  },
  2: { // MARTES
    name: "MARTES",
    discipline: "RUN // 12 KM Z2",
    typeBadge: "RUNNING • AERÓBICO PURO",
    title: "12 KM RODAJE ZONA 2 CONTINUO",
    intensity: "ZONA 2 • RITMO CONVERSACIONAL",
    meta: "ENFOQUE: CONSTRUIR MITOCONDRIAS & EFICIENCIA METABÓLICA",
    isRest: false,
    km: 12,
    steps: [
      { name: "Rodaje continuo a ritmo cómodo (Zona 2)", reps: "12 km continuos donde puedas mantener una conversación" },
      { name: "Hidratación en ruta", reps: "500 ml de agua o sales si hace calor" },
      { name: "Técnica de carrera (al terminar)", reps: "Skipping bajo + zarpazos + talón al glúteo (5 min)" },
      { name: "Estiramientos suaves & movilidad de cadera", reps: "5 min para soltar fascia y sóleos" }
    ]
  },
  3: { // MIÉRCOLES
    name: "MIÉRCOLES",
    discipline: "GYM // PUSH",
    typeBadge: "GIMNASIO • EMPUJE",
    title: "EMPUJE, PECTORAL & HOMBROS",
    intensity: "RPE 8 • MASA MUSCULAR",
    meta: "ENFOQUE: PECHO, HOMBRO & TRÍCEPS (CERO IMPACTO EN PIERNAS)",
    isRest: false,
    km: 0,
    steps: [
      { name: "Press banca plano con barra o mancuernas", reps: "4 series x 8 reps (control de bajada en 2s)" },
      { name: "Press militar con mancuernas o barra", reps: "3 series x 8 reps (estabilidad escapular)" },
      { name: "Aperturas o cruces de poleas", reps: "3 series x 12 reps (congestión)" },
      { name: "Fondos en paralelas o tríceps polea", reps: "4 series x 10 reps (brazo potente)" },
      { name: "Plancha frontal isométrica", reps: "3 series de 60 segundos con glúteos apretados" }
    ]
  },
  4: { // JUEVES
    name: "JUEVES",
    discipline: "RUN // 12 KM CALIDAD",
    typeBadge: "RUNNING • RITMO COMPETICIÓN",
    title: "12 KM CALIDAD / RITMO MEDIA MARATÓN",
    intensity: "ZONA 3 - ZONA 4 • ALTA EXIGENCIA",
    meta: "ENFOQUE: RESISTENCIA AL LACTATO & VELOCIDAD CRUCERO",
    isRest: false,
    km: 12,
    steps: [
      { name: "Calentamiento aeróbico progresivo", reps: "2.0 km muy suaves + 4 progresiones de 80m" },
      { name: "Bloque de ritmo Media Maratón", reps: "8.0 km continuos a tu ritmo objetivo de 21K" },
      { name: "Vuelta a la calma / Enfriamiento", reps: "2.0 km trote muy suave regenerativo" }
    ]
  },
  5: { // VIERNES
    name: "VIERNES",
    discipline: "GYM // LEGS CORREDOR",
    typeBadge: "GIMNASIO • FUERZA CORREDORA",
    title: "PIERNA FUNCIONAL & PREVENCIÓN",
    intensity: "RPE 7-8 • SIN FALLO EXTREMO",
    meta: "ENFOQUE: ARMAR CUÁDRICEPS, SÓLEOS Y GLÚTEO MEDIO PARA VALENCIA",
    isRest: false,
    km: 0,
    steps: [
      { name: "Sentadilla búlgara con mancuernas", reps: "3 series x 8 reps por pierna (fuerza unilateral)" },
      { name: "Peso muerto rumano con mancuernas", reps: "3 series x 8 reps (protección de isquiotibiales)" },
      { name: "Elevación de talones de pie y sentado", reps: "4 series x 15 reps (sóleo y gemelo: vital para maratón)" },
      { name: "Abducción glúteo medio con minibanda", reps: "3 series x 15 reps (estabilidad de rodilla)" }
    ]
  },
  6: { // SÁBADO
    name: "SÁBADO",
    discipline: "DESCANSO SAGRADO",
    typeBadge: "RECUPERACIÓN TOTAL • 100%",
    title: "DÍA DE DESCANSO ABSOLUTO",
    intensity: "CERO ENTRENAMIENTO",
    meta: "ENFOQUE: RECARGA DE GLUCÓGENO, SIESTA Y REPARACIÓN CELULAR",
    isRest: true,
    km: 0,
    steps: [
      { name: "Dormir 8 horas completas", reps: "Reparación hormonal y del sistema nervioso" },
      { name: "Carga de hidratos en comidas", reps: "Arroz, patatas y rústico para llenar depósitos" },
      { name: "Cero impacto en articulaciones", reps: "Dejar que las piernas asimilen el gym del viernes" },
      { name: "Hidratación constante", reps: "2.5 a 3 litros de agua para la tirada de mañana" }
    ]
  },
  0: { // DOMINGO
    name: "DOMINGO",
    discipline: "RUN // 18-22 KM",
    typeBadge: "RUNNING • TIRADA LARGA",
    title: "LA SESIÓN REINA // 20 KM VALENCIA",
    intensity: "ZONA 2 CON FINAL CONTROLADO",
    meta: "ENFOQUE: EL PILAR INDISPENSABLE PARA DESTRUIR EL MURO DE VALENCIA",
    isRest: false,
    km: 20,
    steps: [
      { name: "Tirada larga continua (18 a 22 km)", reps: "Ritmo constante. Los últimos 3 km puedes apretar a ritmo maratón" },
      { name: "Nutrición en carrera", reps: "Tomar 1 gel o medio plátano cada 45-50 minutos" },
      { name: "Batido de proteína Whey post-carrera", reps: "30g proteína + 1 plátano nada más terminar" },
      { name: "Piernas en alto y relax", reps: "Objetivo semanal de 44 km completado con éxito" }
    ]
  }
};

// 2. BASE DE NUTRICIÓN POR DEFECTO
const DEFAULT_MEALS = {
  desayuno: {
    id: "meal_desayuno",
    name: "DESAYUNO // CARGA MATINAL",
    time: "08:00 - 09:00",
    desc: "120g Pan rústico + 12ml AOVE + 70g Pavo/Jamón + 35g Queso + 1 Plátano",
    items: [
      { qty: "100–120 g", text: "Pan Rústico tostado (2 rebanadas generosas)" },
      { qty: "12–15 ml", text: "Aceite de Oliva Virgen Extra (1 cda sopera)" },
      { qty: "70 g", text: "Pechuga de pavo o Jamón serrano" },
      { qty: "35 g", text: "Queso tierno/semicurado de Mercadona" },
      { qty: "1 Plátano", text: "Plátano maduro (~120 g)" },
      { qty: "5 g + 2 perlas", text: "Creatina con agua + 2 perlas Omega 3" }
    ]
  },
  snack: {
    id: "meal_snack",
    name: "MEDIA MAÑANA // PRE-RUN",
    time: "11:30 - 12:30",
    desc: "4 Tortitas de arroz (~35g) + 1 lata de Atún o 50g pavo",
    items: [
      { qty: "4 uds (~35 g)", text: "Tortitas de arroz de Mercadona" },
      { qty: "1 lata (~60 g)", text: "Atún claro al natural o 50g pavo" },
      { qty: "500 ml", text: "Agua mineral (iniciar hidratación)" }
    ]
  },
  comida: {
    id: "meal_comida",
    name: "COMIDA // COMBUSTIBLE PRINCIPAL",
    time: "14:00 - 15:00",
    desc: "120g Arroz/Pasta (o 400g patata) + 180g Lomo o Picada + Gazpacho + Olivas",
    items: [
      { qty: "120 g crudo", text: "Arroz o Pasta (~300g cocido) O 400g Patatas cocidas/asadas" },
      { qty: "180 g", text: "Lomo de cerdo a la plancha O 180g Carne picada magra" },
      { qty: "200–250 ml", text: "Gazpacho tradicional de Mercadona" },
      { qty: "10–12 uds", text: "Olivas / aceitunas de Mercadona" }
    ]
  },
  merienda: {
    id: "meal_merienda",
    name: "MERIENDA // RECUPERACIÓN ANABÓLICA",
    time: "18:00 - 19:00",
    desc: "30g Whey + 1 Plátano grande (~120g) o 4 tortitas de arroz",
    items: [
      { qty: "1 cacito (30 g)", text: "Proteína Whey en polvo (24g proteína pura)" },
      { qty: "1 Plátano", text: "Plátano grande (~120 g) O 4 tortitas de arroz" }
    ]
  },
  cena: {
    id: "meal_cena",
    name: "CENA // REPARACIÓN NOCTURNA LIGERA",
    time: "21:30 - 22:30",
    desc: "300g Patata o 90g Rústico + 2 latas Atún o 160g Lomo + Gazpacho + 25g Queso",
    items: [
      { qty: "300 g", text: "Patata cocida / puré O 90g Pan rústico" },
      { qty: "2 latas (~120 g)", text: "Atún claro O 160g Lomo o Pavo" },
      { qty: "25 g", text: "Queso Mercadona" },
      { qty: "200 ml", text: "Gazpacho tradicional" },
      { qty: "1 dosis", text: "Magnesio 45 min antes de dormir (relajación neuromuscular)" }
    ]
  }
};

// 3. LISTA DE MERCADONA POR DEFECTO
const DEFAULT_MERCADONA = {
  proteins: {
    title: "PROTEÍNAS & PESCADOS",
    subtitle: "~3.5 KG TOTAL",
    icon: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    items: [
      { name: "Lomo de cerdo", weight: "1.5 kg", checked: false },
      { name: "Carne picada vacuno/cerdo", weight: "1.0 kg", checked: false },
      { name: "Latas de atún claro", weight: "8 a 10 latas", checked: false },
      { name: "Pechuga de pavo (fiambre)", weight: "400 g", checked: false },
      { name: "Jamón serrano", weight: "250 g", checked: false }
    ]
  },
  carbs: {
    title: "CARBOHIDRATOS BASE",
    subtitle: "COMBUSTIBLE MARATÓN",
    icon: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/></svg>`,
    items: [
      { name: "Patatas (malla)", weight: "3.0 kg", checked: false },
      { name: "Pan Rústico Mercadona", weight: "2 hogazas", checked: false },
      { name: "Arroz (redondo o vaporizado)", weight: "1 paquete (1 kg)", checked: false },
      { name: "Pasta (macarrones/espaguetis)", weight: "1 paquete (1 kg)", checked: false },
      { name: "Tortitas de arroz", weight: "2 paquetes", checked: false },
      { name: "Plátanos de Canarias", weight: "2 racimos (~2.0 kg)", checked: false }
    ]
  },
  fresh: {
    title: "LÁCTEOS, GRASAS & EXTRAS",
    subtitle: "RECUPERACIÓN",
    icon: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24"/></svg>`,
    items: [
      { name: "Queso semicurado o tierno", weight: "1 cuña (350 g)", checked: false },
      { name: "Gazpacho tradicional", weight: "3 bricks de 1L", checked: false },
      { name: "Bote de olivas rellenas o con hueso", weight: "1 tarro (300 g)", checked: false },
      { name: "Aceite de Oliva Virgen Extra", weight: "1 botella", checked: false }
    ]
  },
  supplements: {
    title: "ARMERÍA DE SUPLEMENTOS",
    subtitle: "DISPENSADOR",
    icon: `<svg class="svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`,
    items: [
      { name: "Creatina Monohidrato", weight: "5 g diarios", checked: false },
      { name: "Proteína Whey en polvo", weight: "30 g diarios", checked: false },
      { name: "Omega 3 concentrado", weight: "2 perlas/día", checked: false },
      { name: "Magnesio (citrato/bisglicinato)", weight: "1 dosis noche", checked: false }
    ]
  }
};

// 4. CONFIGURACIONES DE ALARMAS Y PERFIL POR DEFECTO
const DEFAULT_ALARMS = {
  workout: { enabled: true, time: '09:00', title: '🏋️‍♂️ RECORDATORIO DE ENTRENO DEL DÍA' },
  creatina: { enabled: true, time: '12:00', title: '⚡ CREATINA & RECUPERACIÓN POST-ENTRENO' },
  hidratacion: { enabled: true, time: '16:00', title: '💧 CONTROL DE HIDRATACIÓN' },
  magnesio: { enabled: true, time: '21:30', title: '🌙 MAGNESIO & REGISTRO DE SENSACIONES' }
};

const DEFAULT_RUNNING = {
  benchmark: {
    name: 'Carrera de mañana (Martes)',
    distanceKm: 8.51,
    movingTimeSec: 2949, // 49m 09s
    paceStr: '5:46/km',
    elevation: 8,
    heartRate: 154
  },
  weeklyTargetKm: 44.0
};

const DEFAULT_PROFILE = {
  name: 'VÍCTOR',
  weight: 73,
  height: 178,
  goal: 'VALENCIA 42K PRO'
};

const STORAGE_KEY = 'valencia_42k_victor_prod_v1';
const CLOUD_SYNC_URL = 'https://extendsclass.com/api/json-storage/bin/dfddcab';
const DEFAULT_STRAVA_TOKEN = 'e879a9119db61a2e1c8edaa6bf2c10faa9bad366';
