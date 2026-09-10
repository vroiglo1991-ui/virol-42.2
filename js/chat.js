/**
 * BIOFLOW - VALENCIA 42K PRO
 * chat.js - Chatbot Agéntico, Acciones en la App, Memoria Persistente y Modo Entrevista
 */

const MAX_CHAT_HISTORY = 50;
const DEFAULT_WELCOME_MSG = '¡Qué pasa Víctor! Aquí tu Coach Gorila. Tengo a la vista tus 44 km, tus macros de 2.850 kcal y tus sesiones Pull-Push-Legs. ¿Qué ajustamos hoy? ¿Entrenamiento, menú o lista de Mercadona?';

function getChatStorageKey(dayKey) {
  return `virol_chat_history_${dayKey || 'day_today'}`;
}

function loadSavedChatHistory(dayKey) {
  const k = dayKey || (typeof getTodayKey === 'function' ? getTodayKey(selectedDayIndex) : 'day_0');
  
  // 1. Intentar desde appState.days[k].chatHistory
  if (typeof appState !== 'undefined' && appState.days && appState.days[k] && Array.isArray(appState.days[k].chatHistory)) {
    return appState.days[k].chatHistory;
  }
  
  // 2. Intentar desde localStorage como respaldo
  try {
    const raw = localStorage.getItem(getChatStorageKey(k));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error leyendo historial persistente de chat:', e);
  }
  
  return [];
}

function saveChatHistoryToStorage(dayKey, history) {
  const k = dayKey || (typeof getTodayKey === 'function' ? getTodayKey(selectedDayIndex) : 'day_0');
  const trimmed = (history || []).slice(-MAX_CHAT_HISTORY);

  // Guardar en appState (sincronizable con nube / D1 / KV)
  if (typeof appState !== 'undefined') {
    if (!appState.days) appState.days = {};
    if (!appState.days[k]) appState.days[k] = {};
    appState.days[k].chatHistory = trimmed;
    if (typeof saveState === 'function') {
      saveState(appState, true);
    }
  }

  // Guardar también en localStorage directo
  try {
    localStorage.setItem(getChatStorageKey(k), JSON.stringify(trimmed));
  } catch (e) {
    console.warn('Error guardando historial persistente de chat en localStorage:', e);
  }
}

function clearChatHistoryForDay(dayKey) {
  const k = dayKey || (typeof getTodayKey === 'function' ? getTodayKey(selectedDayIndex) : 'day_0');
  if (typeof appState !== 'undefined' && appState.days && appState.days[k]) {
    appState.days[k].chatHistory = [];
    if (typeof saveState === 'function') {
      saveState(appState, true);
    }
  }
  try {
    localStorage.removeItem(getChatStorageKey(k));
  } catch (e) {
    console.warn('Error eliminando historial de chat:', e);
  }
}

let currentChatAddMessageFn = null;

function renderChatHistoryForCurrentDay() {
  const messagesContainer = document.getElementById('chat-messages');
  if (!messagesContainer || typeof currentChatAddMessageFn !== 'function') return;

  messagesContainer.innerHTML = '';
  const dayKey = (typeof getTodayKey === 'function') ? getTodayKey(selectedDayIndex) : 'day_0';
  const history = loadSavedChatHistory(dayKey);

  // Actualizar etiqueta del día en el encabezado
  const dayTag = document.getElementById('chat-header-day-tag');
  if (dayTag) {
    const workouts = (typeof getWorkouts === 'function') ? getWorkouts() : (typeof DEFAULT_WORKOUTS !== 'undefined' ? DEFAULT_WORKOUTS : {});
    const dayName = workouts[selectedDayIndex]?.name || `DÍA ${selectedDayIndex}`;
    dayTag.innerText = `GORILA IRON // ${dayName} (EN LÍNEA)`;
  }

  if (history.length === 0) {
    currentChatAddMessageFn(DEFAULT_WELCOME_MSG, 'ai', [], null, false);
  } else {
    history.forEach(item => {
      const type = (item.role === 'user') ? 'user' : 'ai';
      currentChatAddMessageFn(item.content || item.text, type, item.actions || [], item.interview || null, false);
    });
  }

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

window.updateChatForSelectedDay = renderChatHistoryForCurrentDay;

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
  const btnClearHistory = document.getElementById('btn-clear-chat-history');

  if (!btnOpen || !modal || !btnClose || !btnSend || !input || !messagesContainer) return;

  let isChatSending = false; // guard: evita doble envío simultáneo

  const addMessage = (text, type, actions = [], interview = null, shouldScroll = true) => {
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
    
    if (shouldScroll) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Vincular clics en quick reply chips
    msgDiv.querySelectorAll('.chat-reply-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const replyText = decodeURIComponent(chip.dataset.reply);
        input.value = replyText;
        sendMessage();
      });
    });
  };

  currentChatAddMessageFn = addMessage;

  // Cargar y mostrar historial persistente en el arranque inicial
  renderChatHistoryForCurrentDay();

  btnOpen.addEventListener('click', () => {
    modal.classList.add('active');
    renderChatHistoryForCurrentDay();
    setTimeout(() => input.focus(), 100);
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  });

  const btnDietAdvisor = document.getElementById('btn-chat-diet-advisor');
  if (btnDietAdvisor) {
    btnDietAdvisor.addEventListener('click', () => {
      modal.classList.add('active');
      renderChatHistoryForCurrentDay();
      input.value = 'Coach, quiero ajustar mi menú de comidas según mi entrenamiento. ¿Qué me recomiendas cambiar o añadir?';
      setTimeout(() => input.focus(), 100);
    });
  }

  const closeModal = () => modal.classList.remove('active');
  btnClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Botón para borrar historial de conversación
  if (btnClearHistory) {
    btnClearHistory.addEventListener('click', () => {
      const dayKey = (typeof getTodayKey === 'function') ? getTodayKey(selectedDayIndex) : 'day_0';
      const workouts = (typeof getWorkouts === 'function') ? getWorkouts() : (typeof DEFAULT_WORKOUTS !== 'undefined' ? DEFAULT_WORKOUTS : {});
      const dayName = workouts[selectedDayIndex]?.name || 'este día';

      if (confirm(`¿Quieres borrar el historial de conversación con el Coach para el ${dayName}?`)) {
        clearChatHistoryForDay(dayKey);
        renderChatHistoryForCurrentDay();
        if (typeof showToast === 'function') {
          showToast(`🗑️ Historial de conversación de ${dayName} reiniciado`);
        }
      }
    });
  }

  const sendMessage = async () => {
    const text = input.value.trim();
    if (!text || isChatSending) return; // guard: no doble envío

    isChatSending = true;
    btnSend.disabled = true;
    input.disabled = true;
    input.value = '';

    const dayKey = (typeof getTodayKey === 'function') ? getTodayKey(selectedDayIndex) : 'day_0';
    const currentHistory = loadSavedChatHistory(dayKey);

    // Renderizar y guardar mensaje del usuario inmediatamente
    addMessage(text, 'user');
    currentHistory.push({
      role: 'user',
      content: text,
      timestamp: Date.now()
    });
    saveChatHistoryToStorage(dayKey, currentHistory);

    // Preparar contexto ultra-completo con estado de checkboxes del día
    let weeklyRunningKm = 0;
    for (let i = 0; i < 7; i++) {
      const dayData = appState.days && appState.days[getTodayKey(i)];
      if (dayData && dayData.stravaActivity && dayData.stravaActivity.distanceKm) {
        weeklyRunningKm += parseFloat(dayData.stravaActivity.distanceKm) || 0;
      }
    }

    const todayData = (appState.days && appState.days[dayKey]) || {};
    const workouts = (typeof getWorkouts === 'function') ? getWorkouts() : (typeof DEFAULT_WORKOUTS !== 'undefined' ? DEFAULT_WORKOUTS : {});
    const todayWorkout = workouts[selectedDayIndex] || {};

    const context = {
      weeklyKm: weeklyRunningKm,
      weight: (appState.profile && appState.profile.weight) || 73,
      goal: "Maratón Valencia 42K",
      meals: (typeof getMeals === 'function') ? getMeals() : {},
      mercadonaList: (typeof getMercadonaList === 'function') ? getMercadonaList() : {},
      recentActivities: (appState.days ? Object.values(appState.days) : []).map(d => d.stravaActivity).filter(Boolean),
      todayWorkout: todayWorkout,
      todayState: {
        dayIndex: selectedDayIndex,
        dayName: todayWorkout.name || '',
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
      // Enviar los últimos 8 mensajes del historial guardado al backend
      const historyPayload = currentHistory.slice(-8).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.content || m.text || ''
      }));

      const activeWorkouts = (typeof getWorkouts === 'function') ? getWorkouts() : (typeof DEFAULT_WORKOUTS !== 'undefined' ? DEFAULT_WORKOUTS : {});
      const localClaudeKey = localStorage.getItem('virol_claude_key') || localStorage.getItem('virol_anthropic_key') || '';

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context,
          history: historyPayload,
          workouts: activeWorkouts,
          selectedDayIndex: selectedDayIndex,
          anthropicApiKey: localClaudeKey
        })
      });

      document.getElementById(loadingId)?.remove();

      const rawData = await res.text();
      let data = {};
      try { data = JSON.parse(rawData); } catch (_) {}

      if (!res.ok) {
        const errorMsg = data.error || data.detail || `Error en el servidor (${res.status})`;
        throw new Error(errorMsg);
      }
      
      let executed = [];

      // 1. Aplicar modificaciones reales de entrenamiento (Tool Use: modificar_entrenamiento)
      if (Array.isArray(data.modified_workouts) && data.modified_workouts.length > 0) {
        if (!appState.customWorkouts && typeof DEFAULT_WORKOUTS !== 'undefined') {
          appState.customWorkouts = JSON.parse(JSON.stringify(DEFAULT_WORKOUTS));
        }

        for (const mod of data.modified_workouts) {
          if (mod && mod.success && mod.dia_indice !== undefined && Array.isArray(mod.steps)) {
            if (!appState.customWorkouts[mod.dia_indice]) {
              appState.customWorkouts[mod.dia_indice] = JSON.parse(JSON.stringify(DEFAULT_WORKOUTS[mod.dia_indice] || {}));
            }
            appState.customWorkouts[mod.dia_indice].steps = mod.steps;
            if (mod.updatedWorkout) {
              if (mod.updatedWorkout.discipline) appState.customWorkouts[mod.dia_indice].discipline = mod.updatedWorkout.discipline;
              if (mod.updatedWorkout.title) appState.customWorkouts[mod.dia_indice].title = mod.updatedWorkout.title;
            }
            const dayLabel = appState.customWorkouts[mod.dia_indice].name || `DÍA ${mod.dia_indice}`;
            executed.push(`Entreno de ${dayLabel} modificado (${mod.steps.length} ejercicios)`);
          }
        }

        // Persistir en datos reales de la app y actualizar interfaz
        if (typeof saveState === 'function') saveState(appState, true);
        if (typeof renderMission === 'function') renderMission(selectedDayIndex);
        if (typeof renderScheduleCards === 'function') renderScheduleCards();
        if (typeof playSuccessSound === 'function') playSuccessSound();
        if (typeof showToast === 'function') showToast(`🏋️ PLAN ACTUALIZADO: ${executed.join(' • ')}`);
      }

      // 2. Ejecutar acciones adicionales prescritas
      try {
        const otherActions = dispatchChatActions(data.actions);
        if (Array.isArray(otherActions)) {
          executed = executed.concat(otherActions);
        }
      } catch (actErr) {
        console.warn('Error al despachar acciones del coach:', actErr);
      }

      if (data.reply) {
        currentHistory.push({
          role: 'model',
          content: data.reply,
          actions: executed,
          interview: data.interview_mode || null,
          timestamp: Date.now()
        });
        saveChatHistoryToStorage(dayKey, currentHistory);
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
