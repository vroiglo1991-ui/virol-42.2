/**
 * BIOFLOW - VALENCIA 42K PRO
 * state.js - Gestión de Estado Local y Persistencia
 */

function getStoredState() {
  const defaultAlarms = (typeof DEFAULT_ALARMS !== 'undefined') ? DEFAULT_ALARMS : {
    workout: { enabled: true, time: '09:00', title: '🏋️‍♂️ RECORDATORIO DE ENTRENO DEL DÍA' },
    creatina: { enabled: true, time: '12:00', title: '⚡ CREATINA & RECUPERACIÓN POST-ENTRENO' },
    hidratacion: { enabled: true, time: '16:00', title: '💧 CONTROL DE HIDRATACIÓN' },
    magnesio: { enabled: true, time: '21:30', title: '🌙 MAGNESIO & REGISTRO DE SENSACIONES' }
  };

  const defaultRunning = (typeof DEFAULT_RUNNING !== 'undefined') ? DEFAULT_RUNNING : {
    benchmark: {
      name: 'Carrera de mañana (Martes)',
      distanceKm: 8.51,
      movingTimeSec: 2949,
      paceStr: '5:46/km',
      elevation: 8,
      heartRate: 154
    },
    weeklyTargetKm: 44.0
  };

  const defaultProfile = (typeof DEFAULT_PROFILE !== 'undefined') ? DEFAULT_PROFILE : {
    name: 'VÍCTOR',
    weight: 73,
    height: 178,
    goal: 'VALENCIA 42K PRO'
  };

  const stravaToken = (typeof DEFAULT_STRAVA_TOKEN !== 'undefined') ? DEFAULT_STRAVA_TOKEN : 'e879a9119db61a2e1c8edaa6bf2c10faa9bad366';
  const storageKey = (typeof STORAGE_KEY !== 'undefined') ? STORAGE_KEY : 'valencia_42k_victor_prod_v1';

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.days) parsed.days = {};
      if (!parsed.history) parsed.history = [];
      if (!parsed.lastUpdated) parsed.lastUpdated = 0;
      if (!parsed.strava) {
        parsed.strava = { token: stravaToken, autoCheck: true, tolerance: 70 };
      } else {
        parsed.strava.token = stravaToken;
      }
      if (!parsed.profile) {
        parsed.profile = defaultProfile;
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
      if (!parsed.mercadonaList && typeof DEFAULT_MERCADONA !== 'undefined') {
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
    strava: { token: stravaToken, autoCheck: true, tolerance: 70 },
    profile: defaultProfile,
    alarms: defaultAlarms,
    running: defaultRunning,
    mercadonaList: (typeof DEFAULT_MERCADONA !== 'undefined') ? JSON.parse(JSON.stringify(DEFAULT_MERCADONA)) : {},
    days: {},
    history: []
  };
}

let appState = getStoredState();

function getWorkouts() {
  return appState.customWorkouts || (typeof DEFAULT_WORKOUTS !== 'undefined' ? DEFAULT_WORKOUTS : {});
}

function getMeals() {
  return appState.customMeals || (typeof DEFAULT_MEALS !== 'undefined' ? DEFAULT_MEALS : {});
}

function getMercadonaList() {
  if (!appState.mercadonaList && typeof DEFAULT_MERCADONA !== 'undefined') {
    appState.mercadonaList = JSON.parse(JSON.stringify(DEFAULT_MERCADONA));
  }
  return appState.mercadonaList;
}

const WORKOUT_PLANS = new Proxy({}, {
  get: (target, prop) => getWorkouts()[prop]
});

let selectedDayIndex = new Date().getDay();

function getTodayKey(dayIndex) {
  return `day_${dayIndex}`;
}

function saveState(state, triggerCloud = true) {
  try {
    state.lastUpdated = Date.now();
    const key = (typeof STORAGE_KEY !== 'undefined') ? STORAGE_KEY : 'valencia_42k_victor_prod_v1';
    localStorage.setItem(key, JSON.stringify(state));
    if (triggerCloud && typeof scheduleCloudPush === 'function') {
      scheduleCloudPush();
    }
  } catch (e) {
    console.error('Error saving local state:', e);
  }
}
