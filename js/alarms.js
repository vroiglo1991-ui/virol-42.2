/**
 * BIOFLOW - VALENCIA 42K PRO
 * alarms.js - Motor de Sonidos Web Audio API, Notificaciones y Verificación de Alarmas
 */

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
  if (typeof appState !== 'undefined' && appState.soundEnabled === false) return;
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
  if (typeof appState !== 'undefined' && appState.soundEnabled === false) return;
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
  if (typeof appState !== 'undefined' && appState.soundEnabled === false) return;
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

async function triggerSystemNotification(title, body, tag = 'virol-alert') {
  playAlarmSound();
  if (typeof showToast === 'function') {
    showToast(`🔔 ${title}: ${body}`);
  }

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

function checkAlarms(catchUpMode = false) {
  const now = new Date();
  if (typeof appState === 'undefined' || !appState.alarms) return;

  const currentDay = now.getDay();
  const todayPlan = (typeof WORKOUT_PLANS !== 'undefined' && WORKOUT_PLANS[currentDay]) ? WORKOUT_PLANS[currentDay] : {};

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
    if (!item || !item.enabled || !item.time) return;

    // Ventana de tolerancia de ±5 minutos para recuperar alarmas perdidas
    const [alH, alM] = item.time.split(':').map(Number);
    const alarmTotalMin = alH * 60 + alM;
    const nowTotalMin = now.getHours() * 60 + now.getMinutes();
    const diffMin = nowTotalMin - alarmTotalMin;
    const inWindow = diffMin >= 0 && diffMin <= (catchUpMode ? 5 : 0);

    if (inWindow) {
      const todayStr = now.toDateString();
      const lastKey = `_lastTriggered_${todayStr}`;
      if (!item[lastKey]) {
        item[lastKey] = true;
        triggerSystemNotification(al.title, al.getBody(), `alarm-${al.key}`);
        if (typeof saveState === 'function') {
          saveState(appState, false); // guardar sin push cloud para no spamear
        }
      }
    }
  });
}
