/**
 * VALENCIA 42K PRO - ATHLETIC BRUTALIST ENGINE
 * Víctor // 73 kg • 178 cm
 */

// 1. BASE DE ENTRENAMIENTOS & NUTRICIÓN POR DEFECTO (PERSONALIZABLE)
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

function getWorkouts() {
  return appState.customWorkouts || DEFAULT_WORKOUTS;
}

function getMeals() {
  return appState.customMeals || DEFAULT_MEALS;
}

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

function getMercadonaList() {
  if (!appState.mercadonaList) {
    appState.mercadonaList = JSON.parse(JSON.stringify(DEFAULT_MERCADONA));
  }
  return appState.mercadonaList;
}

const WORKOUT_PLANS = new Proxy({}, {
  get: (target, prop) => getWorkouts()[prop]
});

// 2. STATE MANAGEMENT & REALTIME ASYNC CLOUD SYNC
const STORAGE_KEY = 'valencia_42k_victor_prod_v1';
const CLOUD_SYNC_URL = 'https://extendsclass.com/api/json-storage/bin/dfddcab';

const DEFAULT_STRAVA_TOKEN = 'e879a9119db61a2e1c8edaa6bf2c10faa9bad366';

function getStoredState() {
  const defaultAlarms = {
    workout: { enabled: true, time: '09:00', title: '🏋️‍♂️ RECORDATORIO DE ENTRENO DEL DÍA' },
    creatina: { enabled: true, time: '12:00', title: '⚡ CREATINA & RECUPERACIÓN POST-ENTRENO' },
    hidratacion: { enabled: true, time: '16:00', title: '💧 CONTROL DE HIDRATACIÓN' },
    magnesio: { enabled: true, time: '21:30', title: '🌙 MAGNESIO & REGISTRO DE SENSACIONES' }
  };

  const defaultRunning = {
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

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.days) parsed.days = {};
      if (!parsed.history) parsed.history = [];
      if (!parsed.lastUpdated) parsed.lastUpdated = 0;
      if (!parsed.strava) {
        parsed.strava = { token: DEFAULT_STRAVA_TOKEN, autoCheck: true, tolerance: 70 };
      } else {
        parsed.strava.token = DEFAULT_STRAVA_TOKEN;
      }
      if (!parsed.profile) {
        parsed.profile = {
          name: 'VÍCTOR',
          weight: 73,
          height: 178,
          goal: 'VALENCIA 42K PRO'
        };
      }
      if (!parsed.alarms) {
        parsed.alarms = defaultAlarms;
      } else {
        parsed.alarms = Object.assign({}, defaultAlarms, parsed.alarms);
      }
      if (!parsed.running) {
        parsed.running = defaultRunning;
      } else {
        parsed.running = Object.assign({}, defaultRunning, parsed.running);
      }
      if (!parsed.mercadonaList) {
        parsed.mercadonaList = JSON.parse(JSON.stringify(DEFAULT_MERCADONA));
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading localStorage:', e);
  }
  return {
    version: 1,
    lastUpdated: 0,
    themeSetting: 'auto',
    soundEnabled: true,
    strava: { token: DEFAULT_STRAVA_TOKEN, autoCheck: true, tolerance: 70 },
    profile: {
      name: 'VÍCTOR',
      weight: 73,
      height: 178,
      goal: 'VALENCIA 42K PRO'
    },
    alarms: defaultAlarms,
    running: defaultRunning,
    mercadonaList: JSON.parse(JSON.stringify(DEFAULT_MERCADONA)),
    days: {},
    history: []
  };
}

let appState = getStoredState();
let cloudPushTimer = null;
let isFetchingCloud = false;

function renderProfileHUD() {
  const prof = appState.profile || { name: 'VÍCTOR', weight: 73, height: 178, goal: 'VALENCIA 42K PRO' };
  const athleteName = (prof.name || 'VÍCTOR').toUpperCase();
  const athleteWeight = prof.weight || 73;
  const athleteHeight = prof.height || 178;

  const nameEl = document.getElementById('user-display-name');
  const metricsEl = document.getElementById('user-display-metrics');
  const tagEl = document.getElementById('system-status-tag');
  const dailyProgTitle = document.getElementById('daily-progress-title');
  const navDietLabel = document.getElementById('tab-nav-diet-label');
  const dietSecTitle = document.getElementById('diet-section-title');

  if (nameEl) nameEl.innerText = athleteName;
  if (metricsEl) metricsEl.innerText = `${athleteWeight} KG • ${athleteHeight} CM`;
  if (tagEl) tagEl.innerText = `MODO PRO // ${athleteWeight} KG`;
  if (dailyProgTitle) dailyProgTitle.innerText = `PROGRESO DEL DÍA (${athleteName})`;
  if (navDietLabel) navDietLabel.innerText = `DIETA ${athleteWeight}KG`;
  if (dietSecTitle) dietSecTitle.innerText = `COMBUSTIBLE Y NUTRICIÓN (${athleteName} ${athleteWeight} KG)`;
}

function updateSyncStatus(status, text) {
  const dot = document.getElementById('sync-dot');
  const textEl = document.getElementById('sync-text');
  if (!dot || !textEl) return;

  dot.classList.remove('syncing', 'error');
  if (status === 'syncing') {
    dot.classList.add('syncing');
    textEl.innerText = text || 'GUARDANDO...';
  } else if (status === 'error') {
    dot.classList.add('error');
    textEl.innerText = text || 'OFFLINE';
  } else {
    textEl.innerText = text || 'NUBE OK';
  }
}

function saveState(state, triggerCloud = true) {
  try {
    state.lastUpdated = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (triggerCloud) {
      scheduleCloudPush();
    }
  } catch (e) {
    console.error('Error saving local state:', e);
  }
}

function scheduleCloudPush() {
  updateSyncStatus('syncing', 'GUARDANDO...');
  if (cloudPushTimer) clearTimeout(cloudPushTimer);
  cloudPushTimer = setTimeout(() => {
    pushToCloud();
  }, 500);
}

async function pushToCloud() {
  try {
    updateSyncStatus('syncing', 'SUBIENDO...');
    const payload = {
      version: 1,
      appName: 'VIROL 42K PRO',
      athlete: (appState.profile && appState.profile.name) ? appState.profile.name : 'Víctor',
      profile: appState.profile || null,
      lastUpdated: appState.lastUpdated || Date.now(),
      days: appState.days || {},
      history: appState.history || [],
      themeSetting: appState.themeSetting || 'auto',
      soundEnabled: appState.soundEnabled !== false,
      customMeals: appState.customMeals || null,
      customWorkouts: appState.customWorkouts || null,
      mercadonaList: appState.mercadonaList || null,
      strava: appState.strava || null,
      alarms: appState.alarms || null,
      running: appState.running || null
    };

    const res = await fetch(CLOUD_SYNC_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      updateSyncStatus('synced', 'NUBE OK');
    } else {
      updateSyncStatus('error', 'REINTENTANDO');
    }
  } catch (err) {
    console.warn('Cloud sync push notice (offline?):', err);
    updateSyncStatus('error', 'OFFLINE');
  }
}

async function syncFromCloud(silent = false) {
  if (isFetchingCloud) return;
  isFetchingCloud = true;
  if (!silent) updateSyncStatus('syncing', 'ACTUALIZANDO...');

  try {
    const res = await fetch(CLOUD_SYNC_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const cloudData = await res.json();

    if (cloudData && typeof cloudData === 'object') {
      const localUpdated = appState.lastUpdated || 0;
      const cloudUpdated = cloudData.lastUpdated || 0;

      // Si la nube tiene cambios más recientes (ej. guardados desde el móvil)
      if (cloudUpdated > localUpdated) {
        console.log('Nuevos datos recibidos de la nube:', cloudData);
        appState.days = cloudData.days || {};
        appState.history = cloudData.history || [];
        appState.lastUpdated = cloudUpdated;
        if (cloudData.profile) appState.profile = cloudData.profile;
        if (cloudData.themeSetting) appState.themeSetting = cloudData.themeSetting;
        if (typeof cloudData.soundEnabled === 'boolean') appState.soundEnabled = cloudData.soundEnabled;
        if (cloudData.customMeals) appState.customMeals = cloudData.customMeals;
        if (cloudData.customWorkouts) appState.customWorkouts = cloudData.customWorkouts;
        if (cloudData.mercadonaList) appState.mercadonaList = cloudData.mercadonaList;
        if (cloudData.strava) appState.strava = cloudData.strava;
        if (cloudData.alarms) {
          appState.alarms = Object.assign({}, appState.alarms, cloudData.alarms);
          updateAlarmsUI();
        }
        if (cloudData.running) {
          appState.running = Object.assign({}, appState.running, cloudData.running);
          renderRunningTab();
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));

        // Refrescar interfaces
        renderProfileHUD();
        applyTheme(appState.themeSetting || 'auto');
        renderMission(selectedDayIndex);
        renderHistory();
        renderMealsTab();
        renderMercadonaList();
        renderScheduleCards();
        renderRunningTab();

        updateSyncStatus('synced', 'NUBE OK');
        if (!silent) {
          showToast('☁️ DATOS ACTUALIZADOS DESDE EL MÓVIL');
        }
      } else if (localUpdated > cloudUpdated && (localUpdated - cloudUpdated > 2500)) {
        // El dispositivo local tiene datos más frescos pendientes de subir
        pushToCloud();
      } else {
        updateSyncStatus('synced', 'NUBE OK');
      }
    }
  } catch (err) {
    console.warn('Cloud sync pull notice:', err);
    updateSyncStatus('error', 'OFFLINE');
  } finally {
    isFetchingCloud = false;
  }
}

// 3. WEB AUDIO SYNTHESIZER (INSTANT TACTILE SOUNDS)
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playCheckSound() {
  if (!appState.soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.09);
  } catch (e) {}
}

function playSuccessSound() {
  if (!appState.soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.07);

      gain.gain.setValueAtTime(0.18, audioCtx.currentTime + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + idx * 0.07 + 0.18);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + idx * 0.07);
      osc.stop(audioCtx.currentTime + idx * 0.07 + 0.19);
    });
  } catch (e) {}
}

function playAlarmSound() {
  if (!appState.soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    [0, 0.2].forEach(delay => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + delay);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + delay + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + delay);
      osc.stop(audioCtx.currentTime + delay + 0.13);
    });
  } catch (e) {}
}

// 4. THEME CONTROLLER
function getAutoTheme() {
  const hour = new Date().getHours();
  return (hour >= 7 && hour < 20) ? 'light' : 'dark';
}

function applyTheme(setting) {
  let activeTheme;
  const iconEl = document.getElementById('theme-icon');
  const labelEl = document.getElementById('theme-label');

  if (setting === 'day') {
    activeTheme = 'light';
    if (iconEl) iconEl.innerText = '☀️';
    if (labelEl) labelEl.innerText = 'DÍA';
  } else if (setting === 'night') {
    activeTheme = 'dark';
    if (iconEl) iconEl.innerText = '🌙';
    if (labelEl) labelEl.innerText = 'NOCHE';
  } else {
    activeTheme = getAutoTheme();
    if (iconEl) iconEl.innerText = '⚙️';
    if (labelEl) labelEl.innerText = `AUTO (${activeTheme === 'light' ? 'DÍA' : 'NOCHE'})`;
  }

  document.documentElement.setAttribute('data-theme', activeTheme);
}

function cycleTheme() {
  const current = appState.themeSetting || 'auto';
  let next;
  if (current === 'auto') next = 'day';
  else if (current === 'day') next = 'night';
  else next = 'auto';

  appState.themeSetting = next;
  saveState(appState);
  applyTheme(next);

  const modeNames = { auto: 'AUTOMÁTICO (HORARIO)', day: 'MODO DÍA ☀️', night: 'MODO NOCHE 🌙' };
  showToast(`MODO VISUAL: ${modeNames[next]}`);
}

// 5. COUNTDOWN CALCULATION
function updateCountdowns() {
  const now = new Date();
  
  // Media Maratón Valencia: 25 Octubre 2026
  const halfDate = new Date(2026, 9, 25, 8, 30, 0);
  // Maratón Valencia: 6 Diciembre 2026
  const fullDate = new Date(2026, 11, 6, 8, 15, 0);

  const diffHalf = Math.max(0, Math.ceil((halfDate - now) / (1000 * 60 * 60 * 24)));
  const diffFull = Math.max(0, Math.ceil((fullDate - now) / (1000 * 60 * 60 * 24)));

  const elHalf = document.getElementById('cd-half');
  const elFull = document.getElementById('cd-full');

  if (elHalf) elHalf.innerHTML = `${diffHalf} <span class="unit">DÍAS</span>`;
  if (elFull) elFull.innerHTML = `${diffFull} <span class="unit">DÍAS</span>`;
}

// 6. DAY MISSION & CHECKLIST
let selectedDayIndex = new Date().getDay();

function getTodayKey(dayIndex) {
  return `day_${dayIndex}`;
}

function renderMission(dayIndex) {
  const plan = WORKOUT_PLANS[dayIndex];
  if (!plan) return;

  const tagBadge = document.getElementById('mission-type-badge');
  const intensity = document.getElementById('mission-intensity');
  const title = document.getElementById('mission-title');
  const meta = document.getElementById('mission-meta');
  const breakdown = document.getElementById('mission-breakdown');
  const toggleBtn = document.getElementById('btn-toggle-workout');

  if (tagBadge) tagBadge.innerText = plan.typeBadge;
  if (intensity) intensity.innerText = plan.intensity;
  if (title) title.innerText = plan.title;
  if (meta) meta.innerHTML = `<span>${plan.meta}</span>`;

  const coachTag = document.getElementById('mission-coach-tag');
  const disc = ((plan.discipline || '') + ' ' + (plan.typeBadge || '') + ' ' + (plan.title || '')).toUpperCase();
  const isRunning = Number(plan.km) > 0 || disc.includes('RUN') || disc.includes('CARRERA') || disc.includes('RODAJE') || disc.includes('SERIES') || disc.includes('TIRADA') || dayIndex === 2 || dayIndex === 4 || dayIndex === 0;
  if (coachTag) {
    coachTag.style.display = isRunning ? 'inline-flex' : 'none';
  }

  if (breakdown) {
    breakdown.innerHTML = plan.steps.map((s, idx) => `
      <div class="mission-step">
        <span class="step-idx">${idx + 1}</span>
        <div class="step-info">
          <span class="step-name">${s.name}</span>
          <span class="step-reps">${s.reps}</span>
        </div>
      </div>
    `).join('');
  }

  const key = getTodayKey(dayIndex);
  const dayData = appState.days[key] || {};
  const isCompleted = !!dayData.workoutCompleted;

  if (toggleBtn) {
    if (isCompleted) {
      toggleBtn.classList.add('is-completed');
      toggleBtn.querySelector('.txt').innerText = 'ENTRENAMIENTO COMPLETADO ✔';
    } else {
      toggleBtn.classList.remove('is-completed');
      toggleBtn.querySelector('.txt').innerText = plan.isRest ? 'CONFIRMAR DESCANSO TOTAL' : 'MARCAR ENTRENO COMPLETADO';
    }
  }

  renderMealChecklist(dayIndex);
  syncCheckboxes(dayIndex);
  updateProgressHUD(dayIndex);
  renderStravaHUD(dayIndex);
}

function syncCheckboxes(dayIndex) {
  const key = getTodayKey(dayIndex);
  const dayData = appState.days[key] || {};

  const allChecks = document.querySelectorAll('#tab-today input[type="checkbox"]');
  allChecks.forEach(chk => {
    const chkKey = chk.dataset.chk;
    chk.checked = !!dayData[chkKey];
  });

  const sleepInput = document.getElementById('sleep-hours');
  if (sleepInput) {
    sleepInput.value = dayData.sleepHours || 8;
  }
}

function renderMealChecklist(dayIndex) {
  const container = document.getElementById('meals-checklist');
  if (!container) return;

  const meals = getMeals();
  const key = getTodayKey(dayIndex);
  const dayData = appState.days[key] || {};

  const mealKeys = ['desayuno', 'snack', 'comida', 'merienda', 'cena'];
  container.innerHTML = mealKeys.map(mKey => {
    const m = meals[mKey] || DEFAULT_MEALS[mKey];
    if (!m) return '';
    const chkId = m.id || `meal_${mKey}`;
    const isChecked = !!dayData[chkId];
    return `
      <label class="chk-item">
        <input type="checkbox" data-chk="${chkId}" ${isChecked ? 'checked' : ''}>
        <span class="custom-checkbox"></span>
        <div class="chk-content">
          <span class="chk-name">${m.name}</span>
          <span class="chk-desc">${m.desc}</span>
        </div>
      </label>
    `;
  }).join('');

  container.querySelectorAll('input[type="checkbox"]').forEach(chk => {
    chk.addEventListener('change', () => {
      const todayKey = getTodayKey(selectedDayIndex);
      if (!appState.days[todayKey]) appState.days[todayKey] = {};
      const chkKey = chk.dataset.chk;
      appState.days[todayKey][chkKey] = chk.checked;
      saveState(appState);
      updateProgressHUD(selectedDayIndex);

      if (chk.checked) {
        playCheckSound();
        showToast(`✔ MARCADO: ${chk.closest('.chk-item').querySelector('.chk-name').innerText}`);
      }
    });
  });
}

function renderMealsTab() {
  const container = document.querySelector('.meals-expanded-list');
  if (!container) return;

  const meals = getMeals();
  const mealKeys = ['desayuno', 'snack', 'comida', 'merienda', 'cena'];
  container.innerHTML = mealKeys.map(mKey => {
    const m = meals[mKey] || DEFAULT_MEALS[mKey];
    if (!m) return '';
    const itemsHtml = (m.items || []).map(it => {
      if (typeof it === 'string') {
        return `<li><strong>${it}</strong></li>`;
      }
      return `<li><span class="gram-qty">${it.qty || ''}</span> <strong>${it.text || it}</strong></li>`;
    }).join('');

    return `
      <div class="meal-detail-box">
        <div class="meal-badge">${m.time || ''}</div>
        <div class="meal-body">
          <h3 class="meal-name">${m.name}</h3>
          <ul class="gram-list">
            ${itemsHtml}
          </ul>
        </div>
      </div>
    `;
  }).join('');
}

function renderScheduleCards() {
  const container = document.querySelector('.schedule-grid');
  if (!container) return;

  const workouts = getWorkouts();
  const dayOrder = [1, 2, 3, 4, 5, 6, 0];
  const cardClasses = {
    1: 'card-pull',
    2: 'card-run',
    3: 'card-push',
    4: 'card-quality',
    5: 'card-legs',
    6: 'card-rest',
    0: 'card-longrun'
  };
  const tagClasses = {
    1: 'tag-blue',
    2: 'tag-volt',
    3: 'tag-blue',
    4: 'tag-orange',
    5: 'tag-purple',
    6: 'tag-rest',
    0: 'tag-orange'
  };

  container.innerHTML = dayOrder.map(d => {
    const w = workouts[d] || DEFAULT_WORKOUTS[d];
    if (!w) return '';
    const stepsSummary = (w.steps || []).map(s => `${s.name} (${s.reps})`).join(', ');
    const disc = ((w.discipline || '') + ' ' + (w.title || '')).toUpperCase();
    const isRunning = Number(w.km) > 0 || disc.includes('RUN') || disc.includes('CARRERA') || disc.includes('RODAJE') || disc.includes('SERIES') || disc.includes('TIRADA') || d === 2 || d === 4 || d === 0;
    return `
      <div class="day-card ${cardClasses[d] || 'card-pull'}" data-day-index="${d}">
        <div class="day-card-header">
          <span class="day-name">${w.name}</span>
          <div style="display:flex; gap:6px; align-items:center;">
            ${isRunning ? `<span class="tag-valence" title="Entrenador: Josemi (Valence Fit)"><img src="img/valence_fit.png" alt="Valence Fit"> VALENCE FIT</span>` : ''}
            <span class="day-discipline ${tagClasses[d] || 'tag-blue'}">${w.discipline}</span>
          </div>
        </div>
        <h3 class="day-title">${w.title}</h3>
        <p class="day-desc">${stepsSummary}</p>
        <div class="day-footer">
          <span class="tag-status">${w.km > 0 ? `${w.km.toFixed(1)} KM` : (w.isRest ? '0 KM • REGENERACIÓN' : 'Sin impacto en piernas')}</span>
          <span class="day-intensity">${w.intensity || ''}</span>
        </div>
      </div>
    `;
  }).join('');
}

function initPlanEditor() {
  const modalOverlay = document.getElementById('editor-modal-overlay');
  const btnClose = document.getElementById('btn-close-editor');

  // Trigger buttons
  const btnOpenProfile = document.getElementById('btn-open-profile-editor');
  const btnHeaderOpen = document.getElementById('btn-header-open-editor');
  const btnTodayWorkout = document.getElementById('btn-today-open-workout-editor');
  const btnTodayMeal = document.getElementById('btn-today-open-meal-editor');
  const btnOpenMeals = document.getElementById('btn-open-meal-editor');
  const btnOpenPlan = document.getElementById('btn-open-plan-editor');

  // Tab buttons
  const tabProfileBtn = document.getElementById('btn-tab-edit-profile');
  const tabMealsBtn = document.getElementById('btn-tab-edit-meals');
  const tabWorkoutsBtn = document.getElementById('btn-tab-edit-workouts');

  // Panes
  const paneProfile = document.getElementById('pane-edit-profile');
  const paneMeals = document.getElementById('pane-edit-meals');
  const paneWorkouts = document.getElementById('pane-edit-workouts');

  // Profile inputs
  const profileNameInput = document.getElementById('edit-profile-name');
  const profileWeightInput = document.getElementById('edit-profile-weight');
  const profileHeightInput = document.getElementById('edit-profile-height');
  const profileGoalInput = document.getElementById('edit-profile-goal');

  // Meal inputs
  const mealSelect = document.getElementById('edit-meal-select');
  const mealNameInput = document.getElementById('edit-meal-name');
  const mealTimeInput = document.getElementById('edit-meal-time');
  const mealDescInput = document.getElementById('edit-meal-desc');
  const mealItemsTextarea = document.getElementById('edit-meal-items');

  // Workout inputs
  const workoutSelect = document.getElementById('edit-workout-select');
  const workoutDisciplineInput = document.getElementById('edit-workout-discipline');
  const workoutTitleInput = document.getElementById('edit-workout-title');
  const workoutKmInput = document.getElementById('edit-workout-km');
  const workoutStepsTextarea = document.getElementById('edit-workout-steps');

  const btnSave = document.getElementById('btn-save-custom-plan');
  const btnReset = document.getElementById('btn-reset-defaults');

  let currentTab = 'profile';

  function openEditor(tab = 'profile') {
    currentTab = tab;

    if (tabProfileBtn) tabProfileBtn.classList.remove('active');
    if (tabMealsBtn) tabMealsBtn.classList.remove('active');
    if (tabWorkoutsBtn) tabWorkoutsBtn.classList.remove('active');

    if (paneProfile) paneProfile.style.display = 'none';
    if (paneMeals) paneMeals.style.display = 'none';
    if (paneWorkouts) paneWorkouts.style.display = 'none';

    if (tab === 'profile') {
      if (tabProfileBtn) tabProfileBtn.classList.add('active');
      if (paneProfile) paneProfile.style.display = 'flex';
      loadProfileIntoForm();
    } else if (tab === 'meals') {
      if (tabMealsBtn) tabMealsBtn.classList.add('active');
      if (paneMeals) paneMeals.style.display = 'flex';
      if (mealSelect) loadMealIntoForm(mealSelect.value);
    } else {
      if (tabWorkoutsBtn) tabWorkoutsBtn.classList.add('active');
      if (paneWorkouts) paneWorkouts.style.display = 'flex';
      if (workoutSelect) loadWorkoutIntoForm(workoutSelect.value);
    }

    if (modalOverlay) modalOverlay.classList.add('active');
  }

  function closeEditor() {
    if (modalOverlay) modalOverlay.classList.remove('active');
  }

  // Bind open trigger buttons
  if (btnOpenProfile) btnOpenProfile.addEventListener('click', () => openEditor('profile'));
  if (btnHeaderOpen) btnHeaderOpen.addEventListener('click', () => openEditor('profile'));
  if (btnTodayWorkout) btnTodayWorkout.addEventListener('click', () => openEditor('workouts'));
  if (btnTodayMeal) btnTodayMeal.addEventListener('click', () => openEditor('meals'));
  if (btnOpenMeals) btnOpenMeals.addEventListener('click', () => openEditor('meals'));
  if (btnOpenPlan) btnOpenPlan.addEventListener('click', () => openEditor('workouts'));
  if (btnClose) btnClose.addEventListener('click', closeEditor);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeEditor();
    });
  }

  // Bind modal tabs
  if (tabProfileBtn) tabProfileBtn.addEventListener('click', () => openEditor('profile'));
  if (tabMealsBtn) tabMealsBtn.addEventListener('click', () => openEditor('meals'));
  if (tabWorkoutsBtn) tabWorkoutsBtn.addEventListener('click', () => openEditor('workouts'));

  function loadProfileIntoForm() {
    const prof = appState.profile || { name: 'VÍCTOR', weight: 73, height: 178, goal: 'VALENCIA 42K PRO' };
    if (profileNameInput) profileNameInput.value = prof.name || '';
    if (profileWeightInput) profileWeightInput.value = prof.weight || 73;
    if (profileHeightInput) profileHeightInput.value = prof.height || 178;
    if (profileGoalInput) profileGoalInput.value = prof.goal || '';
  }

  function loadMealIntoForm(mealKey) {
    const meals = getMeals();
    const m = meals[mealKey] || DEFAULT_MEALS[mealKey];
    if (!m) return;
    if (mealNameInput) mealNameInput.value = m.name || '';
    if (mealTimeInput) mealTimeInput.value = m.time || '';
    if (mealDescInput) mealDescInput.value = m.desc || '';
    const itemsLines = (m.items || []).map(it => {
      if (typeof it === 'string') return it;
      return `${it.qty || ''} | ${it.text || ''}`;
    }).join('\n');
    if (mealItemsTextarea) mealItemsTextarea.value = itemsLines;
  }

  function loadWorkoutIntoForm(dayIdx) {
    const workouts = getWorkouts();
    const w = workouts[dayIdx] || DEFAULT_WORKOUTS[dayIdx];
    if (!w) return;
    if (workoutDisciplineInput) workoutDisciplineInput.value = w.discipline || '';
    if (workoutTitleInput) workoutTitleInput.value = w.title || '';
    if (workoutKmInput) workoutKmInput.value = w.km || 0;
    const stepsLines = (w.steps || []).map(s => `${s.name} | ${s.reps}`).join('\n');
    if (workoutStepsTextarea) workoutStepsTextarea.value = stepsLines;
  }

  if (mealSelect) {
    mealSelect.addEventListener('change', () => loadMealIntoForm(mealSelect.value));
  }
  if (workoutSelect) {
    workoutSelect.addEventListener('change', () => loadWorkoutIntoForm(workoutSelect.value));
  }

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      if (currentTab === 'profile') {
        const pName = profileNameInput ? profileNameInput.value.trim() : 'Víctor';
        const pWeight = parseFloat(profileWeightInput ? profileWeightInput.value : 73) || 73;
        const pHeight = parseFloat(profileHeightInput ? profileHeightInput.value : 178) || 178;
        const pGoal = profileGoalInput ? profileGoalInput.value.trim() : 'VALENCIA 42K PRO';

        appState.profile = {
          name: pName || 'Víctor',
          weight: pWeight,
          height: pHeight,
          goal: pGoal || 'VALENCIA 42K PRO'
        };

        renderProfileHUD();
        showToast(`👤 PERFIL ACTUALIZADO: ${appState.profile.name.toUpperCase()} (${appState.profile.weight} KG)`);
      } else if (currentTab === 'meals') {
        const mealKey = mealSelect.value;
        if (!appState.customMeals) {
          appState.customMeals = JSON.parse(JSON.stringify(DEFAULT_MEALS));
        }
        const lines = (mealItemsTextarea ? mealItemsTextarea.value : '').split('\n').filter(l => l.trim().length > 0);
        const parsedItems = lines.map(l => {
          const parts = l.split('|');
          if (parts.length > 1) {
            return { qty: parts[0].trim(), text: parts[1].trim() };
          }
          return { qty: '', text: l.trim() };
        });

        appState.customMeals[mealKey] = {
          id: `meal_${mealKey}`,
          name: (mealNameInput ? mealNameInput.value.trim() : '') || DEFAULT_MEALS[mealKey].name,
          time: (mealTimeInput ? mealTimeInput.value.trim() : '') || DEFAULT_MEALS[mealKey].time,
          desc: (mealDescInput ? mealDescInput.value.trim() : '') || DEFAULT_MEALS[mealKey].desc,
          items: parsedItems
        };
        showToast('✨ MENÚ PERSONALIZADO GUARDADO Y SINCRONIZADO');
      } else {
        const dayIdx = parseInt(workoutSelect.value, 10);
        if (!appState.customWorkouts) {
          appState.customWorkouts = JSON.parse(JSON.stringify(DEFAULT_WORKOUTS));
        }
        const lines = (workoutStepsTextarea ? workoutStepsTextarea.value : '').split('\n').filter(l => l.trim().length > 0);
        const parsedSteps = lines.map(l => {
          const parts = l.split('|');
          if (parts.length > 1) {
            return { name: parts[0].trim(), reps: parts[1].trim() };
          }
          return { name: l.trim(), reps: '' };
        });

        const prev = appState.customWorkouts[dayIdx] || DEFAULT_WORKOUTS[dayIdx];
        const kmVal = parseFloat(workoutKmInput ? workoutKmInput.value : 0) || 0;
        const discVal = workoutDisciplineInput ? workoutDisciplineInput.value.trim() : prev.discipline;
        appState.customWorkouts[dayIdx] = {
          ...prev,
          discipline: discVal || prev.discipline,
          title: (workoutTitleInput ? workoutTitleInput.value.trim() : '') || prev.title,
          km: kmVal,
          isRest: kmVal === 0 && discVal.toLowerCase().includes('descanso'),
          steps: parsedSteps
        };
        showToast('✨ ENTRENAMIENTO PERSONALIZADO GUARDADO Y SINCRONIZADO');
      }

      saveState(appState);
      playSuccessSound();
      renderMission(selectedDayIndex);
      renderMealsTab();
      renderScheduleCards();
      closeEditor();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('¿Restaurar datos de atleta, entrenamientos y menú al original (Víctor 73 kg Mercadona)?')) {
        appState.profile = {
          name: 'VÍCTOR',
          weight: 73,
          height: 178,
          goal: 'VALENCIA 42K PRO'
        };
        delete appState.customMeals;
        delete appState.customWorkouts;
        saveState(appState);
        playCheckSound();
        renderProfileHUD();
        renderMission(selectedDayIndex);
        renderMealsTab();
        renderScheduleCards();
        closeEditor();
        showToast('🔄 PLAN Y DATOS RESTAURADOS AL ORIGINAL');
      }
    });
  }
}

function updateProgressHUD(dayIndex) {
  const key = getTodayKey(dayIndex);
  const dayData = appState.days[key] || {};

  const checkKeys = [
    'workoutCompleted',
    'supp_creatina',
    'supp_omega3',
    'supp_whey',
    'supp_magnesio',
    'meal_desayuno',
    'meal_snack',
    'meal_comida',
    'meal_merienda',
    'meal_cena'
  ];

  let doneCount = 0;
  checkKeys.forEach(k => {
    if (dayData[k]) doneCount++;
  });

  const percent = Math.round((doneCount / checkKeys.length) * 100);
  const numEl = document.getElementById('daily-progress-percent');
  const barEl = document.getElementById('daily-bar-fill');

  if (numEl) numEl.innerText = `${percent}%`;
  if (barEl) barEl.style.width = `${percent}%`;

  if (percent === 100 && !dayData._hasCelebrated) {
    dayData._hasCelebrated = true;
    saveState(appState);
    playSuccessSound();
    showToast('🏆 ¡100% DEL DÍA COMPLETADO! VÍCTOR EN MODO ÉLITE');
  }

  updateWeekHUD();
}

function updateWeekHUD() {
  let totalKm = 0;
  [1, 2, 3, 4, 5, 6, 0].forEach(d => {
    const key = getTodayKey(d);
    const dayData = appState.days[key] || {};
    if (dayData.workoutCompleted) {
      totalKm += WORKOUT_PLANS[d].km;
    }
  });

  const kmEl = document.getElementById('week-km-done');
  if (kmEl) kmEl.innerText = totalKm;

  const blocksContainer = document.getElementById('km-blocks');
  if (blocksContainer) {
    const target = 44;
    const activeBlocks = Math.min(10, Math.round((totalKm / target) * 10));
    let html = '';
    for (let i = 0; i < 10; i++) {
      html += `<div class="hud-block ${i < activeBlocks ? 'active' : ''}"></div>`;
    }
    blocksContainer.innerHTML = html;
  }
}

// 7. ARCHIVE & HISTORY
function renderHistory() {
  const container = document.getElementById('history-list');
  if (!container) return;

  const history = appState.history || [];
  if (history.length === 0) {
    container.innerHTML = `<div class="history-empty">Aún no has archivado semanas. Al terminar el domingo, pulsa 'ARCHIVAR SEMANA'.</div>`;
    return;
  }

  container.innerHTML = history.map((item, idx) => `
    <div class="history-item">
      <div>
        <span class="history-week-num">SEMANA #${history.length - idx} • ${item.date}</span>
        <span class="history-sub" style="display:block; font-size:0.75rem; color:var(--text-muted);">${item.sessionsDone} sesiones completadas • Sueño prom: ${item.avgSleep}h</span>
      </div>
      <div class="history-km">${item.km} KM</div>
    </div>
  `).join('');
}

function archiveCurrentWeek() {
  let totalKm = 0;
  let sessionsDone = 0;
  let sleepSum = 0;

  [1, 2, 3, 4, 5, 6, 0].forEach(d => {
    const key = getTodayKey(d);
    const dayData = appState.days[key] || {};
    if (dayData.workoutCompleted) {
      totalKm += WORKOUT_PLANS[d].km;
      sessionsDone++;
    }
    sleepSum += parseFloat(dayData.sleepHours || 8);
  });

  const avgSleep = (sleepSum / 7).toFixed(1);
  const dateStr = new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' });

  if (!confirm(`¿Archivar la semana con ${totalKm} km y resetear los checks para una nueva semana?`)) {
    return;
  }

  if (!appState.history) appState.history = [];
  appState.history.unshift({
    date: dateStr,
    km: totalKm,
    sessionsDone,
    avgSleep
  });

  // Reset current week days
  appState.days = {};
  saveState(appState);

  playSuccessSound();
  renderMission(selectedDayIndex);
  renderHistory();
  showToast(`📁 ¡SEMANA ARCHIVADA CON ÉXITO (${totalKm} KM SUMADOS)!`);
}

// ==========================================================================
// 8. NOTIFICATIONS & ALARM CENTER (PWA & iOS STANDALONE)
// ==========================================================================

function updateAlarmsUI() {
  if (!appState.alarms) return;

  const mapping = [
    { key: 'workout', inputId: 'time-alarm-workout', chkId: 'alarm-workout' },
    { key: 'creatina', inputId: 'time-alarm-creatina', chkId: 'alarm-creatina' },
    { key: 'hidratacion', inputId: 'time-alarm-hidratacion', chkId: 'alarm-hidratacion' },
    { key: 'magnesio', inputId: 'time-alarm-magnesio', chkId: 'alarm-magnesio' }
  ];

  mapping.forEach(m => {
    const config = appState.alarms[m.key];
    if (!config) return;
    const timeInput = document.getElementById(m.inputId);
    const chk = document.getElementById(m.chkId);

    if (timeInput && config.time) timeInput.value = config.time;
    if (chk && typeof config.enabled === 'boolean') chk.checked = config.enabled;
  });

  updatePushPermissionUI();
}

function updatePushPermissionUI() {
  const badge = document.getElementById('device-push-status');
  const btn = document.getElementById('btn-request-push-permission');
  const txt = document.getElementById('push-permission-text');
  const ico = document.getElementById('push-permission-icon');
  if (!badge) return;

  if (!('Notification' in window)) {
    badge.innerText = 'NOTIFICACIONES NO SOPORTADAS EN ESTE NAVEGADOR';
    badge.style.color = 'var(--c-orange)';
    return;
  }

  if (Notification.permission === 'granted') {
    badge.innerText = 'PERMISOS: CONCEDIDOS ✔ (AVISOS ACTIVOS)';
    badge.style.color = 'var(--c-volt)';
    if (txt) txt.innerText = 'NOTIFICACIONES ACTIVAS';
    if (ico) ico.innerText = '✅';
    if (btn) {
      btn.style.background = 'var(--bg-card)';
      btn.style.color = 'var(--text-main)';
      btn.style.borderColor = 'var(--c-volt)';
    }
  } else if (Notification.permission === 'denied') {
    badge.innerText = 'PERMISOS: BLOQUEADOS (HABILÍTALOS EN AJUSTES iOS/ANDROID)';
    badge.style.color = 'var(--c-orange)';
    if (txt) txt.innerText = 'PERMISO BLOQUEADO';
    if (ico) ico.innerText = '⚠️';
  } else {
    badge.innerText = 'PERMISOS: PENDIENTES DE ACTIVAR';
    badge.style.color = 'var(--c-orange)';
    if (txt) txt.innerText = 'ACTIVAR NOTIFICACIONES MÓVIL';
    if (ico) ico.innerText = '🔔';
  }
}

async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    showToast('⚠️ Este dispositivo o navegador no soporta Notificaciones Web');
    return;
  }

  try {
    const perm = await Notification.requestPermission();
    updatePushPermissionUI();

    if (perm === 'granted') {
      playSuccessSound();
      showToast('🔔 ¡NOTIFICACIONES ACTIVADAS PARA VALENCIA 42K!');
      triggerSystemNotification('⚡ VIROL 42K PRO', '¡Notificaciones del sistema y sonido táctil activos en tu móvil!');
    } else if (perm === 'denied') {
      showToast('⚠️ Permiso denegado. Puedes cambiarlo en los Ajustes de tu móvil.');
    }
  } catch (err) {
    console.error('Notification permission error:', err);
  }
}

async function triggerSystemNotification(title, body, tag = 'virol-alert') {
  playAlarmSound();
  showToast(`🔔 ${title}: ${body}`);

  // Try Service Worker registration first (standard for iOS 16.4+ standalone PWAs & Android)
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, {
          body: body,
          icon: './img/virol_logo.png',
          badge: './img/virol_logo.png',
          tag: tag,
          vibrate: [200, 100, 200],
          renotify: true,
          data: { url: './index.html' }
        });
        return;
      }
    } catch (e) {
      console.warn('SW showNotification error:', e);
    }
  }

  // Fallback to desktop/browser Notification
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body: body,
        icon: './img/virol_logo.png'
      });
    } catch (e) {}
  }
}

function checkAlarms() {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  if (!appState.alarms) return;

  const currentDay = now.getDay();
  const todayPlan = WORKOUT_PLANS[currentDay] || {};

  const alarmConfigs = [
    {
      key: 'workout',
      title: '🏋️‍♂️ ENTRENO DEL DÍA (10:00 AM)',
      getBody: () => {
        const kmStr = todayPlan.km ? ` (${todayPlan.km} km running)` : '';
        return `Víctor, hoy toca ${todayPlan.name || 'Entrenamiento'}${kmStr}. ¡A tope en la sesión de mañanas!`;
      }
    },
    {
      key: 'creatina',
      title: '⚡ CREATINA & RECUPERACIÓN POST-ENTRENO',
      getBody: () => 'Víctor: 5g de Creatina en agua y el batido de 30g de Proteína Whey post-entreno.'
    },
    {
      key: 'hidratacion',
      title: '💧 CONTROL DE HIDRATACIÓN',
      getBody: () => 'Asegura 2.0 L de agua acumulados antes de la tarde para optimizar síntesis y descanso.'
    },
    {
      key: 'magnesio',
      title: '🌙 MAGNESIO & REGISTRO DE SENSACIONES',
      getBody: () => 'Víctor: Toma el magnesio y registra tus sensaciones y peso en VIROL 42K antes de dormir.'
    }
  ];

  alarmConfigs.forEach(al => {
    const item = appState.alarms[al.key];
    if (item && item.enabled && item.time === timeStr) {
      if (!item._lastTriggered || item._lastTriggered !== timeStr) {
        item._lastTriggered = timeStr;
        triggerSystemNotification(al.title, al.getBody(), `alarm-${al.key}`);
      }
    }
  });
}

function initAlarmsModule() {
  updateAlarmsUI();

  const timeInputs = [
    { key: 'workout', id: 'time-alarm-workout' },
    { key: 'creatina', id: 'time-alarm-creatina' },
    { key: 'hidratacion', id: 'time-alarm-hidratacion' },
    { key: 'magnesio', id: 'time-alarm-magnesio' }
  ];

  timeInputs.forEach(t => {
    const el = document.getElementById(t.id);
    if (el) {
      el.addEventListener('change', () => {
        if (!appState.alarms[t.key]) appState.alarms[t.key] = {};
        appState.alarms[t.key].time = el.value;
        saveState(appState);
        flashAutosaveTag();
        showToast(`⏰ Hora actualizada: ${el.value}`);
      });
    }
  });

  const toggles = [
    { key: 'workout', id: 'alarm-workout' },
    { key: 'creatina', id: 'alarm-creatina' },
    { key: 'hidratacion', id: 'alarm-hidratacion' },
    { key: 'magnesio', id: 'alarm-magnesio' }
  ];

  toggles.forEach(tog => {
    const el = document.getElementById(tog.id);
    if (el) {
      el.addEventListener('change', () => {
        if (!appState.alarms[tog.key]) appState.alarms[tog.key] = {};
        appState.alarms[tog.key].enabled = el.checked;
        saveState(appState);
        flashAutosaveTag();
        playCheckSound();
        showToast(el.checked ? '🔔 Alarma activada' : '🔕 Alarma desactivada');
      });
    }
  });

  const btnPerm = document.getElementById('btn-request-push-permission');
  if (btnPerm) {
    btnPerm.addEventListener('click', requestNotificationPermission);
  }

  const btnTest = document.getElementById('btn-test-notification');
  if (btnTest) {
    btnTest.addEventListener('click', () => {
      requestNotificationPermission();
      triggerSystemNotification(
        '🚀 TEST DE NOTIFICACIÓN IPHONE // VIROL 42K',
        '¡Notificación nativa y sonido táctil confirmados en tu dispositivo!'
      );
    });
  }
}

function flashAutosaveTag() {
  const tag = document.getElementById('alarms-autosave-tag');
  if (!tag) return;
  tag.style.display = 'inline-block';
  clearTimeout(tag._timeout);
  tag._timeout = setTimeout(() => {
    tag.style.display = 'none';
  }, 2200);
}

// ==========================================================================
// 8B. RUNNING PHYSIOLOGY ENGINE & MARATHON PREDICTOR (VDOT + RIEGEL)
// ==========================================================================

// JACK DANIELS VDOT FORMULA (Daniels & Gilbert formula)
function calculateVDOT(distanceMeters, timeSeconds) {
  if (distanceMeters <= 0 || timeSeconds <= 0) return 38.6;
  const timeMinutes = timeSeconds / 60;
  const v = distanceMeters / timeMinutes; // Velocity in meters/min

  // Oxygen cost of running at velocity v
  const vo2 = -4.60 + 0.182258 * v + 0.000104 * Math.pow(v, 2);

  // Percentage of VO2max sustainable over timeMinutes
  const pctVO2max = 0.8 + 0.1894393 * Math.exp(-0.012778 * timeMinutes) + 0.2989558 * Math.exp(-0.1932605 * timeMinutes);

  const vdot = vo2 / pctVO2max;
  return Math.max(25, Math.min(85, vdot));
}

// PETER RIEGEL FORMULA: T2 = T1 * (D2 / D1)^exponent
function predictRaceTimeRiegel(d1Meters, t1Seconds, d2Meters, exponent = 1.06) {
  if (d1Meters <= 0 || t1Seconds <= 0) return 0;
  return t1Seconds * Math.pow(d2Meters / d1Meters, exponent);
}

// Velocity for a specific target % of VO2max given VDOT
function getVelocityFromVDOT(vdot, percentVO2) {
  const targetVO2 = vdot * percentVO2;
  // Solve 0.000104 * v^2 + 0.182258 * v - (targetVO2 + 4.60) = 0
  const a = 0.000104;
  const b = 0.182258;
  const c = -(targetVO2 + 4.60);
  const v = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
  return v; // m/min
}

function velocityToPaceSecondsPerKm(v) {
  if (v <= 0) return 360;
  return (1000 / v) * 60;
}

function formatPaceMinSec(totalSeconds) {
  if (!totalSeconds || isNaN(totalSeconds) || totalSeconds <= 0) return '--:--';
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.round(totalSeconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function formatTimeHMS(totalSeconds) {
  if (!totalSeconds || isNaN(totalSeconds) || totalSeconds <= 0) return '--:--';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  }
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
}

function getDanielsTrainingPaces(vdot) {
  // Zone intensities according to Jack Daniels Running Formula:
  // Easy (E): ~65-74% VO2max
  // Marathon (M): ~80-84% VO2max
  // Threshold (T): ~87-89% VO2max
  // Interval (I): ~97-100% VO2max
  // Repetition (R): ~105-110% VO2max

  const vE_slow = getVelocityFromVDOT(vdot, 0.65);
  const vE_fast = getVelocityFromVDOT(vdot, 0.74);
  const paceE_slow = velocityToPaceSecondsPerKm(vE_slow);
  const paceE_fast = velocityToPaceSecondsPerKm(vE_fast);

  const vM_slow = getVelocityFromVDOT(vdot, 0.80);
  const vM_fast = getVelocityFromVDOT(vdot, 0.84);
  const paceM_slow = velocityToPaceSecondsPerKm(vM_slow);
  const paceM_fast = velocityToPaceSecondsPerKm(vM_fast);

  const vT_slow = getVelocityFromVDOT(vdot, 0.87);
  const vT_fast = getVelocityFromVDOT(vdot, 0.89);
  const paceT_slow = velocityToPaceSecondsPerKm(vT_slow);
  const paceT_fast = velocityToPaceSecondsPerKm(vT_fast);

  const vI_slow = getVelocityFromVDOT(vdot, 0.97);
  const vI_fast = getVelocityFromVDOT(vdot, 1.00);
  const paceI_slow = velocityToPaceSecondsPerKm(vI_slow);
  const paceI_fast = velocityToPaceSecondsPerKm(vI_fast);

  const vR_slow = getVelocityFromVDOT(vdot, 1.05);
  const vR_fast = getVelocityFromVDOT(vdot, 1.10);
  const paceR_slow = velocityToPaceSecondsPerKm(vR_slow);
  const paceR_fast = velocityToPaceSecondsPerKm(vR_fast);

  return {
    easy: `${formatPaceMinSec(paceE_fast)} - ${formatPaceMinSec(paceE_slow)}`,
    marathon: `${formatPaceMinSec(paceM_fast)} - ${formatPaceMinSec(paceM_slow)}`,
    threshold: `${formatPaceMinSec(paceT_fast)} - ${formatPaceMinSec(paceT_slow)}`,
    interval: `${formatPaceMinSec(paceI_fast)} - ${formatPaceMinSec(paceI_slow)}`,
    repetition: `${formatPaceMinSec(paceR_fast)} - ${formatPaceMinSec(paceR_slow)}`
  };
}

function renderRunningTab() {
  const running = appState.running || {};
  const benchmark = running.benchmark || {
    name: 'Carrera de mañana (Martes)',
    distanceKm: 8.51,
    movingTimeSec: 2949,
    paceStr: '5:46/km',
    elevation: 8,
    heartRate: 154
  };

  const distMeters = (benchmark.distanceKm || 8.51) * 1000;
  const timeSeconds = benchmark.movingTimeSec || 2949;

  // 1. Calculate Daniels VDOT
  const vdot = calculateVDOT(distMeters, timeSeconds);
  const vdotFormatted = vdot.toFixed(1);

  // Update Benchmark HUD
  const vdotPill = document.getElementById('running-vdot-pill');
  if (vdotPill) vdotPill.innerText = `VDOT ${vdotFormatted}`;

  const benchName = document.getElementById('bench-activity-name');
  if (benchName) benchName.innerText = benchmark.name || 'Sesión de carrera';

  const benchDist = document.getElementById('bench-distance');
  if (benchDist) benchDist.innerHTML = `${benchmark.distanceKm} <span class="unit">KM</span>`;

  const benchTime = document.getElementById('bench-time');
  if (benchTime) benchTime.innerText = formatTimeHMS(timeSeconds);

  const benchPace = document.getElementById('bench-pace');
  if (benchPace) benchPace.innerText = benchmark.paceStr || `${formatPaceMinSec((timeSeconds / distMeters) * 1000)} /km`;

  const benchElev = document.getElementById('bench-elevation');
  if (benchElev) benchElev.innerText = `${benchmark.elevation || 8} m • ${benchmark.heartRate || 154} ppm`;

  // 2. Race Predictions (Half 21.097 km & Full Marathon 42.195 km)
  // Peter Riegel: exponent 1.06 for Half Marathon, 1.07 for Full Marathon (accounting for amateur marathon fatigue)
  const predHalfSeconds = predictRaceTimeRiegel(distMeters, timeSeconds, 21097, 1.06);
  const predFullSeconds = predictRaceTimeRiegel(distMeters, timeSeconds, 42195, 1.07);

  // Half Marathon metrics
  const halfPaceSec = predHalfSeconds / 21.097;
  const halfSpeedKmh = (21.097 / (predHalfSeconds / 3600)).toFixed(1);
  const halfSplit10 = formatTimeHMS(halfPaceSec * 10);

  const predHalfTimeEl = document.getElementById('pred-half-time');
  if (predHalfTimeEl) predHalfTimeEl.innerText = formatTimeHMS(predHalfSeconds);

  const predHalfPaceEl = document.getElementById('pred-half-pace');
  if (predHalfPaceEl) predHalfPaceEl.innerHTML = `${formatPaceMinSec(halfPaceSec)} <span class="unit">/km</span>`;

  const predHalfSpeedEl = document.getElementById('pred-half-speed');
  if (predHalfSpeedEl) predHalfSpeedEl.innerHTML = `${halfSpeedKmh} <span class="unit">KM/H</span>`;

  const predHalfSplit10El = document.getElementById('pred-half-split10');
  if (predHalfSplit10El) predHalfSplit10El.innerText = halfSplit10;

  // Full Marathon metrics
  const fullPaceSec = predFullSeconds / 42.195;
  const fullSpeedKmh = (42.195 / (predFullSeconds / 3600)).toFixed(1);
  const fullSplit21 = formatTimeHMS(fullPaceSec * 21.097);
  const fullSplit30 = formatTimeHMS(fullPaceSec * 30.0);

  const predFullTimeEl = document.getElementById('pred-full-time');
  if (predFullTimeEl) predFullTimeEl.innerText = formatTimeHMS(predFullSeconds);

  const predFullPaceEl = document.getElementById('pred-full-pace');
  if (predFullPaceEl) predFullPaceEl.innerHTML = `${formatPaceMinSec(fullPaceSec)} <span class="unit">/km</span>`;

  const predFullSpeedEl = document.getElementById('pred-full-speed');
  if (predFullSpeedEl) predFullSpeedEl.innerHTML = `${fullSpeedKmh} <span class="unit">KM/H</span>`;

  const predFullSplit21El = document.getElementById('pred-full-split21');
  if (predFullSplit21El) predFullSplit21El.innerText = fullSplit21;

  const predFullSplit30El = document.getElementById('pred-full-split30');
  if (predFullSplit30El) predFullSplit30El.innerText = fullSplit30;

  // 3. Weekly Volume & Fatigue Semaphore
  let weeklyRunningKm = 0;
  for (let i = 0; i < 7; i++) {
    const dayKey = getTodayKey(i);
    const dayData = appState.days[dayKey];
    if (dayData && dayData.stravaActivity && dayData.stravaActivity.distanceKm) {
      weeklyRunningKm += parseFloat(dayData.stravaActivity.distanceKm) || 0;
    }
  }

  // If no day has Strava data logged yet in state, show benchmark distance as active week sample
  if (weeklyRunningKm === 0 && benchmark.distanceKm) {
    weeklyRunningKm = benchmark.distanceKm;
  }

  const targetWeeklyKm = running.weeklyTargetKm || 44.0;
  const volumePct = Math.min(130, Math.round((weeklyRunningKm / targetWeeklyKm) * 100));

  const progressKmEl = document.getElementById('semaphore-progress-km');
  if (progressKmEl) {
    progressKmEl.innerHTML = `<strong>${weeklyRunningKm.toFixed(2)}</strong> / ${targetWeeklyKm.toFixed(2)} KM ACUMULADOS EN LA SEMANA`;
  }

  const progressPctEl = document.getElementById('semaphore-progress-pct');
  if (progressPctEl) {
    progressPctEl.innerText = `${volumePct}%`;
  }

  const fillBar = document.getElementById('semaphore-fill-bar');
  if (fillBar) {
    fillBar.style.width = `${Math.min(100, volumePct)}%`;
  }

  const statusPill = document.getElementById('semaphore-status-pill');
  const statusTxt = document.getElementById('semaphore-status-text');
  if (statusPill && statusTxt) {
    if (weeklyRunningKm < 35.0) {
      statusPill.style.background = '#3b82f6';
      statusPill.style.color = '#ffffff';
      statusTxt.innerText = `DESCARGA / INICIO (${volumePct}%)`;
    } else if (weeklyRunningKm >= 35.0 && weeklyRunningKm <= 46.0) {
      statusPill.style.background = 'var(--c-volt)';
      statusPill.style.color = '#000000';
      statusTxt.innerText = `ZONA ÓPTIMA MARATÓN (${volumePct}%)`;
    } else if (weeklyRunningKm > 46.0 && weeklyRunningKm <= 52.0) {
      statusPill.style.background = '#eab308';
      statusPill.style.color = '#000000';
      statusTxt.innerText = `ALTA CARGA SEMANAL (${volumePct}%)`;
    } else {
      statusPill.style.background = '#ef4444';
      statusPill.style.color = '#ffffff';
      statusTxt.innerText = `SOBRECARGA / FATIGA (${volumePct}%)`;
    }
  }

  // 4. Jack Daniels Training Paces
  const danielsPaces = getDanielsTrainingPaces(vdot);
  const danielsLbl = document.getElementById('daniels-vdot-lbl');
  if (danielsLbl) danielsLbl.innerText = vdotFormatted;

  const paceE = document.getElementById('pace-val-e');
  if (paceE) paceE.innerHTML = `${danielsPaces.easy} <span class="unit">/km</span>`;

  const paceM = document.getElementById('pace-val-m');
  if (paceM) paceM.innerHTML = `${danielsPaces.marathon} <span class="unit">/km</span>`;

  const paceT = document.getElementById('pace-val-t');
  if (paceT) paceT.innerHTML = `${danielsPaces.threshold} <span class="unit">/km</span>`;

  const paceI = document.getElementById('pace-val-i');
  if (paceI) paceI.innerHTML = `${danielsPaces.interval} <span class="unit">/km</span>`;

  const paceR = document.getElementById('pace-val-r');
  if (paceR) paceR.innerHTML = `${danielsPaces.repetition} <span class="unit">/km</span>`;
}

function initRunningModule() {
  renderRunningTab();

  // Button to trigger Strava sync from running view
  const btnSync = document.getElementById('btn-running-sync-strava');
  if (btnSync) {
    btnSync.addEventListener('click', () => {
      playCheckSound();
      openStravaModal();
    });
  }

  // Button to simulate Victor's real run
  const btnSim = document.getElementById('btn-running-simulate-run');
  if (btnSim) {
    btnSim.addEventListener('click', () => {
      simulateTodayRun();
      renderRunningTab();
      showToast('⚡ Sesión real de 8.51 km aplicada como benchmark activo');
    });
  }

  // Benchmark editor modal
  const btnEditBench = document.getElementById('btn-open-benchmark-editor');
  const benchModal = document.getElementById('benchmark-modal-overlay');
  const btnCloseBench = document.getElementById('btn-close-benchmark-modal');
  const btnCancelBench = document.getElementById('btn-cancel-benchmark');
  const btnSaveBench = document.getElementById('btn-save-benchmark');

  const distInp = document.getElementById('input-bench-dist');
  const minInp = document.getElementById('input-bench-min');
  const secInp = document.getElementById('input-bench-sec');

  if (btnEditBench && benchModal) {
    btnEditBench.addEventListener('click', () => {
      const bm = (appState.running && appState.running.benchmark) || {};
      if (distInp) distInp.value = bm.distanceKm || 8.51;
      const totalSec = bm.movingTimeSec || 2949;
      if (minInp) minInp.value = Math.floor(totalSec / 60);
      if (secInp) secInp.value = totalSec % 60;
      benchModal.classList.add('active');
    });
  }

  const closeBenchModal = () => {
    if (benchModal) benchModal.classList.remove('active');
  };

  if (btnCloseBench) btnCloseBench.addEventListener('click', closeBenchModal);
  if (btnCancelBench) btnCancelBench.addEventListener('click', closeBenchModal);

  // Presets in benchmark modal
  const presetToday = document.getElementById('btn-bench-preset-today');
  if (presetToday) {
    presetToday.addEventListener('click', () => {
      if (distInp) distInp.value = '8.51';
      if (minInp) minInp.value = '49';
      if (secInp) secInp.value = '9';
    });
  }

  const preset10k = document.getElementById('btn-bench-preset-10k');
  if (preset10k) {
    preset10k.addEventListener('click', () => {
      if (distInp) distInp.value = '10.00';
      if (minInp) minInp.value = '55';
      if (secInp) secInp.value = '0';
    });
  }

  const preset5k = document.getElementById('btn-bench-preset-5k');
  if (preset5k) {
    preset5k.addEventListener('click', () => {
      if (distInp) distInp.value = '5.00';
      if (minInp) minInp.value = '26';
      if (secInp) secInp.value = '30';
    });
  }

  // Save Benchmark
  if (btnSaveBench) {
    btnSaveBench.addEventListener('click', () => {
      const d = parseFloat(distInp?.value) || 8.51;
      const m = parseInt(minInp?.value) || 49;
      const s = parseInt(secInp?.value) || 0;
      const totalSec = (m * 60) + s;
      const paceSec = totalSec / d;

      if (!appState.running) appState.running = {};
      appState.running.benchmark = {
        name: `Test Personal (${d} km)`,
        distanceKm: d,
        movingTimeSec: totalSec,
        paceStr: `${formatPaceMinSec(paceSec)}/km`,
        elevation: 8,
        heartRate: 154
      };

      saveState(appState);
      renderRunningTab();
      closeBenchModal();
      playSuccessSound();
      showToast(`🎯 ¡PREDICCIONES RECALCULADAS CON ${d} KM EN ${m}:${String(s).padStart(2, '0')}!`);
    });
  }
}

// 9. TOAST HELPER
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  if (!toast || !toastMsg) return;

  toastMsg.innerText = msg;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// ==========================================================================
// 9B. STRAVA ENGINE & WORKOUT AUTO-VALIDATION
// ==========================================================================

function updateStravaHeaderBadge() {
  const btn = document.getElementById('btn-header-open-strava');
  const txt = document.getElementById('strava-header-text');
  if (!btn || !txt) return;

  const isConfigured = !!(appState.strava && appState.strava.token);
  if (isConfigured) {
    btn.classList.add('connected');
    txt.innerText = 'STRAVA OK ⚡';
  } else {
    btn.classList.remove('connected');
    txt.innerText = 'STRAVA';
  }
}

function renderStravaHUD(dayIndex) {
  const hud = document.getElementById('strava-activity-hud');
  if (!hud) return;

  const key = getTodayKey(dayIndex);
  const dayData = appState.days[key] || {};
  const act = dayData.stravaActivity;

  if (!act) {
    hud.style.display = 'none';
    hud.innerHTML = '';
    return;
  }

  hud.style.display = 'block';
  const effortPercent = Math.min(100, Math.round((act.effortRatio || 1) * 100));
  const plan = WORKOUT_PLANS[dayIndex] || {};
  const isSatisfied = effortPercent >= (appState.strava?.tolerance || 70);

  hud.innerHTML = `
    <div class="strava-hud-top">
      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
        <span class="strava-badge-tag">
          <svg class="svg-ico" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7.92 15.656h4.168"/></svg>
          STRAVA VERIFICADO
        </span>
        <span style="font-size:0.75rem; font-weight:800; color:var(--text-sub);">${act.name || 'SESIÓN EN RUTA'}</span>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="strava-effort-status" style="${isSatisfied ? '' : 'color:var(--c-orange); border-color:var(--c-orange);'}">
          ${isSatisfied ? '✔ ESFUERZO VÁLIDO' : 'PARCIAL'} (${effortPercent}%)
        </span>
        <button id="btn-remove-strava-link" title="Desvincular actividad" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; font-size:0.85rem; font-weight:900;">✕</button>
      </div>
    </div>

    <div class="strava-grid-stats">
      <div class="strava-stat-col">
        <span class="stat-lbl">DISTANCIA REAL</span>
        <span class="stat-val">${act.distanceKm} <span style="font-size:0.75rem;">KM</span></span>
      </div>
      <div class="strava-stat-col">
        <span class="stat-lbl">TIEMPO ACTIVO</span>
        <span class="stat-val">${act.durationStr}</span>
      </div>
      <div class="strava-stat-col">
        <span class="stat-lbl">RITMO MEDIO</span>
        <span class="stat-val">${act.paceStr}</span>
      </div>
      <div class="strava-stat-col">
        <span class="stat-lbl">DESNIVEL</span>
        <span class="stat-val">${act.elevation !== undefined ? act.elevation : 8} <span style="font-size:0.75rem;">M</span></span>
      </div>
      <div class="strava-stat-col">
        <span class="stat-lbl">CALORÍAS</span>
        <span class="stat-val" style="color:var(--c-orange);">${act.calories || 712} <span style="font-size:0.75rem;">KCAL</span></span>
      </div>
    </div>

    <div class="strava-bar-wrapper">
      <div class="strava-bar-labels">
        <span style="color:var(--c-volt);">LOGRADO: ${act.durationMinutes} MIN (${effortPercent}%)</span>
        <span style="color:var(--text-muted);">UMBRAL TOLERANCIA: ${appState.strava?.tolerance || 70}%</span>
      </div>
      <div class="strava-bar-track">
        <div class="strava-bar-fill" style="width: ${effortPercent}%;"></div>
      </div>
    </div>
  `;

  const btnRemove = document.getElementById('btn-remove-strava-link');
  if (btnRemove) {
    btnRemove.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('¿Desvincular los datos de Strava de este día?')) {
        delete dayData.stravaActivity;
        saveState(appState);
        renderStravaHUD(dayIndex);
        showToast('Actividad desvinculada');
      }
    });
  }
}

function applyStravaActivity(act, dayIndex = selectedDayIndex) {
  const key = getTodayKey(dayIndex);
  if (!appState.days[key]) appState.days[key] = {};
  const dayData = appState.days[key];

  const plan = WORKOUT_PLANS[dayIndex] || {};
  const targetKm = Number(plan.km) || 0;
  const targetMinutes = targetKm > 0 ? Math.round(targetKm * 5.5) : 60;

  const durationMin = Math.round((act.moving_time || act.elapsed_time || 0) / 60);
  const distanceKm = typeof act.distanceKm === 'string' ? act.distanceKm : ((act.distance || 0) / 1000).toFixed(2);

  // Rhythm (pace) calculation
  let paceStr = act.paceStr || '--:--';
  if (act.average_speed > 0) {
    const paceSec = 1000 / act.average_speed;
    const pMin = Math.floor(paceSec / 60);
    const pSec = Math.round(paceSec % 60);
    paceStr = `${pMin}:${String(pSec).padStart(2, '0')}/km`;
  } else if (parseFloat(distanceKm) > 0 && durationMin > 0) {
    const paceDecimal = durationMin / parseFloat(distanceKm);
    const pMin = Math.floor(paceDecimal);
    const pSec = Math.round((paceDecimal - pMin) * 60);
    paceStr = `${pMin}:${String(pSec).padStart(2, '0')}/km`;
  }

  // Calculate effort ratio
  let effortRatio = 1;
  if (targetKm > 0) {
    const distRatio = parseFloat(distanceKm) / targetKm;
    const timeRatio = durationMin / targetMinutes;
    effortRatio = Math.max(distRatio, timeRatio);
  } else {
    effortRatio = durationMin / targetMinutes;
  }

  const hours = Math.floor((act.moving_time || 0) / 3600);
  const minutes = Math.floor(((act.moving_time || 0) % 3600) / 60);
  const seconds = (act.moving_time || 0) % 60;
  const durationStr = act.durationStr || (hours > 0 
    ? `${hours}h ${String(minutes).padStart(2, '0')}m`
    : `${minutes}m ${String(seconds).padStart(2, '0')}s`);

  dayData.stravaActivity = {
    id: act.id,
    name: act.name || 'Carrera de mañana',
    distanceKm,
    durationMinutes: durationMin,
    durationStr,
    paceStr,
    elevation: act.elevation !== undefined ? act.elevation : (act.total_elevation_gain !== undefined ? act.total_elevation_gain : 8),
    calories: act.calories || (act.kilojoules ? Math.round(act.kilojoules * 0.239) : 712),
    effortRatio,
    date: act.start_date_local || new Date().toISOString()
  };

  const tolerance = (appState.strava?.tolerance || 70) / 100;
  const autoCheck = appState.strava?.autoCheck !== false;

  if (autoCheck && effortRatio >= tolerance) {
    dayData.workoutCompleted = true;
    playSuccessSound();
    showToast(`🔥 STRAVA REAL: ${distanceKm} KM a ${paceStr} (${Math.round(effortRatio * 100)}%) // ¡ENTRENO COMPLETADO!`);
  } else {
    playCheckSound();
    showToast(`⚡ STRAVA: ${distanceKm} km registrados (${Math.round(effortRatio * 100)}% del volumen)`);
  }

  // Actualizar marca de referencia en el módulo de Running si es una carrera válida
  if (parseFloat(distanceKm) >= 1.0) {
    if (!appState.running) appState.running = {};
    const totalSec = (act.moving_time || act.elapsed_time) || (durationMin * 60);
    appState.running.benchmark = {
      name: act.name || 'Carrera Strava',
      distanceKm: parseFloat(distanceKm),
      movingTimeSec: totalSec,
      paceStr: paceStr,
      elevation: act.elevation !== undefined ? act.elevation : (act.total_elevation_gain !== undefined ? act.total_elevation_gain : 8),
      heartRate: act.average_heartrate || 154
    };
    renderRunningTab();
  }

  saveState(appState);
  renderMission(dayIndex);
}

function simulateTodayRun() {
  // Datos 100% reales de la carrera de Víctor de hoy (Martes)
  const realRun = {
    id: 'strava_victor_real_run',
    name: 'Carrera de mañana',
    type: 'Run',
    distance: 8510, // 8.51 km exactos de su Strava
    distanceKm: '8.51',
    moving_time: 2949, // 49:09 exactos
    durationStr: '49m 09s',
    paceStr: '5:46/km',
    elevation: 8, // 8 m desnivel
    calories: 712 // 712 kcal
  };

  applyStravaActivity(realRun, 2);
  closeStravaModal();
}

async function fetchStravaActivities() {
  const token = (appState.strava && appState.strava.token) ? appState.strava.token : (document.getElementById('strava-token-input')?.value.trim());
  if (!token) {
    showToast('⚠️ Introduce tu Token de Strava o prueba la carrera de hoy');
    openStravaModal();
    return;
  }

  showToast('🔄 Conectando con Strava API...');
  try {
    const res = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=10', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      if (res.status === 401) throw new Error('Token inválido o no autorizado. Revisa tus credenciales.');
      throw new Error(`HTTP ${res.status}`);
    }

    const list = await res.json();
    if (!Array.isArray(list) || list.length === 0) {
      showToast('ℹ️ No se encontraron actividades recientes en Strava');
      return;
    }

    const run = list.find(a => (a.type === 'Run' || a.sport_type === 'Run')) || list[0];
    applyStravaActivity(run, selectedDayIndex);
    closeStravaModal();
  } catch (err) {
    console.error('Strava API error:', err);
    showToast(`❌ Error Strava: ${err.message}`);
  }
}

function openStravaModal() {
  const modal = document.getElementById('strava-modal-overlay');
  const tokenInput = document.getElementById('strava-token-input');
  const tolSelect = document.getElementById('strava-tolerance-select');
  const autoChk = document.getElementById('strava-autocheck-toggle');

  if (appState.strava) {
    if (tokenInput) tokenInput.value = appState.strava.token || '';
    if (tolSelect) tolSelect.value = appState.strava.tolerance || 70;
    if (autoChk) autoChk.checked = appState.strava.autoCheck !== false;
  }

  if (modal) modal.classList.add('active');
}

function closeStravaModal() {
  const modal = document.getElementById('strava-modal-overlay');
  if (modal) modal.classList.remove('active');
}

function initStravaModule() {
  const btnHeader = document.getElementById('btn-header-open-strava');
  const btnClose = document.getElementById('btn-close-strava-modal');
  const btnSave = document.getElementById('btn-save-strava-config');
  const btnDisconnect = document.getElementById('btn-strava-disconnect');
  const btnFetch = document.getElementById('btn-strava-fetch-now');
  const btnTodaySync = document.getElementById('btn-today-sync-strava');
  const btnSimulate = document.getElementById('btn-strava-simulate-today');
  const modalOverlay = document.getElementById('strava-modal-overlay');

  if (btnHeader) btnHeader.addEventListener('click', openStravaModal);
  if (btnClose) btnClose.addEventListener('click', closeStravaModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeStravaModal();
    });
  }

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const tokenInput = document.getElementById('strava-token-input');
      const tolSelect = document.getElementById('strava-tolerance-select');
      const autoChk = document.getElementById('strava-autocheck-toggle');

      if (!appState.strava) appState.strava = {};
      appState.strava.token = tokenInput ? tokenInput.value.trim() : '';
      appState.strava.tolerance = parseInt(tolSelect?.value || 70, 10);
      appState.strava.autoCheck = autoChk ? autoChk.checked : true;

      saveState(appState);
      updateStravaHeaderBadge();
      playSuccessSound();
      showToast('⚙️ CONFIGURACIÓN STRAVA GUARDADA');
      closeStravaModal();
    });
  }

  if (btnDisconnect) {
    btnDisconnect.addEventListener('click', () => {
      if (confirm('¿Desconectar y borrar tu token de Strava?')) {
        if (!appState.strava) appState.strava = {};
        appState.strava.token = '';
        const tokenInput = document.getElementById('strava-token-input');
        if (tokenInput) tokenInput.value = '';
        saveState(appState);
        updateStravaHeaderBadge();
        playCheckSound();
        showToast('Strava desconectado');
        closeStravaModal();
      }
    });
  }

  if (btnFetch) btnFetch.addEventListener('click', fetchStravaActivities);
  if (btnTodaySync) {
    btnTodaySync.addEventListener('click', () => {
      if (!appState.strava || !appState.strava.token) {
        openStravaModal();
      } else {
        fetchStravaActivities();
      }
    });
  }

  if (btnSimulate) btnSimulate.addEventListener('click', simulateTodayRun);

  // Asegurar que el día 2 (Martes) tenga los datos exactos y reales de la carrera de Víctor
  const tKey = getTodayKey(2);
  if (!appState.days[tKey]) appState.days[tKey] = {};
  if (!appState.days[tKey].stravaActivity || appState.days[tKey].stravaActivity.distanceKm !== '8.51') {
    appState.days[tKey].workoutCompleted = true;
    appState.days[tKey].stravaActivity = {
      id: 'strava_victor_real_1026',
      name: 'Carrera de mañana',
      distanceKm: '8.51',
      durationStr: '49m 09s',
      durationMinutes: 49,
      paceStr: '5:46/km',
      elevation: 8,
      calories: 712,
      effortRatio: 0.82,
      date: '2026-09-08T10:26:00'
    };
    saveState(appState);
  }

  updateStravaHeaderBadge();
}

// ==========================================================================
// 9C. AI NUTRITION ENGINE // ZERO DESPERDICIO
// ==========================================================================
let pendingGeneratedMeals = null;

function openAINutritionModal() {
  const modal = document.getElementById('ai-nutrition-modal-overlay');
  if (modal) modal.classList.add('active');
}

function closeAINutritionModal() {
  const modal = document.getElementById('ai-nutrition-modal-overlay');
  if (modal) modal.classList.remove('active');
}

function getSelectedIngredientsList() {
  const chips = document.querySelectorAll('#ai-ingredient-chips .ingredient-chip.selected');
  const selected = Array.from(chips).map(c => c.dataset.item);
  const custom = document.getElementById('ai-custom-ingredients-text')?.value || '';
  
  if (custom.trim()) {
    const extra = custom.split(',').map(s => s.trim()).filter(Boolean);
    selected.push(...extra);
  }
  return [...new Set(selected)];
}

function generateLocalAIMenu(ingredients, targetKcal = 2850, targetProtein = 150) {
  // Categorize selected ingredients
  const has = (keyword) => ingredients.some(i => i.toLowerCase().includes(keyword.toLowerCase()));

  // 1. Proteins
  const mainProteinLunch = has('Lomo') ? 'Lomo de cerdo a la plancha'
    : has('Picada') ? 'Carne picada magra vacuno/cerdo'
    : has('Pechuga') || has('Pollo') ? 'Pechuga de pollo a la plancha'
    : 'Lomo o Ternera magra';

  const mainProteinDinner = has('Atún') ? 'Atún claro al natural (2 latas)'
    : has('Lomo') ? 'Lomo de cerdo magro'
    : has('Huevos') ? 'Tortilla francesa de 3 huevos'
    : 'Atún o Pollo a la plancha';

  const snackProtein = has('Atún') ? '1 lata de Atún claro'
    : has('Pavo') ? '60g Pechuga de pavo'
    : has('Huevos') ? '2 huevos duros'
    : '50g fiambre magro';

  // 2. Carbs
  const mainCarbLunch = has('Arroz') ? '120 g crudo de Arroz redondo (300g cocido)'
    : has('Pasta') ? '120 g de Pasta'
    : has('Patatas') ? '450 g de Patatas cocidas/al horno'
    : '120 g Arroz o 400g Patatas';

  const mainCarbDinner = has('Patatas') ? '320 g Patatas cocidas con AOVE'
    : has('Pan Rústico') ? '90 g Pan Rústico tostado'
    : '300 g Patatas o Arroz';

  const breakfastBread = has('Pan Rústico') ? '110–120 g Pan Rústico tostado'
    : has('Avena') ? '80 g Copos de avena cocida'
    : '110 g Pan Rústico tostado';

  const morningSnackCarb = has('Tortitas') ? '4 uds (~35 g) Tortitas de arroz'
    : has('Plátano') ? '1 Plátano maduro'
    : '4 Tortitas de arroz';

  // 3. Extras
  const morningProtein = has('Pavo') ? '70 g Pechuga de pavo'
    : has('Jamón') ? '60 g Jamón serrano'
    : has('Huevos') ? '2 huevos revueltos'
    : '70 g Pavo o Jamón';

  const cheese = has('Queso') ? '35 g Queso tierno/semicurado de Mercadona' : '30 g Queso bajo en grasa';
  const gazpacho = has('Gazpacho') ? 'Gazpacho tradicional Mercadona' : 'Puré de verduras o ensalada';
  const whey = has('Whey') ? '1 cacito (30 g) Proteína Whey pura' : 'Batido proteico o claras';

  return {
    desayuno: {
      id: "meal_desayuno",
      name: "DESAYUNO // CARGA MATINAL ZERO-WASTE",
      time: "08:00 - 09:00",
      desc: `${breakfastBread} + 12ml AOVE + ${morningProtein} + ${cheese} + 1 Plátano`,
      items: [
        { qty: "110–120 g", text: `${breakfastBread} (rebanadas generosas)` },
        { qty: "12–15 ml", text: "Aceite de Oliva Virgen Extra (AOVE)" },
        { qty: "70 g", text: morningProtein },
        { qty: "35 g", text: cheese },
        { qty: "1 Plátano", text: "Plátano maduro (~120 g)" },
        { qty: "5 g + 2 perlas", text: "Creatina con agua + 2 perlas Omega 3" }
      ]
    },
    snack: {
      id: "meal_snack",
      name: "MEDIA MAÑANA // PRE-RUN ENERGÍA",
      time: "11:30 - 12:30",
      desc: `${morningSnackCarb} + ${snackProtein}`,
      items: [
        { qty: "4 uds (~35 g)", text: morningSnackCarb },
        { qty: "1 ración", text: snackProtein },
        { qty: "500 ml", text: "Agua mineral (iniciar hidratación de carrera)" }
      ]
    },
    comida: {
      id: "meal_comida",
      name: "COMIDA // COMBUSTIBLE PRINCIPAL",
      time: "14:00 - 15:00",
      desc: `${mainCarbLunch} + 180g ${mainProteinLunch} + 250ml Gazpacho + Olivas`,
      items: [
        { qty: "120 g crudo", text: mainCarbLunch },
        { qty: "180 g", text: `${mainProteinLunch} a la plancha` },
        { qty: "200–250 ml", text: `${gazpacho}` },
        { qty: "10–12 uds", text: "Olivas de Mercadona (grasas monoinsaturadas)" }
      ]
    },
    merienda: {
      id: "meal_merienda",
      name: "MERIENDA // RECUPERACIÓN ANABÓLICA",
      time: "18:00 - 19:00",
      desc: `${whey} + 1 Plátano grande o 4 tortitas`,
      items: [
        { qty: "1 cacito (30 g)", text: whey },
        { qty: "1 Plátano", text: "Plátano maduro (~120 g) O 4 tortitas de arroz" }
      ]
    },
    cena: {
      id: "meal_cena",
      name: "CENA // REPARACIÓN NOCHE",
      time: "21:30 - 22:30",
      desc: `${mainCarbDinner} + ${mainProteinDinner} + 200ml Gazpacho + 25g Queso`,
      items: [
        { qty: "300 g", text: mainCarbDinner },
        { qty: "160–180 g", text: mainProteinDinner },
        { qty: "200 ml", text: `${gazpacho}` },
        { qty: "25 g", text: cheese },
        { qty: "1 dosis", text: "Magnesio 45 min antes de dormir" }
      ]
    }
  };
}

async function runAINutritionEngine() {
  const ingredients = getSelectedIngredientsList();
  if (ingredients.length === 0) {
    showToast('⚠️ Selecciona al menos 3 o 4 ingredientes de tu compra');
    return;
  }

  const targetKcal = parseInt(document.getElementById('ai-target-calories')?.value || 2850, 10);
  const targetPro = parseInt(document.getElementById('ai-target-protein')?.value || 150, 10);
  const geminiKey = document.getElementById('ai-gemini-key')?.value.trim() || localStorage.getItem('virol_gemini_key') || '';

  const resultsBox = document.getElementById('ai-generation-results');
  const previewGrid = document.getElementById('ai-preview-grid-cards');
  const btnApply = document.getElementById('btn-apply-ai-meals');
  const summaryPill = document.getElementById('ai-result-summary-pill');

  showToast('🤖 Optimizando menú semanal con tu compra...');

  let generated = null;

  if (geminiKey) {
    try {
      showToast('☁️ Invocando Gemini AI para recetas gourmet...');
      const prompt = `Eres un nutricionista deportivo de élite para un maratoniano de 73 kg preparando la Maratón de Valencia.
Objetivo: Generar un menú diario con 5 comidas (desayuno, snack, comida, merienda, cena) alcanzando exactamente ~${targetKcal} kcal y ~${targetPro}g de proteína.
CRUCIAL: Debes utilizar ÚNICAMENTE o prioritariamente los siguientes ingredientes de su compra:
${ingredients.join(', ')}.
Devuelve estrictamente un JSON válido con este formato:
{
  "desayuno": { "name": "...", "time": "08:00 - 09:00", "desc": "...", "items": [{"qty": "...", "text": "..."}] },
  "snack": { "name": "...", "time": "11:30 - 12:30", "desc": "...", "items": [{"qty": "...", "text": "..."}] },
  "comida": { "name": "...", "time": "14:00 - 15:00", "desc": "...", "items": [{"qty": "...", "text": "..."}] },
  "merienda": { "name": "...", "time": "18:00 - 19:00", "desc": "...", "items": [{"qty": "...", "text": "..."}] },
  "cena": { "name": "...", "time": "21:30 - 22:30", "desc": "...", "items": [{"qty": "...", "text": "..."}] }
}`;

      let res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (!res.ok) {
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });
      }

      if (res.ok) {
        const data = await res.json();
        const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          generated = JSON.parse(rawJson);
        }
      }
    } catch (e) {
      console.warn('Gemini API call fell back to local macro engine:', e);
    }
  }

  // If no Gemini key or Gemini fallback, use local zero-waste algorithmic engine
  if (!generated) {
    generated = generateLocalAIMenu(ingredients, targetKcal, targetPro);
  }

  pendingGeneratedMeals = generated;

  // Render preview
  if (previewGrid) {
    const mealKeys = ['desayuno', 'snack', 'comida', 'merienda', 'cena'];
    previewGrid.innerHTML = mealKeys.map(k => {
      const m = generated[k];
      if (!m) return '';
      const itemsHtml = (m.items || []).map(it => `
        <li><span class="g-qty">${it.qty || ''}</span> <span>${it.text || it}</span></li>
      `).join('');

      return `
        <div class="ai-meal-preview-card">
          <div class="ai-meal-head">
            <span class="ai-meal-name">${m.name}</span>
            <span class="ai-meal-time">${m.time}</span>
          </div>
          <p style="font-size:0.75rem; color:var(--text-sub); margin-bottom:8px;">${m.desc}</p>
          <ul class="ai-meal-items-list">
            ${itemsHtml}
          </ul>
        </div>
      `;
    }).join('');
  }

  if (summaryPill) summaryPill.innerText = `~${targetKcal} KCAL • ${targetPro}G PRO • ZERO DESPERDICIO`;
  if (resultsBox) resultsBox.style.display = 'block';
  if (btnApply) btnApply.style.display = 'inline-block';

  playSuccessSound();
  showToast('✨ ¡MENÚ IA GENERADO CON ÉXITO! REVISA Y PULSA APLICAR');
}

function initAINutritionModule() {
  const btnOpenBanner = document.getElementById('btn-open-ai-nutrition');
  const btnOpenHead = document.getElementById('btn-open-ai-nutrition-head');
  const btnClose = document.getElementById('btn-close-ai-modal');
  const btnCancel = document.getElementById('btn-cancel-ai');
  const modalOverlay = document.getElementById('ai-nutrition-modal-overlay');
  const btnRun = document.getElementById('btn-run-ai-generation');
  const btnApply = document.getElementById('btn-apply-ai-meals');
  const btnLoadMarket = document.getElementById('btn-ai-load-market-list');

  // ── Open & Close ─────────────────────────────────────────────
  if (btnOpenBanner) btnOpenBanner.addEventListener('click', openAINutritionModal);
  if (btnOpenHead)   btnOpenHead.addEventListener('click', openAINutritionModal);
  if (btnClose)      btnClose.addEventListener('click', closeAINutritionModal);
  if (btnCancel)     btnCancel.addEventListener('click', closeAINutritionModal);
  if (modalOverlay)  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeAINutritionModal(); });

  // ── Gemini Key: cargar de localStorage al abrir ───────────────
  const geminiInput = document.getElementById('ai-gemini-key');
  const keyBadge = document.getElementById('ai-key-status-badge');
  const savedKey = localStorage.getItem('virol_gemini_key') || '';
  if (geminiInput && savedKey) {
    geminiInput.value = savedKey;
    if (keyBadge) { keyBadge.textContent = '✅ GUARDADA'; keyBadge.style.background = 'rgba(50,215,75,0.18)'; keyBadge.style.color = '#32D74B'; }
  }
  const btnSaveKey = document.getElementById('btn-save-gemini-key');
  if (btnSaveKey) {
    btnSaveKey.addEventListener('click', () => {
      const val = geminiInput?.value.trim() || '';
      if (!val) { showToast('⚠️ Pega tu clave API de Gemini antes de guardar'); return; }
      localStorage.setItem('virol_gemini_key', val);
      if (keyBadge) { keyBadge.textContent = '✅ GUARDADA'; keyBadge.style.background = 'rgba(50,215,75,0.18)'; keyBadge.style.color = '#32D74B'; }
      showToast('🔑 ¡Clave Gemini guardada en tu dispositivo!');
      playSuccessSound();
    });
  }

  // ── Helper: crear un chip editable ───────────────────────────
  function createChip(label, itemValue, selected = false) {
    const span = document.createElement('span');
    span.className = 'ingredient-chip' + (selected ? ' selected' : '');
    span.dataset.item = itemValue || label;
    span.innerHTML = `${label} <span class="chip-remove" title="Quitar">✕</span>`;

    // Click en el chip → toggle selected
    span.addEventListener('click', (e) => {
      if (e.target.classList.contains('chip-remove')) {
        span.remove();
        playCheckSound();
        return;
      }
      span.classList.toggle('selected');
      playCheckSound();
    });
    return span;
  }

  // Añadir listeners chip-remove a los chips ya existentes en el HTML
  function bindExistingChips() {
    document.querySelectorAll('#ai-ingredient-chips .ingredient-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        if (e.target.classList.contains('chip-remove')) { chip.remove(); playCheckSound(); return; }
        chip.classList.toggle('selected');
        playCheckSound();
      });
    });
  }
  bindExistingChips();

  // ── Seleccionar todos / Vaciar ────────────────────────────────
  if (btnLoadMarket) {
    btnLoadMarket.addEventListener('click', () => {
      document.querySelectorAll('#ai-ingredient-chips .ingredient-chip').forEach(c => c.classList.add('selected'));
      playCheckSound();
      showToast('🛒 ¡TODOS LOS PRODUCTOS SELECCIONADOS!');
    });
  }
  const btnClear = document.getElementById('btn-ai-clear-chips');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      document.querySelectorAll('#ai-ingredient-chips .ingredient-chip').forEach(c => c.classList.remove('selected'));
      playCheckSound();
      showToast('🗑️ Lista vaciada. Selecciona los que tienes.');
    });
  }

  // ── Añadir nuevo producto ─────────────────────────────────────
  const btnAddIngredient = document.getElementById('btn-ai-add-ingredient');
  const addRow = document.getElementById('ai-add-ingredient-row');
  const newIngInput = document.getElementById('ai-new-ingredient-input');
  const btnConfirmAdd = document.getElementById('btn-ai-confirm-add');
  const chipsContainer = document.getElementById('ai-ingredient-chips');

  if (btnAddIngredient && addRow) {
    btnAddIngredient.addEventListener('click', () => {
      addRow.classList.toggle('visible');
      if (newIngInput && addRow.classList.contains('visible')) newIngInput.focus();
    });
  }

  function confirmAddChip() {
    const val = newIngInput?.value.trim();
    if (!val) return;
    const chip = createChip(val, val, true);
    chipsContainer?.appendChild(chip);
    newIngInput.value = '';
    addRow.classList.remove('visible');
    playSuccessSound();
    showToast(`✅ "${val}" añadido a tu lista`);
  }

  if (btnConfirmAdd) btnConfirmAdd.addEventListener('click', confirmAddChip);
  if (newIngInput) {
    newIngInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); confirmAddChip(); } });
  }

  // ── Recomendaciones de compra IA ─────────────────────────────
  const btnShoppingRecs = document.getElementById('btn-ai-shopping-recs');
  const recsPanel = document.getElementById('ai-shopping-recs-panel');
  const recsContent = document.getElementById('ai-shopping-recs-content');
  const btnCloseRecs = document.getElementById('btn-close-shopping-recs');
  const btnAddRecs = document.getElementById('btn-add-recs-to-list');

  let pendingRecsItems = [];

  if (btnCloseRecs && recsPanel) {
    btnCloseRecs.addEventListener('click', () => { recsPanel.style.display = 'none'; });
  }

  if (btnShoppingRecs) {
    btnShoppingRecs.addEventListener('click', async () => {
      if (!recsPanel || !recsContent) return;

      const ingredients = getSelectedIngredientsList();
      const key = localStorage.getItem('virol_gemini_key') || geminiInput?.value.trim();

      recsPanel.style.display = 'block';
      recsContent.innerHTML = '<span style="color:var(--c-volt);">⏳ Analizando tu lista y generando recomendaciones...</span>';
      if (btnAddRecs) btnAddRecs.style.display = 'none';
      pendingRecsItems = [];

      if (key) {
        // Recomendaciones con Gemini
        try {
          const prompt = `Eres un nutricionista deportivo experto en running y maratón.
Un corredor de 73 kg prepara la Maratón de Valencia y actualmente tiene estos ingredientes en casa:
${ingredients.join(', ')}.

Analiza su lista y recomiéndame exactamente 6-8 productos que le FALTAN o que mejorarían notablemente su nutrición deportiva (recuperación, hidratación, proteína, carbohidratos de calidad, micronutrientes).
IMPORTANTE: Solo recomienda productos que se vendan habitualmente en Mercadona o supermercados similares.
Sé conciso y práctico. Devuelve un JSON con este formato:
{
  "recommendations": [
    {"product": "nombre del producto", "reason": "por qué lo necesita (máx 1 frase)", "category": "Proteína|Carbohidrato|Grasa|Hidratación|Micronutriente|Suplemento"},
    ...
  ],
  "summary": "Breve resumen de las carencias principales (1-2 frases)"
}`;

          let res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json' }
            })
          });

          if (!res.ok) {
            res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${key}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: 'application/json' }
              })
            });
          }

          if (res.ok) {
            const data = await res.json();
            const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawJson) {
              const parsed = JSON.parse(rawJson);
              const recs = parsed.recommendations || [];
              pendingRecsItems = recs.map(r => r.product);

              const categoryColors = {
                'Proteína': '#FF5A00', 'Carbohidrato': '#C8FF00', 'Grasa': '#FFD60A',
                'Hidratación': '#5AC8FA', 'Micronutriente': '#BF5AF2', 'Suplemento': '#FF375F'
              };

              recsContent.innerHTML = `
                ${parsed.summary ? `<p style="margin:0 0 10px; font-style:italic; color:var(--text-muted);">${parsed.summary}</p>` : ''}
                <div style="display:flex; flex-direction:column; gap:6px;">
                  ${recs.map(r => `
                    <div style="display:flex; align-items:flex-start; gap:8px; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
                      <span style="background:${categoryColors[r.category] || '#888'}22; color:${categoryColors[r.category] || '#888'}; font-size:0.6rem; font-weight:700; padding:2px 6px; border-radius:20px; white-space:nowrap; margin-top:2px;">${r.category}</span>
                      <div><strong style="color:#fff;">${r.product}</strong><br><span style="color:var(--text-muted);">${r.reason}</span></div>
                    </div>
                  `).join('')}
                </div>
              `;
              if (btnAddRecs && pendingRecsItems.length > 0) btnAddRecs.style.display = 'block';
            }
          } else throw new Error('Gemini no disponible');

        } catch (e) {
          // Fallback local
          renderLocalShoppingRecs(ingredients, recsContent, btnAddRecs);
        }
      } else {
        // Sin clave: recomendaciones locales inteligentes
        renderLocalShoppingRecs(ingredients, recsContent, btnAddRecs);
      }
    });
  }

  function renderLocalShoppingRecs(ingredients, container, addBtn) {
    const has = (kw) => ingredients.some(i => i.toLowerCase().includes(kw.toLowerCase()));
    const recs = [];
    if (!has('Claras')) recs.push({ product: 'Claras de huevo en brik', reason: 'Proteína pura de alto valor biológico para el desayuno o postentreno.', category: 'Proteína' });
    if (!has('Avena')) recs.push({ product: 'Copos de avena', reason: 'Carbohidrato de absorción lenta, ideal para el desayuno del día de carrera.', category: 'Carbohidrato' });
    if (!has('Yogur')) recs.push({ product: 'Yogur griego 0%', reason: 'Caseína natural para la recuperación nocturna y microbiota intestinal.', category: 'Proteína' });
    if (!has('Arándano') && !has('Fruta')) recs.push({ product: 'Arándanos o fresas', reason: 'Antioxidantes y vitamina C para reducir inflamación post-entreno.', category: 'Micronutriente' });
    if (!has('Frutos secos') && !has('Almendra') && !has('Nuez')) recs.push({ product: 'Nueces o almendras crudas', reason: 'Omega-3 vegetal y grasas saludables para articulaciones y hormonas.', category: 'Grasa' });
    if (!has('Magnesio') && !has('suplemento')) recs.push({ product: 'Magnesio (bisglicinato o citrato)', reason: 'Esencial para el sueño profundo y la contracción muscular.', category: 'Suplemento' });
    if (!has('Bebida isotónica') && !has('Electro')) recs.push({ product: 'Electrolitos / Bebida isotónica', reason: 'Imprescindible para hidratación en rodajes largos de más de 10 km.', category: 'Hidratación' });
    if (!has('Miel')) recs.push({ product: 'Miel de flores o dátiles', reason: 'Azúcar de absorción rápida para la hora previa a la carrera.', category: 'Carbohidrato' });

    pendingRecsItems = recs.map(r => r.product);
    const catColors = { 'Proteína': '#FF5A00', 'Carbohidrato': '#C8FF00', 'Grasa': '#FFD60A', 'Hidratación': '#5AC8FA', 'Micronutriente': '#BF5AF2', 'Suplemento': '#FF375F' };

    container.innerHTML = `
      <p style="margin:0 0 10px; font-style:italic; color:var(--text-muted);">Basado en tu lista actual, te faltan estos productos clave para optimizar tu rendimiento:</p>
      <div style="display:flex; flex-direction:column; gap:6px;">
        ${recs.map(r => `
          <div style="display:flex; align-items:flex-start; gap:8px; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
            <span style="background:${catColors[r.category] || '#888'}22; color:${catColors[r.category] || '#888'}; font-size:0.6rem; font-weight:700; padding:2px 6px; border-radius:20px; white-space:nowrap; margin-top:2px;">${r.category}</span>
            <div><strong style="color:#fff;">${r.product}</strong><br><span style="color:var(--text-muted);">${r.reason}</span></div>
          </div>
        `).join('')}
      </div>
      <p style="margin-top:8px; font-size:0.7rem; color:var(--text-muted);">💡 Añade tu clave Gemini para recomendaciones personalizadas con IA real.</p>
    `;
    if (addBtn && recs.length > 0) addBtn.style.display = 'block';
  }

  // Añadir recomendaciones como chips nuevos
  if (btnAddRecs) {
    btnAddRecs.addEventListener('click', () => {
      if (!pendingRecsItems.length || !chipsContainer) return;
      let added = 0;
      pendingRecsItems.forEach(prod => {
        // No duplicar
        const exists = [...chipsContainer.querySelectorAll('.ingredient-chip')].some(c => c.dataset.item === prod);
        if (!exists) { chipsContainer.appendChild(createChip(prod, prod, false)); added++; }
      });
      if (recsPanel) recsPanel.style.display = 'none';
      showToast(`✅ ${added} producto${added !== 1 ? 's' : ''} añadido${added !== 1 ? 's' : ''} a tu lista`);
      playSuccessSound();
    });
  }

  // ── Run AI Generation ─────────────────────────────────────────
  if (btnRun) btnRun.addEventListener('click', runAINutritionEngine);

  // ── Apply Generated Meals ─────────────────────────────────────
  if (btnApply) {
    btnApply.addEventListener('click', () => {
      if (!pendingGeneratedMeals) return;
      appState.customMeals = pendingGeneratedMeals;
      saveState(appState);
      playSuccessSound();
      renderMealsTab();
      renderMealChecklist(selectedDayIndex);
      updateProgressHUD(selectedDayIndex);
      closeAINutritionModal();
      showToast('🚀 ¡NUEVO MENÚ IA APLICADO A TU APP Y SINCRONIZADO!');
    });
  }
}

// ─── 9B. AI WEEKLY REVIEW // COACH IA // VALENCIA 42K ─────────
function initAIWeeklyReviewModule() {
  const btnTrigger = document.getElementById('btn-trigger-weekly-ai');
  const spinner = document.getElementById('ai-review-btn-spinner');
  const btnText = document.getElementById('ai-review-btn-text');
  const placeholder = document.getElementById('ai-weekly-body-placeholder');
  const resultsContainer = document.getElementById('ai-weekly-results');

  if (!btnTrigger) return;

  btnTrigger.addEventListener('click', async () => {
    playCheckSound();

    btnTrigger.disabled = true;
    if (spinner) spinner.style.display = 'inline-block';
    if (btnText) btnText.textContent = 'ANALIZANDO SEMANA...';

    let totalKmDone = 0;
    let sessionsDone = 0;
    let sleepSum = 0;
    let rpeSum = 0;
    let rpeCount = 0;
    const recentSessions = [];

    [1, 2, 3, 4, 5, 6, 0].forEach(d => {
      const key = getTodayKey(d);
      const dayData = (appState.days && appState.days[key]) || {};
      const plan = (typeof WORKOUT_PLANS !== 'undefined' && WORKOUT_PLANS[d]) || {};
      const done = !!dayData.workoutCompleted;
      const km = parseFloat(plan.km || 0);

      if (done) {
        totalKmDone += km;
        sessionsDone++;
      }
      const sleep = parseFloat(dayData.sleepHours || 7.5);
      sleepSum += sleep;

      if (dayData.rpe) {
        rpeSum += parseFloat(dayData.rpe);
        rpeCount++;
      }

      recentSessions.push({
        dia: plan.dayName || `Día ${d}`,
        disciplina: plan.discipline || 'Entrenamiento',
        completado: done,
        km_objetivo: km,
        sueno_horas: sleep
      });
    });

    const targetKm = (typeof TARGET_KM !== 'undefined' ? TARGET_KM : 44);
    const avgSleep = (sleepSum / 7).toFixed(1);
    const avgRPE = rpeCount > 0 ? (rpeSum / rpeCount).toFixed(1) : 6.5;

    const payload = {
      totalKmDone,
      targetKm,
      avgSleep: parseFloat(avgSleep),
      avgRPE: parseFloat(avgRPE),
      recentSessions
    };

    let data = null;

    // 1. Llamada a endpoint Cloudflare Worker
    try {
      const workerUrl = window.location.origin.includes('workers.dev')
        ? '/api/ai/weekly-review'
        : 'https://virol.v-roiglo1991.workers.dev/api/ai/weekly-review';

      const res = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        data = await res.json();
      } else {
        console.warn('Worker weekly review devolvió status:', res.status);
      }
    } catch (netErr) {
      console.warn('Error conectando a Cloudflare Worker:', netErr);
    }

    // 2. Respaldo directo si no responde Worker y hay clave local
    if (!data || !data.analysis) {
      const localKey = localStorage.getItem('virol_gemini_key') || '';
      if (localKey) {
        try {
          const systemPrompt = `Eres un entrenador de atletismo de élite y fisiólogo deportivo especializado en maratón (Valencia 42K). Analiza los datos de Víctor y devuelve un JSON válido con: status_badge (ÓPTIMO/ATENCIÓN/DESCARGA), fatigue_score (1-100), injury_risk (BAJO/MEDIO/ALTO), summary_headline, weekly_diagnosis, actionable_adjustments (array de 3 strings) y nutrition_focus.`;
          const userPrompt = `Objetivo: ${targetKm}km. Realizados: ${totalKmDone}km. Sueño: ${avgSleep}h/noche. RPE: ${avgRPE}. Sesiones: ${JSON.stringify(recentSessions)}.`;

          const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${localKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemPrompt }] },
              contents: [{ parts: [{ text: userPrompt }] }],
              generationConfig: { responseMimeType: 'application/json' }
            })
          });
          if (gRes.ok) {
            const gData = await gRes.json();
            const analysis = JSON.parse(gData.candidates[0].content.parts[0].text);
            data = {
              metrics: {
                totalKmDone,
                targetKm,
                completionPct: Math.round((totalKmDone / (targetKm || 1)) * 100),
                avgSleep,
                avgRPE
              },
              analysis
            };
          }
        } catch (e) {
          console.warn('Fallback Gemini local error:', e);
        }
      }
    }

    // 3. Respaldo fisiológico algorítmico si no hay red ni API key
    if (!data || !data.analysis) {
      const pct = Math.round((totalKmDone / (targetKm || 1)) * 100);
      const isFatigued = parseFloat(avgSleep) < 7.0 || parseFloat(avgRPE) >= 7.5;
      data = {
        metrics: {
          totalKmDone,
          targetKm,
          completionPct: pct,
          avgSleep,
          avgRPE
        },
        analysis: {
          status_badge: isFatigued ? 'ATENCIÓN' : (pct >= 85 ? 'ÓPTIMO' : 'ATENCIÓN'),
          fatigue_score: isFatigued ? 68 : 42,
          injury_risk: isFatigued ? 'MEDIO' : 'BAJO',
          summary_headline: pct >= 80 
            ? 'VOLUMEN CONSISTENTE // VIGILAR RECUPERACIÓN NOCTURNA' 
            : 'ASIMILACIÓN EN PROCESO // PRIORIZAR TIRADA LARGA',
          weekly_diagnosis: `Has completado ${totalKmDone} km de ${targetKm} km planificados (${pct}%). Con una media de descanso de ${avgSleep} horas, la asimilación aeróbica es adecuada pero requiere atención en el sóleo y tendón de Aquiles.`,
          actionable_adjustments: [
            'Mantener el ritmo regenerativo (Z2) 15-20 seg más lento si el RPE supera 6.',
            'Dedicar 10 min de foam roller y movilidad de tobillo antes de cada sesión.',
            'Asegurar un mínimo de 7.5 horas de sueño en la víspera de la tirada larga.'
          ],
          nutrition_focus: 'Cargar 4g/kg de hidratos de absorción lenta 24h antes del rodaje largo y asegurar aporte de sales.'
        }
      };
    }

    // 4. Renderizado visual Neobrutalista
    const a = data.analysis;
    const m = data.metrics;
    const statusClass = a.status_badge === 'ÓPTIMO' 
      ? 'ai-status-optimo' 
      : (a.status_badge === 'DESCARGA' ? 'ai-status-descarga' : 'ai-status-atencion');

    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="ai-results-strip">
          <span class="ai-status-pill ${statusClass}">● ${a.status_badge}</span>
          <span class="ai-fatigue-pill">⚡ FATIGA: <strong>${a.fatigue_score}/100</strong></span>
          <span class="ai-injury-pill">🛡️ RIESGO: <strong>${a.injury_risk}</strong></span>
          <span class="ai-injury-pill" style="border-color:var(--c-volt); color:var(--c-volt);">🏃 ${m.totalKmDone}/${m.targetKm} KM (${m.completionPct}%)</span>
          <span class="ai-injury-pill">💤 SUEÑO: ${m.avgSleep}h</span>
        </div>

        <h4 class="ai-headline-box">${a.summary_headline}</h4>
        <p class="ai-diagnosis-text">${a.weekly_diagnosis}</p>

        <div style="margin-top:14px;">
          <span style="font-family:var(--font-mono); font-size:0.75rem; font-weight:900; color:var(--c-volt); display:block; margin-bottom:8px; text-transform:uppercase;">🔧 3 AJUSTES ACCIONABLES PARA LA SEMANA:</span>
          <div class="ai-adjustments-grid">
            ${(a.actionable_adjustments || []).map((adj, idx) => `
              <div class="ai-adj-card">
                <span class="ai-adj-num">${idx + 1}</span>
                <span>${adj}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="ai-nutrition-callout">
          <span style="font-size:1.2rem;">🍌</span>
          <div>
            <strong>ENFOQUE NUTRICIONAL:</strong> ${a.nutrition_focus}
          </div>
        </div>
      `;

      if (placeholder) placeholder.style.display = 'none';
      resultsContainer.style.display = 'block';
    }

    btnTrigger.disabled = false;
    if (spinner) spinner.style.display = 'none';
    if (btnText) btnText.textContent = '🔄 RE-ANALIZAR SEMANA';

    playSuccessSound();
    showToast('🧠 ¡ANÁLISIS SEMANAL IA COMPLETADO!');
  });
}

// 10. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  // Render profile HUD
  renderProfileHUD();

  // Apply visual theme
  applyTheme(appState.themeSetting || 'auto');

  // Sound toggle button
  const soundBtn = document.getElementById('btn-sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  if (soundBtn && soundIcon) {
    soundIcon.innerText = appState.soundEnabled ? '🔊' : '🔇';
    soundBtn.addEventListener('click', () => {
      appState.soundEnabled = !appState.soundEnabled;
      saveState(appState);
      soundIcon.innerText = appState.soundEnabled ? '🔊' : '🔇';
      showToast(appState.soundEnabled ? '🔊 SONIDO TÁCTIL ACTIVADO' : '🔇 SONIDO SILENCIADO');
    });
  }

  // Theme button
  const themeBtn = document.getElementById('btn-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', cycleTheme);
  }

  // Countdowns
  updateCountdowns();
  setInterval(updateCountdowns, 60000);

  // Day pills
  const pills = document.querySelectorAll('.day-pill');
  pills.forEach(p => {
    const day = parseInt(p.dataset.day, 10);
    if (day === selectedDayIndex) {
      p.classList.add('active');
    }
    p.addEventListener('click', () => {
      pills.forEach(pill => pill.classList.remove('active'));
      p.classList.add('active');
      selectedDayIndex = day;
      renderMission(selectedDayIndex);
      playCheckSound();
    });
  });

  // Render current mission
  renderMission(selectedDayIndex);
  renderHistory();
  renderMealsTab();
  renderScheduleCards();
  initPlanEditor();
  initStravaModule();
  initAINutritionModule();
  initAIWeeklyReviewModule();
  initAlarmsModule();
  initRunningModule();

  // Tab navigation helper
  window.switchToTab = function(targetTabId) {
    const navBtns = document.querySelectorAll('.nav-btn');
    const panes = document.querySelectorAll('.tab-pane');
    navBtns.forEach(b => {
      if (b.dataset.tab === targetTabId) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
    panes.forEach(p => {
      if (p.id === targetTabId) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Tab navigation
  const navBtns = document.querySelectorAll('.nav-btn');
  const panes = document.querySelectorAll('.tab-pane');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      window.switchToTab(targetTab);
      playCheckSound();
    });
  });

  // Countdown cards linking to Running tab
  const cardHalf = document.getElementById('card-trigger-half-marathon');
  if (cardHalf) {
    cardHalf.addEventListener('click', () => {
      window.switchToTab('tab-running');
      playCheckSound();
      showToast('🏃 PREVISIONES: Media Maratón de Valencia (21.097 km)');
    });
  }

  const cardFull = document.getElementById('card-trigger-full-marathon');
  if (cardFull) {
    cardFull.addEventListener('click', () => {
      window.switchToTab('tab-running');
      playCheckSound();
      showToast('🔥 PREVISIONES: Gran Maratón de Valencia (42.195 km)');
    });
  }

  // Workout complete toggle
  const toggleWorkoutBtn = document.getElementById('btn-toggle-workout');
  if (toggleWorkoutBtn) {
    toggleWorkoutBtn.addEventListener('click', () => {
      const key = getTodayKey(selectedDayIndex);
      if (!appState.days[key]) appState.days[key] = {};

      const currentStatus = !!appState.days[key].workoutCompleted;
      appState.days[key].workoutCompleted = !currentStatus;
      saveState(appState);
      renderMission(selectedDayIndex);

      if (!currentStatus) {
        playSuccessSound();
        showToast(`⚡ ¡ENTRENO DE ${WORKOUT_PLANS[selectedDayIndex].name} COMPLETADO, VÍCTOR!`);
      } else {
        playCheckSound();
}
    });
  }

  // Supplement Checkboxes
  renderMercadonaList();

  const btnCustomMarket = document.getElementById('btn-add-custom-market-item');
  if (btnCustomMarket) {
    btnCustomMarket.addEventListener('click', () => {
      const name = prompt('Nombre del producto para la lista de Mercadona:');
      if (!name || !name.trim()) return;
      const weight = prompt('Cantidad o peso (ej: 1 kg, 6 latas, 2 uds, 500g):', '1 ud') || '';
      const mList = getMercadonaList();
      mList.fresh.items.push({ name: name.trim(), weight: weight.trim(), checked: false });
      saveState(appState);
      renderMercadonaList();
      showToast(`🛒 AÑADIDO: ${name.trim()}`);
    });
  }

  const copyBtn = document.getElementById('btn-copy-market');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      playCheckSound();
      const mList = getMercadonaList();
      let listText = `🛒 LISTA DE LA COMPRA MERCADONA (VÍCTOR 73KG):\n`;
      for (const cat of Object.values(mList)) {
        listText += `\n📌 ${cat.title}:\n`;
        (cat.items || []).forEach(it => {
          listText += `- [${it.checked ? 'X' : ' '}] ${it.name} (${it.weight || ''})\n`;
        });
      }

      if (navigator.clipboard) {
        navigator.clipboard.writeText(listText).then(() => {
          showToast('📋 ¡LISTA DE MERCADONA COPIADA AL PORTAPAPELES!');
        }).catch(() => {
          showToast('📋 Lista copiada');
        });
      } else {
        showToast('📋 Lista lista');
      }
    });
  }

  // Archive week button
  const archiveBtn = document.getElementById('btn-archive-week');
  if (archiveBtn) {
    archiveBtn.addEventListener('click', archiveCurrentWeek);
  }

  // Alarm interval check
  setInterval(checkAlarms, 30000);

  // Cloud sync manual trigger & background listeners
  const syncBadge = document.getElementById('sync-status-badge');
  if (syncBadge) {
    syncBadge.addEventListener('click', () => {
      playCheckSound();
      syncFromCloud(false);
    });
  }

  // Automatic sync when switching back to the app from mobile or another tab
  window.addEventListener('focus', () => syncFromCloud(true));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) syncFromCloud(true);
  });
  window.addEventListener('online', () => syncFromCloud(false));

  // Periodic background check every 12 seconds
  setInterval(() => syncFromCloud(true), 12000);

  // Initial cloud sync on startup
  syncFromCloud(false);

  // Register PWA Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.log('SW registration note:', err);
    });
  }

  // Init Chatbot
  initChatbot();
});

// ==========================================================================
// RENDERIZADOR DINÁMICO DE MERCADONA
// ==========================================================================
function renderMercadonaList() {
  const container = document.getElementById('market-categories-container');
  if (!container) return;

  const mList = getMercadonaList();
  
  let html = '';
  for (const [catKey, catData] of Object.entries(mList)) {
    const isSupp = catKey === 'supplements';
    const itemsHtml = (catData.items || []).map((item, idx) => {
      return `
        <div class="m-item-row" data-cat="${catKey}" data-idx="${idx}">
          <label class="m-item">
            <input type="checkbox" ${item.checked ? 'checked' : ''} data-cat="${catKey}" data-idx="${idx}">
            <span class="m-box"></span>
            <span class="m-name">${item.name}</span>
            <span class="m-weight">${item.weight || ''}</span>
          </label>
          <button class="m-del-btn" title="Eliminar de la lista" data-cat="${catKey}" data-idx="${idx}">✕</button>
        </div>
      `;
    }).join('');

    html += `
      <div class="market-card ${isSupp ? 'card-supp-check' : ''}">
        <div class="market-card-head">
          <h3>
            ${catData.icon || ''}
            <span>${catData.title}</span>
          </h3>
          <span class="m-count">${catData.subtitle || ''}</span>
        </div>
        <div class="market-checklist">
          ${itemsHtml || '<p style="font-size:0.75rem; color:var(--text-muted); font-style:italic; padding:6px;">No hay productos en esta categoría</p>'}
        </div>
        <button class="btn-add-market-item" data-cat="${catKey}">
          <span>+ Añadir a ${catData.title.split(' ')[0]}</span>
        </button>
      </div>
    `;
  }

  container.innerHTML = html;

  // Listeners para checkboxes
  container.querySelectorAll('input[type="checkbox"]').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const cat = e.target.dataset.cat;
      const idx = parseInt(e.target.dataset.idx, 10);
      if (mList[cat] && mList[cat].items[idx]) {
        mList[cat].items[idx].checked = e.target.checked;
        saveState(appState);
        if (e.target.checked) playCheckSound();
      }
    });
  });

  // Listeners para borrar
  container.querySelectorAll('.m-del-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cat = e.currentTarget.dataset.cat;
      const idx = parseInt(e.currentTarget.dataset.idx, 10);
      if (mList[cat] && mList[cat].items[idx]) {
        const removed = mList[cat].items.splice(idx, 1)[0];
        saveState(appState);
        renderMercadonaList();
        showToast(`🗑️ ELIMINADO: ${removed.name}`);
      }
    });
  });

  // Listeners para añadir inline
  container.querySelectorAll('.btn-add-market-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cat = e.currentTarget.dataset.cat;
      const name = prompt(`Nombre del producto para ${mList[cat].title}:`);
      if (!name || !name.trim()) return;
      const weight = prompt(`Cantidad o peso estimado (ej: 500g, 1 paquete, 2 uds):`, '1 ud') || '';
      mList[cat].items.push({ name: name.trim(), weight: weight.trim(), checked: false });
      saveState(appState);
      renderMercadonaList();
      showToast(`🛒 AÑADIDO: ${name}`);
    });
  });
}

// ==========================================================================
// 10. AI AGENTIC DISPATCHER & CHATBOT LOGIC
// ==========================================================================
function dispatchChatActions(actions) {
  if (!Array.isArray(actions) || actions.length === 0) return [];

  const executedNotes = [];
  const mList = getMercadonaList();

  for (const act of actions) {
    if (!act || !act.type) continue;

    // 1. ADD_MERCADONA_ITEM
    if (act.type === 'ADD_MERCADONA_ITEM') {
      const catKey = (act.category && mList[act.category]) ? act.category : 'fresh';
      const name = act.name || 'Producto';
      const weight = act.weight || '1 ud';
      mList[catKey].items.push({ name, weight, checked: false });
      executedNotes.push(`+ ${name} en Mercadona`);
    }

    // 2. REMOVE_MERCADONA_ITEM
    else if (act.type === 'REMOVE_MERCADONA_ITEM') {
      const target = (act.name || '').toLowerCase();
      for (const cat of Object.values(mList)) {
        const idx = cat.items.findIndex(it => it.name.toLowerCase().includes(target));
        if (idx !== -1) {
          const removed = cat.items.splice(idx, 1)[0];
          executedNotes.push(`- ${removed.name} de Mercadona`);
          break;
        }
      }
    }

    // 3. ADD_MEAL_ITEM
    else if (act.type === 'ADD_MEAL_ITEM') {
      if (!appState.customMeals) {
        appState.customMeals = JSON.parse(JSON.stringify(DEFAULT_MEALS));
      }
      const mealKey = act.meal || 'snack';
      if (appState.customMeals[mealKey]) {
        const itemObj = { qty: act.qty || '1 ud', text: act.text || act.name || 'Alimento' };
        if (!Array.isArray(appState.customMeals[mealKey].items)) {
          appState.customMeals[mealKey].items = [];
        }
        appState.customMeals[mealKey].items.push(itemObj);
        executedNotes.push(`+ ${itemObj.text} en ${appState.customMeals[mealKey].name.split(' ')[0]}`);
      }
    }

    // 4. REMOVE_MEAL_ITEM
    else if (act.type === 'REMOVE_MEAL_ITEM') {
      if (!appState.customMeals) {
        appState.customMeals = JSON.parse(JSON.stringify(DEFAULT_MEALS));
      }
      const mealKey = act.meal || 'snack';
      const target = (act.text || act.name || '').toLowerCase();
      if (appState.customMeals[mealKey] && Array.isArray(appState.customMeals[mealKey].items)) {
        const idx = appState.customMeals[mealKey].items.findIndex(it => 
          (it.text || '').toLowerCase().includes(target) || (it.name || '').toLowerCase().includes(target)
        );
        if (idx !== -1) {
          const removed = appState.customMeals[mealKey].items.splice(idx, 1)[0];
          executedNotes.push(`- ${removed.text || removed.name} de ${mealKey}`);
        }
      }
    }

    // 5. ADJUST_WORKOUT
    else if (act.type === 'ADJUST_WORKOUT') {
      if (!appState.customWorkouts) {
        appState.customWorkouts = JSON.parse(JSON.stringify(DEFAULT_WORKOUTS));
      }
      const day = act.dayIdx !== undefined ? Number(act.dayIdx) : 4;
      if (appState.customWorkouts[day]) {
        if (act.km !== undefined) appState.customWorkouts[day].km = Number(act.km);
        if (act.note) appState.customWorkouts[day].meta = act.note;
        executedNotes.push(`Ajustado entreno ${appState.customWorkouts[day].name}`);
      }
    }
  }

  if (executedNotes.length > 0) {
    saveState(appState);
    renderMercadonaList();
    renderMeals(selectedDayIndex);
    renderMealsTab();
    renderWeeklyCalendar();
    renderTodayWorkout(selectedDayIndex);
    playCheckSound();
    showToast(`⚡ COACH: ${executedNotes.join(' • ')}`);
  }

  return executedNotes;
}

function initChatbot() {
  const btnOpen = document.getElementById('btn-open-chat');
  const modal = document.getElementById('chat-modal-overlay');
  const btnClose = document.getElementById('btn-close-chat-modal');
  const btnSend = document.getElementById('btn-send-chat');
  const input = document.getElementById('chat-input');
  const messagesContainer = document.getElementById('chat-messages');

  if (!btnOpen || !modal || !btnClose || !btnSend || !input || !messagesContainer) return;

  const chatHistory = [];

  btnOpen.addEventListener('click', () => {
    modal.classList.add('active');
    setTimeout(() => input.focus(), 100);
  });

  const closeModal = () => modal.classList.remove('active');
  btnClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  const addMessage = (text, type, actions = [], interview = null) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${type}-message`;
    
    let contentHtml = `<div class="msg-bubble">${(text || '').replace(/\n/g, '<br>')}`;

    // Insignia de acciones ejecutadas
    if (actions && actions.length > 0) {
      contentHtml += `
        <div class="chat-action-badge">
          <span>⚡ ACCIÓN EJECUTADA:</span>
          <span>${actions.join(' • ')}</span>
        </div>
      `;
    }

    // Modo entrevista: preguntas incisivas y respuestas rápidas
    if (interview && interview.is_active && Array.isArray(interview.quick_replies) && interview.quick_replies.length > 0) {
      contentHtml += `
        <div class="chat-interview-box">
          ${interview.question ? `<div class="chat-interview-q"><span>🎯 PREGUNTA DEL COACH:</span> <span>${interview.question}</span></div>` : ''}
          <div class="chat-quick-replies">
            ${interview.quick_replies.map(qr => `<button type="button" class="chat-reply-chip" data-reply="${encodeURIComponent(qr)}">💬 ${qr}</button>`).join('')}
          </div>
        </div>
      `;
    }

    contentHtml += `</div>`;
    msgDiv.innerHTML = contentHtml;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Vincular clics en quick reply chips
    msgDiv.querySelectorAll('.chat-reply-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const replyText = decodeURIComponent(chip.dataset.reply);
        input.value = replyText;
        sendMessage();
      });
    });
  };

  const sendMessage = async () => {
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    addMessage(text, 'user');
    chatHistory.push({ role: 'user', content: text });

    // Preparar contexto ultra-completo
    let weeklyRunningKm = 0;
    for (let i = 0; i < 7; i++) {
      const dayData = appState.days[getTodayKey(i)];
      if (dayData && dayData.stravaActivity && dayData.stravaActivity.distanceKm) {
        weeklyRunningKm += parseFloat(dayData.stravaActivity.distanceKm) || 0;
      }
    }

    const context = {
      weeklyKm: weeklyRunningKm,
      weight: (appState.profile && appState.profile.weight) || 73,
      goal: "Maratón Valencia 42K",
      meals: getMeals(),
      mercadonaList: getMercadonaList(),
      recentActivities: Object.values(appState.days).map(d => d.stravaActivity).filter(Boolean)
    };

    // Indicador de carga
    const loadingId = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message ai-message';
    loadingDiv.id = loadingId;
    loadingDiv.innerHTML = `<div class="msg-bubble spin">⏳ Pensando con base científica...</div>`;
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context, history: chatHistory })
      });

      document.getElementById(loadingId)?.remove();

      if (!res.ok) throw new Error('Error en el servidor');
      const data = await res.json();
      
      // Ejecutar acciones en la app si el Coach las prescribió
      const executed = dispatchChatActions(data.actions);

      if (data.reply) {
        chatHistory.push({ role: 'model', content: data.reply });
        addMessage(data.reply, 'ai', executed, data.interview_mode);
      } else {
        addMessage('Ha habido un error al procesar tu solicitud.', 'ai');
      }
    } catch (err) {
      document.getElementById(loadingId)?.remove();
      addMessage('Error de conexión con el Coach: ' + err.message, 'ai');
    }
  };

  btnSend.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}
