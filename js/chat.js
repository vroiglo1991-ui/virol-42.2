/**
 * BIOFLOW - VALENCIA 42K PRO
 * chat.js - Chatbot Agéntico, Acciones en la App y Modo Entrevista
 */

function dispatchChatActions(actions) {
  if (!Array.isArray(actions) || actions.length === 0) return [];

  const executedNotes = [];
  const mList = (typeof getMercadonaList === 'function') ? getMercadonaList() : {};

  for (const act of actions) {
    if (!act || !act.type) continue;

    // 1. ADD_MERCADONA_ITEM
    if (act.type === 'ADD_MERCADONA_ITEM') {
      const catKey = (act.category && mList[act.category]) ? act.category : 'fresh';
      const name = act.name || 'Producto';
      const weight = act.weight || '1 ud';
      if (mList[catKey] && Array.isArray(mList[catKey].items)) {
        mList[catKey].items.push({ name, weight, checked: false });
        executedNotes.push(`+ ${name} en Mercadona`);
      }
    }

    // 2. REMOVE_MERCADONA_ITEM
    else if (act.type === 'REMOVE_MERCADONA_ITEM') {
      const target = (act.name || '').toLowerCase();
      for (const cat of Object.values(mList)) {
        if (cat && Array.isArray(cat.items)) {
          const idx = cat.items.findIndex(it => it.name.toLowerCase().includes(target));
          if (idx !== -1) {
            const removed = cat.items.splice(idx, 1)[0];
            executedNotes.push(`- ${removed.name} de Mercadona`);
            break;
          }
        }
      }
    }

    // 3. ADD_MEAL_ITEM
    else if (act.type === 'ADD_MEAL_ITEM') {
      if (typeof appState !== 'undefined') {
        if (!appState.customMeals && typeof DEFAULT_MEALS !== 'undefined') {
          appState.customMeals = JSON.parse(JSON.stringify(DEFAULT_MEALS));
        }
        const mealKey = act.meal || 'snack';
        if (appState.customMeals && appState.customMeals[mealKey]) {
          const itemObj = { qty: act.qty || '1 ud', text: act.text || act.name || 'Alimento' };
          if (!Array.isArray(appState.customMeals[mealKey].items)) {
            appState.customMeals[mealKey].items = [];
          }
          appState.customMeals[mealKey].items.push(itemObj);
          executedNotes.push(`+ ${itemObj.text} en ${appState.customMeals[mealKey].name.split(' ')[0]}`);
        }
      }
    }

    // 4. REMOVE_MEAL_ITEM
    else if (act.type === 'REMOVE_MEAL_ITEM') {
      if (typeof appState !== 'undefined') {
        if (!appState.customMeals && typeof DEFAULT_MEALS !== 'undefined') {
          appState.customMeals = JSON.parse(JSON.stringify(DEFAULT_MEALS));
        }
        const mealKey = act.meal || 'snack';
        const target = (act.text || act.name || '').toLowerCase();
        if (appState.customMeals && appState.customMeals[mealKey] && Array.isArray(appState.customMeals[mealKey].items)) {
          const idx = appState.customMeals[mealKey].items.findIndex(it => 
            (it.text || '').toLowerCase().includes(target) || (it.name || '').toLowerCase().includes(target)
          );
          if (idx !== -1) {
            const removed = appState.customMeals[mealKey].items.splice(idx, 1)[0];
            executedNotes.push(`- ${removed.text || removed.name} de ${mealKey}`);
          }
        }
      }
    }

    // 5. ADJUST_WORKOUT
    else if (act.type === 'ADJUST_WORKOUT') {
      if (typeof appState !== 'undefined') {
        if (!appState.customWorkouts && typeof DEFAULT_WORKOUTS !== 'undefined') {
          appState.customWorkouts = JSON.parse(JSON.stringify(DEFAULT_WORKOUTS));
        }
        const day = act.dayIdx !== undefined ? Number(act.dayIdx) : 4;
        if (appState.customWorkouts && appState.customWorkouts[day]) {
          if (act.km !== undefined) appState.customWorkouts[day].km = Number(act.km);
          if (act.note) appState.customWorkouts[day].meta = act.note;
          executedNotes.push(`Ajustado entreno ${appState.customWorkouts[day].name}`);
        }
      }
    }

    // 6. TRIGGER_NOTIFICATION
    else if (act.type === 'TRIGGER_NOTIFICATION') {
      const title = act.title || '🚨 AVISO DEL COACH';
      const body = act.message || act.body || 'Nuevo recordatorio de tu preparación Valencia 42K';
      if (typeof triggerSystemNotification === 'function') {
        triggerSystemNotification(title, body, 'coach-alert-' + Date.now());
      }
      executedNotes.push(`Notificación: ${title}`);
    }

    // 7. SET_ALARM
    else if (act.type === 'SET_ALARM') {
      if (typeof appState !== 'undefined') {
        if (!appState.alarms) appState.alarms = {};
        const alarmKey = act.alarm || 'workout';
        if (appState.alarms[alarmKey]) {
          if (act.time) appState.alarms[alarmKey].time = act.time;
          if (act.title) appState.alarms[alarmKey].title = act.title;
          appState.alarms[alarmKey].enabled = true;
          if (typeof updateAlarmsUI === 'function') updateAlarmsUI();
          executedNotes.push(`Alarma ${alarmKey} programada (${act.time || appState.alarms[alarmKey].time})`);
        }
      }
    }

    // 8. CHECK_ITEM — marca un suplemento, comida o entreno como completado hoy
    else if (act.type === 'CHECK_ITEM' || act.type === 'UNCHECK_ITEM') {
      const itemKey = act.key;
      if (itemKey && typeof appState !== 'undefined' && typeof getTodayKey === 'function') {
        const todayKey = getTodayKey(selectedDayIndex);
        if (!appState.days[todayKey]) appState.days[todayKey] = {};
        const newVal = act.type === 'CHECK_ITEM';
        appState.days[todayKey][itemKey] = newVal;
        // Actualizar la UI del checkbox correspondiente
        const chkEl = document.querySelector(`#tab-today input[data-chk="${itemKey}"]`);
        if (chkEl) chkEl.checked = newVal;
        if (typeof updateProgressHUD === 'function') updateProgressHUD(selectedDayIndex);
        const labelMap = {
          supp_creatina: 'Creatina ✔', supp_omega3: 'Omega 3 ✔', supp_whey: 'Whey ✔', supp_magnesio: 'Magnesio ✔',
          meal_desayuno: 'Desayuno ✔', meal_snack: 'Media mañana ✔', meal_comida: 'Comida ✔',
          meal_merienda: 'Merienda ✔', meal_cena: 'Cena ✔', workoutCompleted: 'Entreno ✔'
        };
        executedNotes.push(newVal ? `${labelMap[itemKey] || itemKey} marcado` : `${itemKey} desmarcado`);
      }
    }
  }

  if (executedNotes.length > 0) {
    try {
      if (typeof saveState === 'function') saveState(appState);
      if (typeof renderMercadonaList === 'function') renderMercadonaList();
      if (typeof renderMealChecklist === 'function') renderMealChecklist(selectedDayIndex);
      if (typeof renderMealsTab === 'function') renderMealsTab();
      if (typeof renderScheduleCards === 'function') renderScheduleCards();
      if (typeof renderMission === 'function') renderMission(selectedDayIndex);
      if (typeof playCheckSound === 'function') playCheckSound();
      if (typeof showToast === 'function') showToast(`⚡ COACH: ${executedNotes.join(' • ')}`);
    } catch (renderErr) {
      console.warn('Error al actualizar vistas de la app:', renderErr);
    }
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
  let isChatSending = false; // guard: evita doble envío simultáneo

  btnOpen.addEventListener('click', () => {
    modal.classList.add('active');
    setTimeout(() => input.focus(), 100);
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  });

  const btnDietAdvisor = document.getElementById('btn-chat-diet-advisor');
  if (btnDietAdvisor) {
    btnDietAdvisor.addEventListener('click', () => {
      modal.classList.add('active');
      input.value = 'Coach, quiero ajustar mi menú de comidas según mi entrenamiento. ¿Qué me recomiendas cambiar o añadir?';
      setTimeout(() => input.focus(), 100);
    });
  }

  const closeModal = () => modal.classList.remove('active');
  btnClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  const addMessage = (text, type, actions = [], interview = null) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${type}-message`;
    
    let contentHtml = '';
    if (type === 'ai') {
      contentHtml += `<img src="img/coach_gorilla.webp" class="chat-msg-avatar" alt="Coach Gorila">`;
    }
    contentHtml += `<div class="msg-bubble">${(text || '').replace(/\n/g, '<br>')}`;

    // Insignia de acciones ejecutadas
    if (actions && actions.length > 0) {
      contentHtml += `
        <div class="chat-action-badge">
          <span class="chat-action-badge-tag">⚡ ACCIÓN EJECUTADA:</span>
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
    if (!text || isChatSending) return; // guard: no doble envío

    isChatSending = true;
    btnSend.disabled = true;
    input.disabled = true;
    input.value = '';
    addMessage(text, 'user');
    chatHistory.push({ role: 'user', content: text });

    // Preparar contexto ultra-completo con estado de checkboxes del día
    let weeklyRunningKm = 0;
    for (let i = 0; i < 7; i++) {
      const dayData = appState.days && appState.days[getTodayKey(i)];
      if (dayData && dayData.stravaActivity && dayData.stravaActivity.distanceKm) {
        weeklyRunningKm += parseFloat(dayData.stravaActivity.distanceKm) || 0;
      }
    }

    const todayData = (appState.days && appState.days[getTodayKey(selectedDayIndex)]) || {};
    const context = {
      weeklyKm: weeklyRunningKm,
      weight: (appState.profile && appState.profile.weight) || 73,
      goal: "Maratón Valencia 42K",
      meals: (typeof getMeals === 'function') ? getMeals() : {},
      mercadonaList: (typeof getMercadonaList === 'function') ? getMercadonaList() : {},
      recentActivities: (appState.days ? Object.values(appState.days) : []).map(d => d.stravaActivity).filter(Boolean),
      todayState: {
        dayIndex: selectedDayIndex,
        workoutCompleted: !!todayData.workoutCompleted,
        supp_creatina: !!todayData.supp_creatina,
        supp_omega3: !!todayData.supp_omega3,
        supp_whey: !!todayData.supp_whey,
        supp_magnesio: !!todayData.supp_magnesio,
        meal_desayuno: !!todayData.meal_desayuno,
        meal_snack: !!todayData.meal_snack,
        meal_comida: !!todayData.meal_comida,
        meal_merienda: !!todayData.meal_merienda,
        meal_cena: !!todayData.meal_cena,
        sleepHours: todayData.sleepHours || 8
      }
    };

    // Indicador de carga con avatar del gorila
    const loadingId = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message ai-message';
    loadingDiv.id = loadingId;
    loadingDiv.innerHTML = `<img src="img/coach_gorilla.webp" class="chat-msg-avatar" alt="Coach Gorila"><div class="msg-bubble spin">⏳ El Gorila está analizando tus métricas...</div>`;
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context, history: chatHistory.slice(-6) })
      });

      document.getElementById(loadingId)?.remove();

      const rawData = await res.text();
      let data = {};
      try { data = JSON.parse(rawData); } catch (_) {}

      if (!res.ok) {
        const errorMsg = data.error || data.detail || `Error en el servidor (${res.status})`;
        throw new Error(errorMsg);
      }
      
      // Ejecutar acciones en la app si el Coach las prescribió de forma segura
      let executed = [];
      try {
        executed = dispatchChatActions(data.actions);
      } catch (actErr) {
        console.warn('Error al despachar acciones del coach:', actErr);
      }

      if (data.reply) {
        chatHistory.push({ role: 'model', content: data.reply });
        addMessage(data.reply, 'ai', executed, data.interview_mode);
      } else {
        addMessage('Ha habido un error al procesar tu solicitud.', 'ai');
      }
    } catch (err) {
      document.getElementById(loadingId)?.remove();
      addMessage(`❌ Error de conexión con el Coach: ${err.message}. Inténtalo de nuevo.`, 'ai');
    } finally {
      isChatSending = false;
      btnSend.disabled = false;
      input.disabled = false;
      setTimeout(() => input.focus(), 50);
    }
  };

  btnSend.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}
