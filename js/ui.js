/**
 * BIOFLOW PRO - UI RENDERING & INTERACTION CONTROLLER
 * Manages HUD, themes, countdowns, meal/workout checklists, plan editor modal,
 * alarms config UI, and Mercadona market list.
 */

// TOAST HELPER
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

// PROFILE HUD
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

// THEME CONTROLLER
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

// COUNTDOWN CALCULATION
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

// DAY MISSION & CHECKLIST
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
  if (typeof renderStravaHUD === 'function') {
    renderStravaHUD(dayIndex);
  }
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

  const rpeInput = document.getElementById('daily-rpe');
  if (rpeInput) {
    rpeInput.value = dayData.rpe !== undefined ? dayData.rpe : 7;
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

function initSupplementsChecklist() {
  const container = document.getElementById('supplements-checklist');
  if (!container) return;

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
        const nameEl = chk.closest('.chk-item')?.querySelector('.chk-name');
        showToast(`✔ SUPLEMENTO: ${nameEl ? nameEl.innerText : chkKey}`);
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

// PROGRESS HUD
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

// ARCHIVE & HISTORY (LONGITUDINAL TREND CHART & METRIC SNAPSHOTS)
function generateHistoryChartSVG(history) {
  const data = [...history].reverse(); // Oldest to newest (left to right)
  const N = data.length;
  if (N === 0) return '';

  const W = 680;
  const H = 220;
  const padL = 48;
  const padR = 48;
  const padT = 30;
  const padB = 35;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const maxKmVal = Math.max(...data.map(d => parseFloat(d.km) || 0), 10);
  const maxKm = Math.ceil(maxKmVal / 10) * 10 || 50;
  const maxRPE = 10;

  const points = data.map((d, i) => {
    const x = N === 1 ? padL + plotW / 2 : padL + (i / (N - 1)) * plotW;
    const km = parseFloat(d.km) || 0;
    const rpe = parseFloat(d.avgRPE !== undefined ? d.avgRPE : 7.0);
    const sleep = parseFloat(d.avgSleep !== undefined ? d.avgSleep : 8.0);
    const vdot = parseFloat(d.vdot !== undefined ? d.vdot : 38.6);

    const yKm = padT + plotH - (km / maxKm) * plotH;
    const yRpe = padT + plotH - (rpe / maxRPE) * plotH;

    return {
      x,
      yKm: Math.min(padT + plotH, Math.max(padT, yKm)),
      yRpe: Math.min(padT + plotH, Math.max(padT, yRpe)),
      km,
      rpe,
      sleep,
      vdot,
      date: d.date || `Semana ${i + 1}`,
      weekNum: i + 1,
      origIdx: history.length - 1 - i
    };
  });

  // Grid lines (0, 25%, 50%, 75%, 100%)
  let gridLines = '';
  for (let k = 0; k <= 4; k++) {
    const ratio = k / 4;
    const y = padT + plotH - ratio * plotH;
    const kmVal = Math.round(ratio * maxKm);
    const rpeVal = (ratio * 10).toFixed(1).replace('.0', '');
    gridLines += `
      <line x1="${padL}" y1="${y}" x2="${padL + plotW}" y2="${y}" stroke="var(--border-card)" stroke-dasharray="3,3" stroke-width="1" opacity="0.35" />
      <text x="${padL - 8}" y="${y + 4}" font-size="10" fill="var(--c-volt)" text-anchor="end" font-family="monospace" font-weight="700">${kmVal}k</text>
      <text x="${padL + plotW + 8}" y="${y + 4}" font-size="10" fill="var(--c-orange)" text-anchor="start" font-family="monospace" font-weight="700">${rpeVal}</text>
    `;
  }

  const kmPolyPoints = points.map(p => `${p.x.toFixed(1)},${p.yKm.toFixed(1)}`).join(' ');
  const kmAreaPoints = `${points[0].x.toFixed(1)},${padT + plotH} ` + kmPolyPoints + ` ${points[points.length - 1].x.toFixed(1)},${padT + plotH}`;
  const rpePolyPoints = points.map(p => `${p.x.toFixed(1)},${p.yRpe.toFixed(1)}`).join(' ');

  let kmDots = '';
  let rpeDots = '';
  let xLabels = '';

  points.forEach(p => {
    xLabels += `
      <text x="${p.x.toFixed(1)}" y="${H - 10}" font-size="10" fill="var(--text-muted)" text-anchor="middle" font-family="sans-serif" font-weight="700">SEM ${p.weekNum}</text>
    `;

    kmDots += `
      <g class="chart-point" data-info="Semana #${p.weekNum} (${p.date}) • 🏃 ${p.km} KM • 🔥 RPE ${p.rpe} • 💤 ${p.sleep}h Sueño • ⚡ VDOT ${p.vdot}">
        <circle cx="${p.x.toFixed(1)}" cy="${p.yKm.toFixed(1)}" r="6" fill="#0b0f19" stroke="var(--c-volt)" stroke-width="3" style="cursor:pointer;" />
        <text x="${p.x.toFixed(1)}" y="${(p.yKm - 10).toFixed(1)}" font-size="10" fill="var(--c-volt)" font-weight="900" text-anchor="middle" font-family="sans-serif">${p.km}k</text>
      </g>
    `;

    rpeDots += `
      <g class="chart-point" data-info="Semana #${p.weekNum} (${p.date}) • 🔥 RPE ${p.rpe}/10">
        <circle cx="${p.x.toFixed(1)}" cy="${p.yRpe.toFixed(1)}" r="5" fill="#0b0f19" stroke="var(--c-orange)" stroke-width="2.5" style="cursor:pointer;" />
        <text x="${p.x.toFixed(1)}" y="${(p.yRpe + 14).toFixed(1)}" font-size="9" fill="var(--c-orange)" font-weight="900" text-anchor="middle" font-family="sans-serif">${p.rpe}</text>
      </g>
    `;
  });

  return `
    <div class="history-chart-card">
      <div class="history-chart-top">
        <div class="chart-legend-row">
          <span class="legend-item"><span class="legend-dot volt"></span> <strong>KM SEMANALES (VOLUMEN)</strong></span>
          <span class="legend-item"><span class="legend-dot orange"></span> <strong>RPE MEDIO (ESFUERZO 1-10)</strong></span>
        </div>
        <div class="chart-axis-info">
          <span style="color:var(--c-volt); font-size:0.75rem; font-family:monospace; font-weight:700;">◄ Eje Izq: KM</span>
          <span style="color:var(--c-orange); font-size:0.75rem; font-family:monospace; font-weight:700;">Eje Der: RPE (1-10) ►</span>
        </div>
      </div>
      <div class="chart-svg-container">
        <svg viewBox="0 0 ${W} ${H}" class="history-line-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="histKmAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--c-volt)" stop-opacity="0.3" />
              <stop offset="100%" stop-color="var(--c-volt)" stop-opacity="0.0" />
            </linearGradient>
          </defs>
          ${gridLines}
          <polygon points="${kmAreaPoints}" fill="url(#histKmAreaGrad)" />
          <polyline points="${kmPolyPoints}" fill="none" stroke="var(--c-volt)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
          <polyline points="${rpePolyPoints}" fill="none" stroke="var(--c-orange)" stroke-width="2.5" stroke-dasharray="6,3" stroke-linecap="round" stroke-linejoin="round" />
          ${kmDots}
          ${rpeDots}
          ${xLabels}
        </svg>
      </div>
      <div id="history-chart-tooltip" class="history-chart-tooltip" style="display:none;"></div>
    </div>
  `;
}

function renderHistory() {
  const container = document.getElementById('history-list');
  const chartWrapper = document.getElementById('history-chart-wrapper');
  const summaryStats = document.getElementById('history-summary-stats');
  if (!container) return;

  const history = appState.history || [];

  if (history.length === 0) {
    if (chartWrapper) chartWrapper.innerHTML = '';
    if (summaryStats) summaryStats.innerHTML = '';
    container.innerHTML = `<div class="history-empty">Aún no has archivado semanas. Al terminar el domingo, pulsa 'ARCHIVAR SEMANA' para registrar tu progreso histórico y ver tus gráficas de tendencia.</div>`;
    return;
  }

  // Summary stats badges
  const totalKmSum = history.reduce((acc, it) => acc + (parseFloat(it.km) || 0), 0).toFixed(1);
  const avgRpeHist = (history.reduce((acc, it) => acc + (parseFloat(it.avgRPE !== undefined ? it.avgRPE : 7.0)), 0) / history.length).toFixed(1);
  const latestVDOT = history[0].vdot !== undefined ? history[0].vdot : 38.6;

  if (summaryStats) {
    summaryStats.innerHTML = `
      <span class="badge-volt-black" title="Semanas completas registradas">${history.length} SEMANAS</span>
      <span class="badge-volt-black" title="Kilómetros acumulados en el historial">${totalKmSum} KM TOTALES</span>
      <span class="badge-orange-black" title="RPE promedio de todas las semanas archivadas">RPE HISTÓRICO: ${avgRpeHist}</span>
    `;
  }

  // Render SVG Chart
  if (chartWrapper) {
    chartWrapper.innerHTML = generateHistoryChartSVG(history);

    // Attach interactive hover tooltips
    const tooltipEl = document.getElementById('history-chart-tooltip');
    chartWrapper.querySelectorAll('.chart-point').forEach(pt => {
      pt.addEventListener('mouseenter', (e) => {
        if (tooltipEl) {
          tooltipEl.innerText = pt.getAttribute('data-info') || '';
          tooltipEl.style.display = 'block';
        }
      });
      pt.addEventListener('mouseleave', () => {
        if (tooltipEl) tooltipEl.style.display = 'none';
      });
      pt.addEventListener('click', (e) => {
        if (tooltipEl) {
          tooltipEl.innerText = pt.getAttribute('data-info') || '';
          tooltipEl.style.display = 'block';
        }
      });
    });
  }

  // Render History List Cards
  container.innerHTML = history.map((item, idx) => {
    const weekNumber = history.length - idx;
    const km = parseFloat(item.km || 0).toFixed(1);
    const rpe = item.avgRPE !== undefined ? item.avgRPE : '7.0';
    const sleep = item.avgSleep !== undefined ? item.avgSleep : '8.0';
    const vdot = item.vdot !== undefined ? item.vdot : '38.6';
    const sessions = item.sessionsDone !== undefined ? item.sessionsDone : '-';

    return `
      <div class="history-item">
        <div class="history-item-left">
          <div class="history-week-num">SEMANA #${weekNumber} • <span style="color:var(--text-muted); font-weight:normal;">${item.date}</span></div>
          <div class="history-metrics-pills">
            <span class="hist-pill pill-sessions">🏃 ${sessions} sesiones</span>
            <span class="hist-pill pill-rpe">🔥 RPE ${rpe}</span>
            <span class="hist-pill pill-sleep">💤 ${sleep}h sueño</span>
            <span class="hist-pill pill-vdot">⚡ VDOT ${vdot}</span>
          </div>
        </div>
        <div class="history-item-right">
          <div class="history-km">${km} <span style="font-size:0.9rem; color:var(--text-muted);">KM</span></div>
          <button class="btn-del-history" onclick="deleteHistoryWeek(${idx})" title="Eliminar registro de esta semana">
            <svg class="svg-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function deleteHistoryWeek(index) {
  if (!appState.history || !appState.history[index]) return;
  const item = appState.history[index];
  if (!confirm(`¿Eliminar del historial la semana #${appState.history.length - index} (${item.date} • ${item.km} km)?`)) {
    return;
  }
  appState.history.splice(index, 1);
  saveState(appState);
  renderHistory();
  showToast('🗑️ Semana eliminada del historial.');
}
window.deleteHistoryWeek = deleteHistoryWeek;

function archiveCurrentWeek() {
  let totalKm = 0;
  let sessionsDone = 0;
  let sleepSum = 0;
  let rpeSum = 0;
  let rpeCount = 0;

  [1, 2, 3, 4, 5, 6, 0].forEach(d => {
    const key = getTodayKey(d);
    const dayData = appState.days[key] || {};
    const plan = (typeof WORKOUT_PLANS !== 'undefined' && WORKOUT_PLANS[d]) || {};
    if (dayData.workoutCompleted) {
      totalKm += parseFloat(plan.km || 0);
      sessionsDone++;
    }
    sleepSum += parseFloat(dayData.sleepHours || 8);

    if (dayData.rpe !== undefined && dayData.rpe !== null && dayData.rpe !== '') {
      rpeSum += parseFloat(dayData.rpe);
      rpeCount++;
    } else if (dayData.workoutCompleted) {
      const estRPE = plan.isRest ? 3.0 : (plan.km > 15 ? 8.0 : (plan.km > 0 ? 7.0 : 7.5));
      rpeSum += estRPE;
      rpeCount++;
    }
  });

  const avgSleep = parseFloat((sleepSum / 7).toFixed(1));
  const avgRPE = rpeCount > 0 ? parseFloat((rpeSum / rpeCount).toFixed(1)) : 7.0;

  // Calculate current VDOT at this moment
  let currentVDOT = 38.6;
  if (typeof calculateVDOT === 'function' && appState.running && appState.running.benchmark) {
    const bm = appState.running.benchmark;
    const distM = (parseFloat(bm.distanceKm) || 8.51) * 1000;
    const timeS = parseInt(bm.movingTimeSec, 10) || 2949;
    currentVDOT = parseFloat(calculateVDOT(distM, timeS).toFixed(1));
  }

  const dateStr = new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' });

  if (!confirm(`¿Archivar la semana con ${totalKm.toFixed(1)} km completados (RPE medio: ${avgRPE}, Sueño medio: ${avgSleep}h, VDOT: ${currentVDOT}) y reiniciar checks para una nueva semana?`)) {
    return;
  }

  if (!appState.history) appState.history = [];
  appState.history.unshift({
    date: dateStr,
    timestamp: Date.now(),
    km: parseFloat(totalKm.toFixed(1)),
    sessionsDone,
    avgSleep,
    avgRPE,
    vdot: currentVDOT
  });

  // Reset current week days
  appState.days = {};
  saveState(appState);

  playSuccessSound();
  renderMission(selectedDayIndex);
  renderHistory();
  showToast(`📁 ¡SEMANA ARCHIVADA (${totalKm.toFixed(1)} KM • RPE ${avgRPE} • VDOT ${currentVDOT})!`);
}

// ALARMS UI & NOTIFICATION PERMISSIONS
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

// MERCADONA MARKET CHECKLIST
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
