/**
 * VALENCIA 42K PRO - ATHLETIC BRUTALIST ENGINE
 * Víctor // 73 kg • 178 cm
 * Core Orchestrator & Bootstrap
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Render profile HUD
  renderProfileHUD();

  // 2. Apply visual theme
  applyTheme(appState.themeSetting || 'auto');

  // 3. Sound toggle button
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

  // 4. Theme cycle button
  const themeBtn = document.getElementById('btn-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', cycleTheme);
  }

  // 5. Marathon Countdowns
  updateCountdowns();
  setInterval(updateCountdowns, 60000);

  // 6. Day selector pills
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

  // 7. Render Core Views & Modules
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

  // 8. Tab navigation helper
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

  // 9. Tab navigation listeners
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      window.switchToTab(targetTab);
      playCheckSound();
    });
  });

  // 10. Countdown cards linking to Running tab
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

  // 11. Workout complete toggle
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

  // 12. Supplement Checkboxes listeners
  initSupplementsChecklist();

  // 13. Sleep hours input listener
  const sleepInput = document.getElementById('sleep-hours');
  if (sleepInput) {
    sleepInput.addEventListener('change', () => {
      const todayKey = getTodayKey(selectedDayIndex);
      if (!appState.days[todayKey]) appState.days[todayKey] = {};
      appState.days[todayKey].sleepHours = parseFloat(sleepInput.value) || 8;
      saveState(appState);
    });
  }

  // 14. Mercadona List & Actions
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

  // 15. Archive week button
  const archiveBtn = document.getElementById('btn-archive-week');
  if (archiveBtn) {
    archiveBtn.addEventListener('click', archiveCurrentWeek);
  }

  // 16. Alarm interval check (every 30 seconds)
  setInterval(checkAlarms, 30000);

  // 17. Cloud sync manual trigger & background listeners
  const syncBadge = document.getElementById('sync-status-badge');
  if (syncBadge) {
    syncBadge.addEventListener('click', () => {
      playCheckSound();
      syncFromCloud(false);
    });
  }

  // Automatic sync when switching back to the app from mobile or another tab
  window.addEventListener('focus', () => {
    syncFromCloud(true);
    checkAlarms(true); // catch-up: dispara alarmas de los últimos 5 min
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      syncFromCloud(true);
      checkAlarms(true);
    }
  });
  window.addEventListener('online', () => syncFromCloud(false));

  // Periodic background check every 12 seconds
  setInterval(() => syncFromCloud(true), 12000);

  // Initial cloud sync on startup
  syncFromCloud(false);

  // 18. Register PWA Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.log('SW registration note:', err);
    });
  }

  // 19. Initialize Chatbot
  initChatbot();
});
