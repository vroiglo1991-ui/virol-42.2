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
  { name: 'Omega-3', icon: ICONS.water, time: '08:30', id: 'omega' },
  { name: 'Creatina', icon: ICONS.race, time: '08:30', id: 'crea' },
  { name: 'Whey Protein', icon: ICONS.shake, time: '20:30', id: 'whey' },
  { name: 'Magnesio', icon: ICONS.pill, time: '21:30', id: 'mag' }
];

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

  // Iniciar Strava vía Cloudflare Worker
  initStrava();

  updateRacePredictions();
  renderCalendar();
  renderNextSession();
  renderDashboardSupps();
  updateCountdown();
  renderStravaActivities();
  updateBioProfile();
  setupFilters();

  if(apiKey) document.getElementById('api-key-input').value = apiKey;

  const savedIcal = localStorage.getItem('ical_link');
  if(savedIcal) {
    const input = document.getElementById('ical-link-input');
    if(input) input.value = savedIcal;
    syncCalendar();
  }

  const savedTraining = localStorage.getItem('weekly_training');
  if (savedTraining) {
    weeklyTraining = JSON.parse(savedTraining);
    renderTrainingTable(weeklyTraining);
  } else {
    renderWeeklyTraining();
  }

  if(weeklyNutrition) renderNutritionTable(weeklyNutrition);
  if(weeklyShopping) renderShoppingList(weeklyShopping);

  // Restaurar Perfil Antropométrico y Preferencias
  loadBioProfile();
  updateBioProfile();
  loadDietaryPreferences();
  renderDailyLogs();
  renderSmartSupplementBanner();
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

// ===================== PREFERENCIAS DIETÉTICAS Y REGISTROS DIARIOS =====================
function saveDietaryPreferences() {
  const type = document.getElementById('pref-diet-type').value;
  const avoid = document.getElementById('pref-diet-avoid').value.trim();
  const favorites = document.getElementById('pref-diet-favorites').value.trim();
  
  const preferences = { type, avoid, favorites };
  localStorage.setItem('dietary_preferences', JSON.stringify(preferences));
}

function loadDietaryPreferences() {
  const data = localStorage.getItem('dietary_preferences');
  if (data) {
    const preferences = JSON.parse(data);
    const typeEl = document.getElementById('pref-diet-type');
    const avoidEl = document.getElementById('pref-diet-avoid');
    const favEl = document.getElementById('pref-diet-favorites');
    
    if (typeEl) typeEl.value = preferences.type || 'omnivora';
    if (avoidEl) avoidEl.value = preferences.avoid || '';
    if (favEl) favEl.value = preferences.favorites || '';
  }
}

function saveDailyLog() {
  const weightInput = document.getElementById('daily-weight');
  const fatInput = document.getElementById('daily-fat');
  const energySelect = document.getElementById('daily-energy');
  const digestionSelect = document.getElementById('daily-digestion');
  const adherenceSelect = document.getElementById('daily-adherence');
  const notesTextArea = document.getElementById('daily-notes');
  
  if (!weightInput || !weightInput.value) {
    alert('Por favor, introduce tu peso corporal para registrar tu telemetría hoy.');
    return;
  }
  
  const weight = parseFloat(weightInput.value);
  if (isNaN(weight) || weight <= 0) {
    alert('Por favor, introduce un peso corporal válido.');
    return;
  }

  const fat = fatInput && fatInput.value ? parseFloat(fatInput.value) : null;
  const energy = parseInt(energySelect.value);
  const digestion = parseInt(digestionSelect.value);
  const adherence = adherenceSelect.value;
  const notes = notesTextArea.value.trim();
  
  // Generar fecha en formato DD/MM/YYYY robusto
  const d = new Date();
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const dateStr = `${day}/${month}/${year}`;
  
  const logEntry = {
    date: dateStr,
    weight: weight,
    fat: fat,
    energy: energy,
    digestion: digestion,
    adherence: adherence,
    notes: notes
  };
  
  let logs = JSON.parse(localStorage.getItem('nutrition_history_log') || '[]');
  
  // Evitar duplicados del mismo día reemplazando el registro si ya existe
  logs = logs.filter(entry => entry.date !== dateStr);
  logs.unshift(logEntry);
  
  // Limitar historial a los últimos 10 días para rendimiento óptimo
  if (logs.length > 10) {
    logs = logs.slice(0, 10);
  }
  
  localStorage.setItem('nutrition_history_log', JSON.stringify(logs));
  
  // Limpiar/resetear campos
  weightInput.value = '';
  if (fatInput) fatInput.value = '';
  notesTextArea.value = '';
  
  // Actualizar el perfil antropométrico global
  const bioPesoEl = document.getElementById('bio-peso');
  const bioGrasaEl = document.getElementById('bio-grasa');
  if (bioPesoEl) bioPesoEl.innerText = weight;
  if (bioGrasaEl && fat !== null && !isNaN(fat)) bioGrasaEl.innerText = fat + '%';
  
  const savedBio = JSON.parse(localStorage.getItem('bio_profile') || '{"peso":70,"altura":178,"grasa":8.5}');
  savedBio.peso = weight;
  if (fat !== null && !isNaN(fat)) savedBio.grasa = fat;
  localStorage.setItem('bio_profile', JSON.stringify(savedBio));

  updateBioProfile();
  renderDailyLogs();
  alert('¡Registro de hoy guardado! La IA adaptará tu próximo plan según estos datos.');
}

function renderDailyLogs() {
  const tbody = document.getElementById('daily-log-table-body');
  if (!tbody) return;
  
  const logs = JSON.parse(localStorage.getItem('nutrition_history_log') || '[]');
  
  if (logs.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;color:var(--muted);padding:15px;">No hay registros grabados en los últimos días.</td>
      </tr>
    `;
    return;
  }
  
  const adherenceMap = {
    'alta': '<span style="color:#32D74B; font-weight:600;">Alta (100%)</span>',
    'media': '<span style="color:#FFD60A; font-weight:600;">Media (Cambios)</span>',
    'baja': '<span style="color:#FF453A; font-weight:600;">Baja (Libre/Fuera)</span>'
  };
  
  tbody.innerHTML = logs.slice(0, 5).map(log => `
    <tr>
      <td style="font-family:'DM Mono',monospace; white-space:nowrap">${log.date.substring(0, 5)}</td>
      <td style="font-weight:600;">${log.weight} kg</td>
      <td style="text-align:center;"><span class="card-badge" style="background:${log.energy >= 8 ? 'rgba(50,215,75,0.15)' : 'rgba(255,69,58,0.15)'}; color:${log.energy >= 8 ? '#32D74B' : '#FF453A'}">${log.energy}/10</span></td>
      <td style="text-align:center;"><span class="card-badge" style="background:${log.digestion >= 8 ? 'rgba(50,215,75,0.15)' : 'rgba(255,69,58,0.15)'}; color:${log.digestion >= 8 ? '#32D74B' : '#FF453A'}">${log.digestion}/10</span></td>
      <td>${adherenceMap[log.adherence] || log.adherence}</td>
      <td style="max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${log.notes || ''}">${log.notes || '<span style="color:var(--muted)">-</span>'}</td>
    </tr>
  `).join('');
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

  // Obtener Preferencias Alimentarias
  const prefData = localStorage.getItem('dietary_preferences');
  const preferences = prefData ? JSON.parse(prefData) : { type: 'omnivora', avoid: 'Ninguno', favorites: 'Ninguno' };

  // Obtener Historial de Salud Diario (últimos 10 registros)
  const logsData = localStorage.getItem('nutrition_history_log');
  const logs = logsData ? JSON.parse(logsData) : [];
  let historyText = "";
  if (logs.length > 0) {
    historyText = "\nTELEMETRÍA HISTÓRICA RECIENTE DEL ATLETA:\n";
    logs.forEach(l => {
      historyText += `- Fecha: ${l.date}, Peso: ${l.weight}kg, Nivel de Energía: ${l.energy}/10, Digestiones: ${l.digestion}/10, Adherencia a la dieta: ${l.adherence}, Notas: ${l.notes || 'Ninguna'}\n`;
    });
  } else {
    historyText = "\nNo hay registros históricos de salud o sensaciones recientes grabados aún.";
  }

  const prompt = `Actúa como Nutricionista Deportivo de Élite para un maratoniano de alto nivel.
  PERFIL ATLETA: Peso ${weight}kg, Altura ${height}cm, IMC ${imc}, %Grasa 8.5%.
  CONTEXTO ACTUAL DE ENTRENAMIENTO: Ha acumulado un volumen de ${totalKm} esta semana. Faltan ${daysLeft} días para el Maratón de Valencia (07/12).
  
  PREFERENCIAS ALIMENTARIAS Y RESTRICCIONES:
  - Tipo de Dieta: ${preferences.type || 'omnivora'}
  - Ingredientes terminantemente excluidos (ALERGIAS / EVITAR): ${preferences.avoid || 'Ninguno'}
  - Ingredientes y proteínas preferidas: ${preferences.favorites || 'Ninguno'}
  ${historyText}

  TAREA CRÍTICA (IA ADAPTATIVA Y AUTODIDACTA):
  Analiza la telemetría reciente del atleta para adaptar y optimizar de forma inteligente y autodidacta su plan de alimentación semanal:
  1. Si en el historial se reporta un nivel de energía menor de 8/10 en tiradas largas o entrenamientos de carrera, aumenta estratégicamente las porciones de carbohidratos complejos (arroz integral, avena, batata, quinoa) en las cenas del día previo y los desayunos de ese día.
  2. Si reporta pesadez o malas digestiones (menor de 8/10), evita terminantemente grasas pesadas, lácteos enteros o exceso de fibra de difícil digestión en las ingestas previas a correr.
  3. Si el peso corporal fluctúa por debajo de su peso óptimo de carrera, aumenta moderadamente el aporte calórico con grasas saludables (aguacate, frutos secos, aceite de oliva virgen extra) y proteínas de calidad.
  4. Diseña recetas sencillas y prácticas si la adherencia del atleta en los registros recientes fue baja o media.
  5. Asegura un cumplimiento absoluto de su tipo de dieta y excluye rigurosamente los ingredientes a evitar.

  Devuelve un objeto JSON estructurado con dos claves obligatorias:
  "plan" (un array de 7 objetos, cada uno con {dia, desayuno, comida, cena})
  "compra" (un array de categorías de ingredientes, cada una con {categoria, items: [array de strings]}).`;
  
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

async function generateWeeklyTrainingIA() {
  const btn = document.getElementById('btn-gen-training');
  btn.classList.add('loading');

  const totalKm = document.getElementById('kpi-dist').textContent;
  const best5k = "21:59";
  const daysLeft = document.getElementById('days-counter').textContent;

  const coachEvents = JSON.parse(localStorage.getItem('coach_events') || '[]');
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  
  let coachInfo = "";
  if (coachEvents.length > 0) {
    coachInfo = "IMPORTANTE: El entrenador humano del atleta ya le ha asignado los siguientes entrenamientos inamovibles esta semana:\\n";
    coachEvents.forEach(e => {
      const d = new Date(e.date).getDay();
      coachInfo += `- ${dayNames[d]}: ${e.summary}\\n`;
    });
    coachInfo += "TAREA CRÍTICA: Debes incluir EXACTAMENTE esos días de entrenamiento humano en tu respuesta (manteniendo el día y la descripción). Para los días restantes, GENERA sesiones complementarias (Fuerza, Descanso activo o Híbrido) que sirvan de apoyo a esos días fuertes. NO modifiques los días del entrenador.";
  } else {
    coachInfo = "TAREA: Genera un plan de 7 días que combine sesiones de carrera (Running) y Fuerza (Fuerza/Core).";
  }

  const prompt = `Actúa como Entrenador de Maratón Nivel Pro. 
  ATLETA: Víctor. Estado actual: ${totalKm} acumulados esta semana. Mejor 5K: ${best5k}.
  META: Maratón Valencia en ${daysLeft} días.
  ${coachInfo}
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

  const coachEvents = JSON.parse(localStorage.getItem('coach_events') || '[]');
  
  // Mapeo de días para buscar en el calendario del coach
  const dayMap = { 'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sábado': 6, 'Domingo': 0 };

  el.innerHTML = `
    <div class="grid7-training">
      ${data.map(d => {
        // Buscar si hay algo del coach para este día de la semana (simplificado)
        const dayIdx = dayMap[d.dia];
        const coachMatch = coachEvents.find(e => {
          const eventDate = new Date(e.date);
          return eventDate.getDay() === dayIdx;
        });

        return `
          <div class="training-card type-${d.tipo.toLowerCase()} ${coachMatch ? 'is-coach' : ''}">
            <div style="display:flex; justify-content:space-between; align-items:start">
              <div class="label-tech" style="font-size:9px; margin-bottom:5px">${d.dia}</div>
              ${coachMatch ? '<span class="badge-coach">VALENCE FIT</span>' : ''}
            </div>
            <div class="card-title" style="font-size:13px; margin-bottom:5px">${d.tipo}</div>
            <div style="font-size:11px; line-height:1.4; color:var(--text-sub)">${d.sesion}</div>
            
            ${coachMatch ? `
              <div class="coach-instruction">
                <b style="color:var(--blue); text-transform:uppercase; font-size:9px">Misión Coach:</b><br>
                ${coachMatch.summary}
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
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

  if (pageId === 'training') {
    const savedTraining = localStorage.getItem('weekly_training');
    if (savedTraining) {
      renderTrainingTable(JSON.parse(savedTraining));
    } else {
      renderWeeklyTraining();
    }
  }
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
  renderSmartSupplementBanner();
}

function renderSmartSupplementBanner() {
  const banner = document.getElementById('supp-smart-banner');
  if (!banner) return;
  const hour = new Date().getHours();
  const suppState = JSON.parse(localStorage.getItem('supp_done_today') || '{}');

  let text = '';
  if (hour < 13) {
    const done = suppState['omega'] && suppState['crea'];
    text = done ? '✅ <b>Mañana:</b> Omega-3 y Creatina ya tomados.' : '🌅 <b>Ahora (Mañana):</b> Toca tomar Omega-3 y Creatina con el desayuno.';
  } else if (hour < 21) {
    const done = suppState['whey'];
    text = done ? '✅ <b>Tarde:</b> Proteína post-entreno completada.' : '⚡ <b>Post-Entreno:</b> Recuerda tomar la Whey Protein tras entrenar.';
  } else {
    const done = suppState['mag'];
    text = done ? '✅ <b>Noche:</b> Magnesio listo para descansar.' : '🌙 <b>Noche:</b> Toca Magnesio antes de dormir para relajación muscular.';
  }
  banner.innerHTML = text;
}

function downloadSupplementAlarmsICS() {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//VIROL 42.2//Suplementacion//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'SUMMARY:VIROL: Omega-3 + Creatina (Desayuno)',
    'DESCRIPTION:Toma matutina con el desayuno: Omega-3 y Creatina.',
    'DTSTART:20260101T083000',
    'DTEND:20260101T084500',
    'RRULE:FREQ=DAILY',
    'BEGIN:VALARM',
    'TRIGGER:-PT0M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Recordatorio: Omega-3 y Creatina',
    'END:VALARM',
    'END:VEVENT',
    'BEGIN:VEVENT',
    'SUMMARY:VIROL: Whey Protein (Post-Entreno)',
    'DESCRIPTION:Toma post-entrenamiento para recuperacion muscular.',
    'DTSTART:20260101T203000',
    'DTEND:20260101T204500',
    'RRULE:FREQ=DAILY',
    'BEGIN:VALARM',
    'TRIGGER:-PT0M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Recordatorio: Proteina post-entreno',
    'END:VALARM',
    'END:VEVENT',
    'BEGIN:VEVENT',
    'SUMMARY:VIROL: Magnesio (Noche)',
    'DESCRIPTION:Toma antes de dormir para descanso muscular y sueno.',
    'DTSTART:20260101T213000',
    'DTEND:20260101T214500',
    'RRULE:FREQ=DAILY',
    'BEGIN:VALARM',
    'TRIGGER:-PT0M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Recordatorio: Magnesio nocturno',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'VIROL_Alarmas_Suplementos.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  alert('¡Archivo de alarmas generado! Ábrelo en tu móvil para activar los recordatorios diarios en tu calendario.');
}

function enablePwaNotifications() {
  if (!('Notification' in window)) {
    alert('Tu navegador no soporta notificaciones directas. Usa el botón "Alarmas Móvil" para añadirlas a tu calendario.');
    return;
  }
  Notification.requestPermission().then(perm => {
    const btn = document.getElementById('btn-pwa-notif');
    if (perm === 'granted') {
      if (btn) btn.innerHTML = '✓ Avisos Activos';
      if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification('VIROL 42.2', {
            body: '¡Avisos de suplementación y telemetría activados!',
            icon: './virol_logo.png'
          });
        });
      }
      alert('¡Notificaciones PWA activadas!');
    } else {
      alert('Permiso de notificaciones no concedido.');
    }
  });
}

function toggleBioModal(show) {
  const modal = document.getElementById('modal-edit-bio');
  if (!modal) return;
  if (show) {
    const pesoEl = document.getElementById('bio-peso');
    const alturaEl = document.getElementById('bio-altura');
    const grasaEl = document.getElementById('bio-grasa');
    
    const pesoInput = document.getElementById('edit-bio-peso');
    const alturaInput = document.getElementById('edit-bio-altura');
    const grasaInput = document.getElementById('edit-bio-grasa');

    if (pesoInput && pesoEl) pesoInput.value = parseFloat(pesoEl.innerText) || 70;
    if (alturaInput && alturaEl) alturaInput.value = parseFloat(alturaEl.innerText) || 178;
    if (grasaInput && grasaEl) grasaInput.value = parseFloat(grasaEl.innerText) || 8.5;
  }
  modal.classList.toggle('active', show);
}

function saveBioProfile() {
  const peso = parseFloat(document.getElementById('edit-bio-peso').value);
  const altura = parseFloat(document.getElementById('edit-bio-altura').value);
  const grasa = parseFloat(document.getElementById('edit-bio-grasa').value);

  if (isNaN(peso) || peso <= 0 || isNaN(altura) || altura <= 0) {
    alert('Por favor introduce valores válidos.');
    return;
  }

  const profile = { peso, altura, grasa: isNaN(grasa) ? 8.5 : grasa };
  localStorage.setItem('bio_profile', JSON.stringify(profile));

  const bioPesoEl = document.getElementById('bio-peso');
  const bioAlturaEl = document.getElementById('bio-altura');
  const bioGrasaEl = document.getElementById('bio-grasa');

  if (bioPesoEl) bioPesoEl.innerText = peso;
  if (bioAlturaEl) bioAlturaEl.innerText = altura;
  if (bioGrasaEl) bioGrasaEl.innerText = profile.grasa + '%';

  updateBioProfile();
  toggleBioModal(false);
  alert('¡Perfil antropométrico actualizado!');
}

function loadBioProfile() {
  const saved = localStorage.getItem('bio_profile');
  if (saved) {
    try {
      const profile = JSON.parse(saved);
      const bioPesoEl = document.getElementById('bio-peso');
      const bioAlturaEl = document.getElementById('bio-altura');
      const bioGrasaEl = document.getElementById('bio-grasa');

      if (bioPesoEl && profile.peso) bioPesoEl.innerText = profile.peso;
      if (bioAlturaEl && profile.altura) bioAlturaEl.innerText = profile.altura;
      if (bioGrasaEl && profile.grasa !== undefined) bioGrasaEl.innerText = profile.grasa + '%';
    } catch(e) {}
  }
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
const WORKER_URL = 'https://virol.v-roiglo1991.workers.dev/api/entrenamientos'; 

function connectStrava() {
  alert('La sincronización ahora es automática y segura de fondo vía Cloudflare Workers.');
  initStrava();
}

async function initStrava() {
  const statusEl = document.getElementById('strava-status');
  
  // Mostrar datos guardados instantáneamente
  const savedData = localStorage.getItem('strava_cached_data');
  if (savedData) {
    STRAVA_DATA = JSON.parse(savedData);
    renderStravaActivities();
    updateRacePredictions();
  }

  // Pedir actualización al Worker
  if (statusEl) statusEl.innerHTML = '<span style="color:var(--text-sub)">● Sincronizando...</span>';
  await fetchStravaActivities();
}

async function fetchStravaActivities() {
  const statusEl = document.getElementById('strava-status');
  try {
    const response = await fetch(WORKER_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    if (Array.isArray(data)) {
      STRAVA_DATA = data.map(a => {
        const d = new Date(a.start_date_local);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return {
          date: `${day}/${month}/${year}`,
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
      if (statusEl) statusEl.innerHTML = '<span style="color:#32D74B">● Sincronizado</span>';
    }
  } catch (e) { 
    console.error('Error fetching Strava activities from Worker', e);
    if (statusEl) statusEl.innerHTML = '<span style="color:var(--primary-orange)">● Sin conexión / Usando Caché</span>';
  }
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

// ===================== GOOGLE CALENDAR SYNC =====================
function saveIcalLink() {
  const link = document.getElementById('ical-link-input').value.trim();
  if (!link) return;
  localStorage.setItem('ical_link', link);
  syncCalendar();
  alert('¡Calendario vinculado! Sincronizando entrenamientos...');
}

async function syncCalendar() {
  const link = localStorage.getItem('ical_link');
  if (!link) return;

  try {
    // Usar el proxy local del Cloudflare Worker, rápido y seguro sin CORS
    const proxyUrl = '/api/calendar?url=' + encodeURIComponent(link);
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error('Error al descargar el calendario');
    const icsText = await response.text();
    const events = parseICS(icsText);
    localStorage.setItem('coach_events', JSON.stringify(events));
    
    const savedTraining = localStorage.getItem('weekly_training');
    if (savedTraining) renderTrainingTable(JSON.parse(savedTraining));
  } catch (e) { console.error('Error cal:', e); }
}

function parseICS(icsText) {
  const events = [];
  const lines = icsText.split(/\r?\n/);
  let currentEvent = null;
  for (let line of lines) {
    if (line.startsWith('BEGIN:VEVENT')) currentEvent = {};
    else if (line.startsWith('END:VEVENT')) {
      if (currentEvent && currentEvent.summary) events.push(currentEvent);
      currentEvent = null;
    } else if (currentEvent) {
      if (line.startsWith('SUMMARY:')) currentEvent.summary = line.substring(8);
      if (line.startsWith('DESCRIPTION:')) currentEvent.description = line.substring(12).replace(/\\n/g, '\n');
      if (line.startsWith('DTSTART')) {
        const match = line.match(/\d{8}/);
        if (match) {
          const d = match[0];
          currentEvent.date = `${d.substring(0,4)}-${d.substring(4,6)}-${d.substring(6,8)}`;
        }
      }
    }
  }
  return events;
}

// ===================== MANUAL ACTIVITY MODAL =====================
function toggleManualActivityModal(show) {
  const modal = document.getElementById('modal-add-activity');
  if(modal) modal.classList.toggle('active', show);
}

function submitNewActivity() {
  addNewActivity();
  toggleManualActivityModal(false);
}
