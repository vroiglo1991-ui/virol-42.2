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

function getStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.days) parsed.days = {};
      if (!parsed.history) parsed.history = [];
      if (!parsed.lastUpdated) parsed.lastUpdated = 0;
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
    days: {},
    history: []
  };
}

let appState = getStoredState();
let cloudPushTimer = null;
let isFetchingCloud = false;

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
      athlete: 'Víctor',
      lastUpdated: appState.lastUpdated || Date.now(),
      days: appState.days || {},
      history: appState.history || [],
      themeSetting: appState.themeSetting || 'auto',
      soundEnabled: appState.soundEnabled !== false,
      customMeals: appState.customMeals || null,
      customWorkouts: appState.customWorkouts || null
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
        if (cloudData.themeSetting) appState.themeSetting = cloudData.themeSetting;
        if (typeof cloudData.soundEnabled === 'boolean') appState.soundEnabled = cloudData.soundEnabled;
        if (cloudData.customMeals) appState.customMeals = cloudData.customMeals;
        if (cloudData.customWorkouts) appState.customWorkouts = cloudData.customWorkouts;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));

        // Refrescar interfaces
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
    return `
      <div class="day-card ${cardClasses[d] || 'card-pull'}" data-day-index="${d}">
        <div class="day-card-header">
          <span class="day-name">${w.name}</span>
          <span class="day-discipline ${tagClasses[d] || 'tag-blue'}">${w.discipline}</span>
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
  const btnOpenMeals = document.getElementById('btn-open-meal-editor');
  const btnOpenPlan = document.getElementById('btn-open-plan-editor');

  const tabMealsBtn = document.getElementById('btn-tab-edit-meals');
  const tabWorkoutsBtn = document.getElementById('btn-tab-edit-workouts');
  const paneMeals = document.getElementById('pane-edit-meals');
  const paneWorkouts = document.getElementById('pane-edit-workouts');

  const mealSelect = document.getElementById('edit-meal-select');
  const mealNameInput = document.getElementById('edit-meal-name');
  const mealTimeInput = document.getElementById('edit-meal-time');
  const mealDescInput = document.getElementById('edit-meal-desc');
  const mealItemsTextarea = document.getElementById('edit-meal-items');

  const workoutSelect = document.getElementById('edit-workout-select');
  const workoutDisciplineInput = document.getElementById('edit-workout-discipline');
  const workoutTitleInput = document.getElementById('edit-workout-title');
  const workoutKmInput = document.getElementById('edit-workout-km');
  const workoutStepsTextarea = document.getElementById('edit-workout-steps');

  const btnSave = document.getElementById('btn-save-custom-plan');
  const btnReset = document.getElementById('btn-reset-defaults');

  let currentTab = 'meals';

  function openEditor(tab = 'meals') {
    currentTab = tab;
    if (tab === 'meals') {
      if (tabMealsBtn) tabMealsBtn.classList.add('active');
      if (tabWorkoutsBtn) tabWorkoutsBtn.classList.remove('active');
      if (paneMeals) paneMeals.style.display = 'flex';
      if (paneWorkouts) paneWorkouts.style.display = 'none';
      if (mealSelect) loadMealIntoForm(mealSelect.value);
    } else {
      if (tabWorkoutsBtn) tabWorkoutsBtn.classList.add('active');
      if (tabMealsBtn) tabMealsBtn.classList.remove('active');
      if (paneWorkouts) paneWorkouts.style.display = 'flex';
      if (paneMeals) paneMeals.style.display = 'none';
      if (workoutSelect) loadWorkoutIntoForm(workoutSelect.value);
    }
    if (modalOverlay) modalOverlay.classList.add('active');
  }

  function closeEditor() {
    if (modalOverlay) modalOverlay.classList.remove('active');
  }

  if (btnOpenMeals) btnOpenMeals.addEventListener('click', () => openEditor('meals'));
  if (btnOpenPlan) btnOpenPlan.addEventListener('click', () => openEditor('workouts'));
  if (btnClose) btnClose.addEventListener('click', closeEditor);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeEditor();
    });
  }

  if (tabMealsBtn) {
    tabMealsBtn.addEventListener('click', () => openEditor('meals'));
  }
  if (tabWorkoutsBtn) {
    tabWorkoutsBtn.addEventListener('click', () => openEditor('workouts'));
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
      if (currentTab === 'meals') {
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
      if (confirm('¿Restaurar el plan de entrenamiento y nutrición al original (73 kg Mercadona)?')) {
        delete appState.customMeals;
        delete appState.customWorkouts;
        saveState(appState);
        playCheckSound();
        renderMission(selectedDayIndex);
        renderMealsTab();
        renderScheduleCards();
        closeEditor();
        showToast('🔄 PLAN RESTAURADO AL ORIGINAL (73 KG)');
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

// 10. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
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
