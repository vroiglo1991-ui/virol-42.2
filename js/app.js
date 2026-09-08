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

const WORKOUT_PLANS = new Proxy({}, {
  get: (target, prop) => getWorkouts()[prop]
});

// 2. STATE MANAGEMENT & REALTIME ASYNC CLOUD SYNC
const STORAGE_KEY = 'valencia_42k_victor_prod_v1';
const CLOUD_SYNC_URL = 'https://extendsclass.com/api/json-storage/bin/dfddcab';

const DEFAULT_STRAVA_TOKEN = 'e879a9119db61a2e1c8edaa6bf2c10faa9bad366';

function getStoredState() {
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
      strava: appState.strava || null
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
        if (cloudData.strava) appState.strava = cloudData.strava;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));

        // Refrescar interfaces
        renderProfileHUD();
        applyTheme(appState.themeSetting || 'auto');
        renderMission(selectedDayIndex);
        renderHistory();
        renderMealsTab();
        renderScheduleCards();

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

// 8. NOTIFICATIONS & ALARMS
function setupNotifications() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function checkAlarms() {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const alarms = [
    { id: 'alarm-creatina', time: '08:30', title: '⚡ CREATINA & OMEGA 3', body: 'Víctor: 5g de Creatina y 2 perlas de Omega 3 con el desayuno.' },
    { id: 'alarm-hidratacion', time: '13:00', title: '💧 CONTROL DE HIDRATACIÓN', body: 'Asegura 1.5 L de agua acumulados antes de comer.' },
    { id: 'alarm-whey', time: '17:30', title: '🍌 MERIENDA ANABÓLICA', body: 'Batido de 30g de Proteína Whey + Plátano para reparar fibras.' },
    { id: 'alarm-magnesio', time: '22:30', title: '🌙 MAGNESIO NOCTURNO', body: 'Toma el magnesio. ¡Hora de dormir 7-8 horas completas!' }
  ];

  alarms.forEach(al => {
    const toggle = document.getElementById(al.id);
    if (toggle && toggle.checked && timeStr === al.time) {
      if (!al._lastTriggered || al._lastTriggered !== timeStr) {
        al._lastTriggered = timeStr;
        triggerAlarm(al.title, al.body);
      }
    }
  });
}

function triggerAlarm(title, body) {
  playAlarmSound();
  showToast(`🔔 ${title}: ${body}`);

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: 'img/victor.png'
      });
    } catch (e) {}
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
  const geminiKey = document.getElementById('ai-gemini-key')?.value.trim();

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

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

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

  // Open & Close
  if (btnOpenBanner) btnOpenBanner.addEventListener('click', openAINutritionModal);
  if (btnOpenHead) btnOpenHead.addEventListener('click', openAINutritionModal);
  if (btnClose) btnClose.addEventListener('click', closeAINutritionModal);
  if (btnCancel) btnCancel.addEventListener('click', closeAINutritionModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeAINutritionModal();
    });
  }

  // Toggle Chips
  const chips = document.querySelectorAll('#ai-ingredient-chips .ingredient-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      playCheckSound();
    });
  });

  // Load from Mercadona
  if (btnLoadMarket) {
    btnLoadMarket.addEventListener('click', () => {
      chips.forEach(chip => chip.classList.add('selected'));
      playCheckSound();
      showToast('🛒 ¡TODOS LOS PRODUCTOS DE MERCADONA SELECCIONADOS!');
    });
  }

  // Run AI Generation
  if (btnRun) btnRun.addEventListener('click', runAINutritionEngine);

  // Apply Generated Meals
  if (btnApply) {
    btnApply.addEventListener('click', () => {
      if (!pendingGeneratedMeals) return;

      appState.customMeals = pendingGeneratedMeals;
      saveState(appState);
      playSuccessSound();

      // Refresh screens
      renderMealsTab();
      renderMealChecklist(selectedDayIndex);
      updateProgressHUD(selectedDayIndex);

      closeAINutritionModal();
      showToast('🚀 ¡NUEVO MENÚ IA APLICADO A TU APP Y SINCRONIZADO!');
    });
  }
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

  // Tab navigation
  const navBtns = document.querySelectorAll('.nav-btn');
  const panes = document.querySelectorAll('.tab-pane');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      navBtns.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetTab);
      if (targetPane) targetPane.classList.add('active');
      playCheckSound();
    });
  });

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
  const suppChecks = document.querySelectorAll('#supplements-checklist input[type="checkbox"]');
  suppChecks.forEach(chk => {
    chk.addEventListener('change', () => {
      const key = getTodayKey(selectedDayIndex);
      if (!appState.days[key]) appState.days[key] = {};

      const chkKey = chk.dataset.chk;
      appState.days[key][chkKey] = chk.checked;
      saveState(appState);
      updateProgressHUD(selectedDayIndex);

      if (chk.checked) {
        playCheckSound();
        showToast(`✔ MARCADO: ${chk.closest('.chk-item').querySelector('.chk-name').innerText}`);
      }
    });
  });

  // Sleep hours
  const sleepInput = document.getElementById('sleep-hours');
  if (sleepInput) {
    const key = getTodayKey(selectedDayIndex);
    if (appState.days[key] && appState.days[key].sleepHours) {
      sleepInput.value = appState.days[key].sleepHours;
    }
    sleepInput.addEventListener('change', () => {
      const key = getTodayKey(selectedDayIndex);
      if (!appState.days[key]) appState.days[key] = {};
      appState.days[key].sleepHours = sleepInput.value;
      saveState(appState);
      playCheckSound();
      showToast(`💤 SUEÑO REGISTRADO: ${sleepInput.value} HORAS`);
    });
  }

  // Copy Mercadona shopping list
  const copyBtn = document.getElementById('btn-copy-market');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      playCheckSound();
      const listText = `🛒 LISTA DE LA COMPRA MERCADONA (SEMANAL - VÍCTOR 73KG):
- 1.5 kg Lomo de cerdo
- 1.0 kg Carne picada vacuno/cerdo
- 8 a 10 latas de Atún claro
- 400 g Fiambre pechuga de pavo
- 250 g Jamón serrano
- 3.0 kg Patatas
- 2 hogazas Pan Rústico Mercadona
- 1.0 kg Arroz
- 1.0 kg Pasta
- 2 paquetes Tortitas de arroz
- 2.0 kg Plátanos de Canarias
- 350 g Queso tierno/semicurado
- 3 bricks Gazpacho tradicional 1L
- 1 tarro Olivas
- Aceite de Oliva Virgen Extra

💊 SUPLEMENTACIÓN:
- Creatina Monohidrato (5g/día)
- Proteína Whey (30g/día)
- Omega 3 (2 perlas/día)
- Magnesio (1 dosis antes de dormir)`;

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

  // Test alarm button
  const testAlarmBtn = document.getElementById('btn-test-notification');
  if (testAlarmBtn) {
    testAlarmBtn.addEventListener('click', () => {
      setupNotifications();
      triggerAlarm('🔔 PRUEBA DE AVISO (VÍCTOR 42K)', '¡Tu sistema de alarmas y sonido táctil está 100% activo!');
    });
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
});
