// ===================== DATA =====================
const SCHEDULE = [
  { day: 'Lunes', task: 'Running', type: 'run', desc: 'Rodaje suave Z2' },
  { day: 'Martes', task: 'Fuerza', type: 'strength', desc: 'Core & Estabilidad' },
  { day: 'Miércoles', task: 'Híbrido', type: 'strength', desc: 'Running + Fuerza' },
  { day: 'Jueves', task: 'Descanso', type: 'rest', desc: 'Recuperación activa' },
  { day: 'Viernes', task: 'Running', type: 'run', desc: 'Series / Umbral' },
  { day: 'Sábado', task: 'Fuerza', type: 'strength', desc: 'Funcional Corredor' },
  { day: 'Domingo', task: 'Descanso', type: 'rest', desc: 'Reset total' }
];

const ROUTINES = {
  'Martes': [
    { name: 'Plancha Abdominal', meta: '4 x 45 seg' },
    { name: 'Dead Bug', meta: '3 x 12 reps' },
    { name: 'Bird Dog', meta: '3 x 12 reps' },
    { name: 'Glute Bridge', meta: '3 x 15 reps' },
    { name: 'Plancha Lateral', meta: '3 x 30 seg/lado' }
  ],
  'Miércoles': [
    { name: 'Zancadas (Walking Lunges)', meta: '3 x 12 reps' },
    { name: 'Flexiones (Push ups)', meta: '3 x 12 reps' },
    { name: 'Sentadillas', meta: '3 x 15 reps' },
    { name: 'Core: Russian Twist', meta: '3 x 20 reps' }
  ],
  'Sábado': [
    { name: 'Peso Muerto Rumano', meta: '3 x 12 reps' },
    { name: 'Press Militar', meta: '3 x 12 reps' },
    { name: 'Step Ups', meta: '3 x 12 reps/pierna' },
    { name: 'Monster Walk (Goma)', meta: '3 x 15 reps' }
  ]
};

// ===================== ICONS (SVG) =====================
const ICONS = {
  run: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
  strength: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect><line x1="8" y1="7" x2="8" y2="17"></line><line x1="16" y1="7" x2="16" y2="17"></line></svg>`,
  rest: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
  race: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  water: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`,
  pill: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="5" ry="5"></rect><line x1="12" y1="7" x2="12" y2="17"></line></svg>`,
  shake: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`
};

const SUPPLEMENTS = [
  { name: 'Omega-3', icon: ICONS.water, time: '08:30', id: 'omega', notifMsg: '¡Hora del Omega-3 con el desayuno!' },
  { name: 'Creatina', icon: ICONS.race, time: '08:30', id: 'crea', notifMsg: '¡Creatina con el desayuno!' },
  { name: 'Whey Protein', icon: ICONS.shake, time: '20:30', id: 'whey', notifMsg: '¡Proteína post-entreno! 20 mins después de terminar.' },
  { name: 'Magnesio', icon: ICONS.pill, time: '21:30', id: 'mag', notifMsg: '¡Magnesio antes de dormir!' }
];

const STRAVA_CONFIG = {
  clientId: '243799',
  clientSecret: '74c79e75d6bbe253d1f91606ee06f074262fe096',
  redirectUri: 'https://virol.v-roiglo1991.workers.dev/'
};

let STRAVA_DATA = [
  { date: '10/05/2026', title: '5K Redolat', time: '21:59', dist: '5.07 km', elev: '4m', sense: 8 },
  { date: '07/05/2026', title: 'Carrera de noche', time: '38:26', dist: '7.02 km', elev: '11m', sense: 6 },
  { date: '04/05/2026', title: 'Carrera de noche', time: '41:07', dist: '8.50 km', elev: '9m', sense: 7 },
  { date: '29/04/2026', title: 'Carrera de noche', time: '40:17', dist: '8.01 km', elev: '46m', sense: 5 }
];

// ===================== STATE =====================
let currentDayIndex = (new Date().getDay() + 6) % 7; // 0=Lunes
let trainingState = JSON.parse(localStorage.getItem('training_done') || '{}');
let apiKey = localStorage.getItem('gemini_api_key') || '';
let weeklyNutrition = JSON.parse(localStorage.getItem('weekly_nutrition') || 'null');
let weeklyShopping = JSON.parse(localStorage.getItem('weekly_shopping') || 'null');
let charts = {};

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
  // Restore saved theme
  const savedTheme = localStorage.getItem('virol_theme') || 'dark';
  applyTheme(savedTheme);

  // Check for Strava OAuth callback
  const urlParams = new URLSearchParams(window.location.search);
  const stravaCode = urlParams.get('code');
  if (stravaCode) {
    handleStravaCallback(stravaCode);
    window.history.replaceState({}, document.title, "/"); // Limpiar URL
  } else {
    initStrava();
  }

  updateRacePredictions();
  renderCalendar();
  renderNextSession();
  renderDashboardSupps();
  updateCountdown();
  renderStravaActivities();
  updateBioProfile();
  setupFilters();
  if(apiKey) document.getElementById('api-key-input').value = apiKey;
  if(weeklyNutrition) renderNutritionTable(weeklyNutrition);
  if(weeklyShopping) renderShoppingList(weeklyShopping);
});

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('virol_theme', theme);
  const moon = document.getElementById('theme-icon-moon');
  const sun = document.getElementById('theme-icon-sun');
  if (moon && sun) {
    moon.style.display = theme === 'dark' ? 'flex' : 'none';
    sun.style.display  = theme === 'light' ? 'flex' : 'none';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// ===================== MODAL =====================
function toggleModal(show) {
  document.getElementById('modal-settings').classList.toggle('active', show);
}
function saveApiKey() {
  const val = document.getElementById('api-key-input').value;
  localStorage.setItem('gemini_api_key', val);
  apiKey = val;
  toggleModal(false);
  alert('API Key guardada correctamente.');
}

// ===================== AI SERVICE =====================
async function callGemini(prompt) {
  if(!apiKey) return null;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt + " Responde ÚNICAMENTE con el objeto JSON puro, sin bloques de código." }] }]
      })
    });
    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (e) { return null; }
}

// ===================== NUTRITION & SHOPPING =====================
async function generateWeeklyNutritionIA() {
  const btn = document.getElementById('btn-gen-nutrition');
  btn.classList.add('loading');
  
  // Recopilar contexto para la IA
  const weight = document.getElementById('bio-peso').textContent;
  const height = document.getElementById('bio-altura').textContent;
  const imc = document.getElementById('bio-imc').textContent;
  const totalKm = document.getElementById('kpi-dist').textContent;
  const daysLeft = document.getElementById('days-counter').textContent;

  const prompt = `Actúa como Nutricionista Deportivo de Élite para un maratoniano.
  PERFIL ATLETA: Peso ${weight}kg, Altura ${height}cm, IMC ${imc}, %Grasa 8.5%.
  CONTEXTO ACTUAL: Lleva ${totalKm} esta semana. Faltan ${daysLeft} días para el Maratón de Valencia (07/12).
  TAREA: Diseña un plan semanal Real Food personalizado. Si el volumen de km es alto, aumenta carbohidratos complejos.
  Devuelve un objeto JSON con dos claves obligatorias: 
  "plan" (array de 7 objetos con {dia, desayuno, comida, cena}) 
  "compra" (array de categorías con {categoria, items: [array de strings]}).`;
  
  const result = await callGemini(prompt);
  if(result && result.plan && result.compra) {
    weeklyNutrition = result.plan;
    weeklyShopping = result.compra;
    localStorage.setItem('weekly_nutrition', JSON.stringify(result.plan));
    localStorage.setItem('weekly_shopping', JSON.stringify(result.compra));
    renderNutritionTable(result.plan);
    renderShoppingList(result.compra);
  }
  btn.classList.remove('loading');
}

function renderNutritionTable(data) {
  const tbody = document.getElementById('nutrition-body');
  if (tbody) {
    tbody.innerHTML = data.map(d => `
      <tr><td class="td-day">${d.dia}</td><td>${d.desayuno}</td><td>${d.comida}</td><td>${d.cena}</td></tr>
    `).join('');
  }

  // Mobile cards
  const wrap = document.getElementById('nutrition-body-container');
  if (!wrap) return;
  let mobileDiv = document.getElementById('nutri-cards-mobile');
  if (!mobileDiv) {
    mobileDiv = document.createElement('div');
    mobileDiv.id = 'nutri-cards-mobile';
    mobileDiv.className = 'nutri-cards-mobile';
    mobileDiv.style.display = 'none';
    wrap.appendChild(mobileDiv);
  }
  mobileDiv.innerHTML = data.map(d => `
    <div class="nutri-card">
      <div class="nutri-card-day">${d.dia}</div>
      <div class="nutri-card-meal"><div class="nutri-card-label">Desayuno</div>${d.desayuno}</div>
      <div class="nutri-card-meal"><div class="nutri-card-label">Comida</div>${d.comida}</div>
      <div class="nutri-card-meal"><div class="nutri-card-label">Cena</div>${d.cena}</div>
    </div>
  `).join('');
}

// ===================== TRAINING =====================
async function generateWeeklyTrainingIA() {
  const btn = document.getElementById('btn-gen-training');
  btn.classList.add('loading');
  const prompt = `Planifica 3 rutinas de fuerza (Martes, Miércoles, Sábado). Devuelve un JSON con esos días como claves, cada una con un array de 5 objetos {name, meta}.`;
  const result = await callGemini(prompt);
  if(result) {
    Object.keys(result).forEach(day => ROUTINES[day] = result[day]);
    localStorage.setItem('custom_routines', JSON.stringify(ROUTINES));
    renderWeeklyTraining();
  }
  btn.classList.remove('loading');
}

async function generateWeeklyTrainingIA() {
  const btn = document.getElementById('btn-gen-training');
  btn.classList.add('loading');

  const totalKm = document.getElementById('kpi-dist').textContent;
  const best5k = "21:59";
  const daysLeft = document.getElementById('days-counter').textContent;

  const prompt = `Actúa como Entrenador de Maratón Nivel Pro. 
  ATLETA: Víctor. Estado actual: ${totalKm} acumulados esta semana. Mejor 5K: ${best5k}.
  META: Maratón Valencia en ${daysLeft} días.
  TAREA: Genera un plan de 7 días que combine sesiones de carrera (Running) y Fuerza (Fuerza/Core).
  Enfócate en la especificidad: si faltan menos de 30 días, prioriza ritmos de maratón. Si faltan más, prioriza base y fuerza.
  Devuelve un array JSON de 7 objetos: {dia, tipo, sesion}. "tipo" debe ser 'Running', 'Fuerza', 'Hibrido' o 'Descanso'.`;
  
  const result = await callGemini(prompt);
  if(result && Array.isArray(result)) {
    weeklyTraining = result;
    localStorage.setItem('weekly_training', JSON.stringify(result));
    renderTrainingTable(result);
    renderNextSession();
  }
  btn.classList.remove('loading');
}

function renderTrainingTable(data) {
  const el = document.getElementById('weekly-routines-container');
  if (!el || !data) return;

  el.innerHTML = `
    <div class="grid7-training" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-top:15px">
      ${data.map(d => `
        <div class="card" style="background:var(--s2); padding:10px; border-top: 3px solid ${d.tipo === 'Running' ? 'var(--orange)' : d.tipo === 'Fuerza' ? 'var(--lime)' : 'var(--muted)'}">
          <div class="label-tech" style="font-size:10px; margin-bottom:5px">${d.dia}</div>
          <div class="card-title" style="font-size:14px; margin-bottom:5px">${d.tipo}</div>
          <div style="font-size:11px; line-height:1.3; color:var(--text-sub)">${d.sesion}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderWeeklyTraining() {
  const el = document.getElementById('weekly-routines-container');
  if(!el) return;
  const days = ['Martes', 'Miércoles', 'Sábado'];
  el.innerHTML = days.map(day => `
    <div class="card" style="margin-bottom:15px; background:var(--s2)">
      <div class="cat-title">${day}</div>
      ${(ROUTINES[day] || []).map((ex, i) => {
        const key = `${day}-${i}`;
        const done = trainingState[key] || false;
        return `
          <div class="check-item ${done ? 'done' : ''}" onclick="toggleExercise('${key}', true)">
            <div class="check-box"><svg viewBox="0 0 24 24" fill="none" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
            <div class="check-info"><div class="check-title">${ex.name}</div><div class="check-meta">${ex.meta}</div></div>
          </div>
        `;
      }).join('')}
    </div>
  `).join('');
}

function toggleExercise(key, isWeekly) {
  trainingState[key] = !trainingState[key];
  localStorage.setItem('training_done', JSON.stringify(trainingState));
  if(isWeekly) renderWeeklyTraining();
}

function showPage(pageId, btn, bnavBtn) {
  // Sidebar nav
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const sidebarBtn = document.querySelector(`.nav-item[onclick*="'${pageId}'"]`);
  if (sidebarBtn) sidebarBtn.classList.add('active');

  // Bottom nav
  document.querySelectorAll('.bottom-nav-item').forEach(el => el.classList.remove('active'));
  const bottomBtn = bnavBtn || document.getElementById(`bnav-${pageId}`);
  if (bottomBtn) bottomBtn.classList.add('active');

  // Pages
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  const pageEl = document.getElementById('page-' + pageId);
  if (pageEl) pageEl.classList.add('active');

  // Title
  const titles = { dashboard: 'Dashboard', training: 'Entrenamiento', nutrition: 'Real Food Plan', shopping: 'Lista Compra' };
  const titleEl = document.getElementById('topbar-title');
  if (titleEl) titleEl.textContent = titles[pageId] || pageId;

  if (pageId === 'training') renderWeeklyTraining();
  toggleMenu(false);
}

function toggleMenu(forceState) {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobile-overlay');
  if (!sidebar) return;
  const isOpen = typeof forceState === 'boolean' ? !forceState : sidebar.classList.contains('open');
  if (isOpen) {
    sidebar.classList.remove('open');
    if(overlay) overlay.classList.remove('active');
  } else {
    sidebar.classList.add('open');
    if(overlay) overlay.classList.add('active');
  }
}

// ===================== DASHBOARD =====================
function renderCalendar() {
  const el = document.getElementById('week-calendar');
  if(!el) return;
  el.innerHTML = SCHEDULE.map((s, i) => `
    <div class="cal-day ${i === currentDayIndex ? 'active' : ''}">
      <div class="cal-name">${s.day.substring(0,3)}</div>
      <div class="cal-task ${s.type}">${s.task}</div>
    </div>
  `).join('');
  document.getElementById('current-day-label').textContent = SCHEDULE[currentDayIndex].day;
}

function renderNextSession() {
  const session = SCHEDULE[currentDayIndex];
  const el = document.getElementById('next-session-card');
  if(!el) return;
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:15px">
      <div style="color:var(--lime);display:flex;align-items:center;justify-content:center;background:var(--lime-glow);width:48px;height:48px;border-radius:12px">
        ${session.type === 'run' ? ICONS.run : session.type === 'strength' ? ICONS.strength : ICONS.rest}
      </div>
      <div>
        <div style="font-weight:800;font-size:18px;color:var(--lime)">${session.task}</div>
        <div style="font-size:13px;color:var(--muted)">${session.desc}</div>
      </div>
    </div>
  `;
}

function renderDashboardSupps() {
  const el = document.getElementById('dash-supps');
  if (!el) return;
  const suppState = JSON.parse(localStorage.getItem('supp_done_today') || '{}');
  let doneCount = 0;

  el.innerHTML = SUPPLEMENTS.map(s => {
    const done = suppState[s.id] || false;
    if (done) doneCount++;
    return `
      <div class="check-item ${done ? 'done' : ''}" onclick="toggleSupp('${s.id}')" style="margin-bottom:6px;padding:9px 12px">
        <div class="check-box">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="check-info">
          <div class="check-title" style="font-size:12px">${s.name}</div>
          <div class="check-meta">${s.time}</div>
        </div>
      </div>
    `;
  }).join('');

  const badge = document.getElementById('supp-done-count');
  if (badge) badge.textContent = `${doneCount}/${SUPPLEMENTS.length}`;
  if (badge) badge.style.background = doneCount === SUPPLEMENTS.length ? 'var(--lime-glow)' : 'var(--s2)';
  if (badge) badge.style.color = doneCount === SUPPLEMENTS.length ? 'var(--lime)' : 'var(--muted)';
}

function toggleSupp(id) {
  const suppState = JSON.parse(localStorage.getItem('supp_done_today') || '{}');
  suppState[id] = !suppState[id];
  localStorage.setItem('supp_done_today', JSON.stringify(suppState));
  renderDashboardSupps();
}

function requestNotifPermission() {
  if (!('Notification' in window)) {
    alert('Tu navegador no soporta notificaciones.');
    return;
  }
  Notification.requestPermission().then(perm => {
    if (perm === 'granted') {
      scheduleSupplementNotifications();
      document.getElementById('supp-notif-tip').style.display = 'none';
      alert('¡Notificaciones activadas! Recibirás un aviso en cada toma.');
    } else {
      document.getElementById('supp-notif-tip').style.display = 'block';
    }
  });
}

function scheduleSupplementNotifications() {
  SUPPLEMENTS.forEach(s => {
    const [h, m] = s.time.split(':').map(Number);
    const now = new Date();
    const notifTime = new Date();
    notifTime.setHours(h, m, 0, 0);
    let delay = notifTime - now;
    if (delay < 0) return; // Ya pasó esa hora hoy
    setTimeout(() => {
      new Notification('VIROL 42.2 — Suplementación', {
        body: s.notifMsg,
        icon: './virol_app_icon_1778517319688.png'
      });
    }, delay);
  });
}

function updateCountdown() {
  const start = new Date('2026-04-13T00:00:00');
  const target = new Date('2026-12-07T00:00:00');
  const now = new Date();
  
  const totalDays = (target - start) / (1000 * 60 * 60 * 24);
  const elapsedDays = (now - start) / (1000 * 60 * 60 * 24);
  
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  
  const el = document.getElementById('days-counter');
  if(el) el.textContent = diff > 0 ? diff : 0;
  
  let progress = (elapsedDays / totalDays) * 100;
  if (progress < 0) progress = 0;
  if (progress > 100) progress = 100;

  const barFill = document.getElementById('marathon-progress-fill');
  if (barFill) {
    setTimeout(() => {
      barFill.style.width = `${progress}%`;
    }, 100); // Pequeño retraso para que haga la animación al cargar
  }
}

// ===================== AI COACH INSIGHT =====================
async function generateCoachInsight() {
  const btn = document.getElementById('btn-coach-ai');
  const textEl = document.getElementById('coach-insight-text');
  btn.classList.add('loading');
  textEl.innerHTML = 'Analizando tus métricas...';

  // Recopilar últimos 5 entrenos
  const recentActs = STRAVA_DATA.slice(0, 5).map(a => `${a.title}: ${a.dist} en ${a.time} (Sns: ${a.sense || 5}/10)`).join(', ');
  
  const prompt = `Actúa como un entrenador de élite de maratón. Aquí están los últimos 5 entrenos de tu atleta Víctor: [${recentActs}]. 
  Basado en esto y en sus sensaciones percibidas (1 al 10), dale un consejo corto (máximo 2 frases) sobre su estado de forma actual y qué debe priorizar hoy. Devuelve un objeto JSON con la clave "insight".`;

  const result = await callGemini(prompt);
  if (result && result.insight) {
    textEl.innerHTML = `<strong>Coach:</strong> "${result.insight}"`;
  } else {
    textEl.innerHTML = 'No se pudo generar el consejo. Revisa la conexión o tu API Key.';
  }
  btn.classList.remove('loading');
}

// ===================== BIO PROFILE =====================
function updateBioProfile() {
  const pesoEl = document.getElementById('bio-peso');
  const alturaEl = document.getElementById('bio-altura');
  const imcEl = document.getElementById('bio-imc');

  if (!pesoEl || !alturaEl || !imcEl) return;

  const peso = parseFloat(pesoEl.innerText);
  const alturaCm = parseFloat(alturaEl.innerText);
  
  if (peso && alturaCm) {
    const alturaM = alturaCm / 100;
    const imc = peso / (alturaM * alturaM);
    const imcFormatted = imc.toFixed(1);
    
    imcEl.innerText = imcFormatted;

    // Rango de competición/saludable para élite maratón (aprox 18.5 a 22.5)
    // Usaremos un rango saludable general de 18.5 a 24.9
    if (imc >= 18.5 && imc < 25) {
      imcEl.style.color = '#32D74B'; // Verde
    } else {
      imcEl.style.color = 'var(--primary-orange)'; // Naranja
    }
  }
}

// ===================== STRAVA API LOGIC =====================
function connectStrava() {
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CONFIG.clientId}&redirect_uri=${STRAVA_CONFIG.redirectUri}&response_type=code&scope=activity:read_all`;
  window.location.href = authUrl;
}

async function handleStravaCallback(code) {
  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: STRAVA_CONFIG.clientId,
        client_secret: STRAVA_CONFIG.clientSecret,
        code: code,
        grant_type: 'authorization_code'
      })
    });
    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('strava_access_token', data.access_token);
      localStorage.setItem('strava_refresh_token', data.refresh_token);
      localStorage.setItem('strava_athlete', JSON.stringify(data.athlete));
      alert('¡Strava conectado correctamente!');
      fetchStravaActivities();
    }
  } catch (e) { alert('Error al conectar con Strava'); }
}

async function initStrava() {
  const token = localStorage.getItem('strava_access_token');
  const statusEl = document.getElementById('strava-status');
  if (token) {
    if (statusEl) statusEl.innerHTML = '<span style="color:#32D74B">● Vinculado</span>';
    const savedData = localStorage.getItem('strava_cached_data');
    if (savedData) {
      STRAVA_DATA = JSON.parse(savedData);
      renderStravaActivities();
      updateRacePredictions();
    } else {
      fetchStravaActivities();
    }
  }
}

async function fetchStravaActivities() {
  const token = localStorage.getItem('strava_access_token');
  if (!token) return;

  try {
    const response = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=15', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    
    if (Array.isArray(data)) {
      STRAVA_DATA = data.map(a => {
        const d = new Date(a.start_date_local);
        return {
          date: d.toLocaleDateString('es-ES'),
          title: a.name,
          dist: (a.distance / 1000).toFixed(2) + ' km',
          time: Math.floor(a.moving_time / 60) + ':' + (a.moving_time % 60).toString().padStart(2, '0'),
          elev: a.total_elevation_gain + 'm',
          sense: 5 // Por defecto
        };
      });
      localStorage.setItem('strava_cached_data', JSON.stringify(STRAVA_DATA));
      renderStravaActivities();
      updateRacePredictions();
    }
  } catch (e) { console.error('Error fetching Strava activities', e); }
}

function updateRacePredictions() {
  // Basado en el mejor 5K (podemos buscarlo en STRAVA_DATA o usar el fijo 21:59)
  // Riegel: T2 = T1 * (D2/D1)^1.06
  const best5kSeconds = (21 * 60) + 59; // 21:59
  
  const predict = (dist) => {
    const seconds = best5kSeconds * Math.pow(dist / 5, 1.06);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0 ? `${h}h ${m}m` : `${m}:${s.toString().padStart(2, '0')}`;
  };

  const predictPace = (dist) => {
    const seconds = best5kSeconds * Math.pow(dist / 5, 1.06);
    const paceSecs = seconds / dist;
    const m = Math.floor(paceSecs / 60);
    const s = Math.floor(paceSecs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  document.getElementById('est-10k').textContent = predict(10);
  document.getElementById('est-21k').textContent = predict(21.1);
  document.getElementById('est-42k').textContent = predict(42.2);
  document.getElementById('est-pace').textContent = predictPace(42.2) + ' m/k';
}

// ===================== STRAVA DASHBOARD =====================
function calculatePace(timeStr, distStr) {
  const [min, sec] = timeStr.split(':').map(Number);
  const totalSec = min * 60 + sec;
  const dist = parseFloat(distStr);
  if (!dist) return '-';
  const paceSecPerKm = totalSec / dist;
  const pMin = Math.floor(paceSecPerKm / 60);
  const pSec = Math.floor(paceSecPerKm % 60);
  return `${pMin}:${pSec.toString().padStart(2, '0')} min/km`;
}

function renderStravaActivities() {
  const el = document.getElementById('strava-activities-body');
  if (!el) return;
  el.innerHTML = STRAVA_DATA.map(a => {
    const parts = a.date.split('/');
    const dateShort = `${parts[0]}/${parts[1]}`;
    const dateYear = `'${parts[2] ? parts[2].slice(2) : ''}`;
    const isRace = a.title.includes('Redolat');
    return `
      <tr>
        <td><span class="date-short">${dateShort}</span><span class="date-year">${dateYear}</span></td>
        <td style="font-weight:600; color:${isRace ? 'var(--lime)' : 'var(--text)'}">
          <span style="color:var(--muted); vertical-align:middle; margin-right:5px">${isRace ? ICONS.race : ICONS.run}</span>${a.title}
        </td>
        <td class="hide-xs" style="font-family:'DM Mono',monospace">${a.dist}</td>
        <td style="color:var(--lime);font-weight:600;font-family:'DM Mono',monospace;white-space:nowrap">${calculatePace(a.time, a.dist)}</td>
        <td class="hide-xs" style="text-align:center"><span class="card-badge" style="background:${(a.sense||5) > 7 ? 'rgba(255,59,48,0.1)' : 'var(--s3)'}">${a.sense || '-'}</span></td>
      </tr>
    `;
  }).join('');
  updateKPIs();
  initCharts();
}

function addNewActivity() {
  const date = document.getElementById('new-date').value;
  const title = document.getElementById('new-title').value;
  const dist = document.getElementById('new-dist').value;
  const time = document.getElementById('new-time').value;
  const elev = document.getElementById('new-elev').value;
  const sense = document.getElementById('new-sense').value;

  if(!date || !dist || !time) return alert('Por favor, rellena al menos Fecha, Distancia y Tiempo.');

  // Formatear fecha de YYYY-MM-DD a DD/MM/YYYY
  const [y, m, d] = date.split('-');
  const formattedDate = `${d}/${m}/${y}`;

  const newAct = {
    date: formattedDate,
    title: title || 'Carrera',
    dist: dist + ' km',
    time: time,
    elev: (elev || 0) + 'm',
    sense: parseInt(sense) || 5
  };

  STRAVA_DATA.unshift(newAct); // Añadir al principio
  renderStravaActivities();
  
  // Limpiar campos
  document.getElementById('new-title').value = '';
  document.getElementById('new-dist').value = '';
  document.getElementById('new-time').value = '';
  document.getElementById('new-elev').value = '';
  document.getElementById('new-sense').value = '';
  
  alert('Actividad guardada correctamente.');
}

function updateKPIs() {
  const totalDist = STRAVA_DATA.reduce((acc, a) => acc + parseFloat(a.dist), 0);
  const totalElev = STRAVA_DATA.reduce((acc, a) => acc + parseInt(a.elev), 0);
  document.getElementById('kpi-dist').textContent = `${totalDist.toFixed(1)} km`;
  document.getElementById('kpi-elev').textContent = `${totalElev} m`;
  document.getElementById('kpi-pace').textContent = '4:42'; // Promedio sim
}

function initCharts() {
  const ctxDist = document.getElementById('chart-distance');
  const ctxType = document.getElementById('chart-types');
  if (!ctxDist || !ctxType) return;
  if (charts.dist) charts.dist.destroy();
  if (charts.type) charts.type.destroy();

  charts.dist = new Chart(ctxDist, {
    type: 'bar',
    data: {
      labels: STRAVA_DATA.map(a => a.date.split('/')[0]).reverse(),
      datasets: [{ 
        label: 'km', 
        data: STRAVA_DATA.map(a => parseFloat(a.dist)).reverse(), 
        backgroundColor: 'rgba(255, 109, 0, 0.7)',
        borderColor: '#FF6D00',
        borderWidth: 1,
        borderRadius: 3
      }]
    },
    options: { 
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }, 
      scales: { 
        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8B949E', font: { family: 'Roboto Mono', size: 10 } } },
        x: { grid: { display: false }, ticks: { color: '#8B949E', font: { family: 'Roboto Mono', size: 10 } } }
      }
    }
  });

  const types = { 'Suave (1-4)': 0, 'Medio (5-7)': 0, 'Duro (8-10)': 0 };
  STRAVA_DATA.forEach(a => {
    let sense = a.sense || 5;
    if (sense <= 4) types['Suave (1-4)']++;
    else if (sense <= 7) types['Medio (5-7)']++;
    else types['Duro (8-10)']++;
  });

  charts.type = new Chart(ctxType, {
    type: 'doughnut',
    data: {
      labels: Object.keys(types),
      datasets: [{ data: Object.values(types), backgroundColor: ['#2F81F7', '#FF6D00', '#FF3B30'], borderWidth: 0, hoverOffset: 6 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%', 
      plugins: { legend: { position: 'right', labels: { color: '#8B949E', font: { size: 10, family: 'Roboto Mono' }, boxWidth: 10 } } } 
    }
  });
}

function setupFilters() {
  const filter = document.getElementById('activity-filter');
  if(!filter) return;
  filter.addEventListener('change', (e) => {
    const val = e.target.value;
    document.querySelectorAll('#strava-activities-body tr').forEach(row => {
      const title = row.innerText.toLowerCase();
      if (val === 'all') row.style.display = '';
      else if (val === 'run' && title.includes('carrera')) row.style.display = '';
      else if (val === 'race' && title.includes('redolat')) row.style.display = '';
      else row.style.display = 'none';
    });
  });
}

function renderShoppingList(data) {
  const el = document.getElementById('grocery-list');
  if (!el || !data) return;

  el.innerHTML = data.map(cat => `
    <div class="shop-cat">
      <div class="cat-title">${cat.categoria}</div>
      ${cat.items.map(item => `
        <div class="check-item" onclick="this.classList.toggle('done')">
          <div class="check-box"><svg viewBox="0 0 24 24" fill="none" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
          <div class="check-info"><div class="check-title" style="font-weight:400; font-family:var(--font-tech)">${item}</div></div>
        </div>
      `).join('')}
    </div>
  `).join('');
}
