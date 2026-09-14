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
    // Ventana de tolerancia de hasta 3 min (o 10 min en catchUp) para no perder alarmas por estrangulamiento de timers en móviles
    const inWindow = diffMin >= 0 && diffMin <= (catchUpMode ? 10 : 3);

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

// ─── WEB PUSH REAL EN SEGUNDO PLANO (ESTILO GMAIL / INFOJOBS) ─────
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function subscribeToRealPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    alert('Tu navegador o dispositivo no soporta Web Push en segundo plano.\nEn iPhone: asegúrate de haber añadido la app a la Pantalla de Inicio (PWA en iOS 16.4+).');
    return false;
  }

  try {
    const reg = await navigator.serviceWorker.ready;
    if (!reg) {
      alert('Service Worker no listo aún. Espera un segundo y vuelve a intentarlo.');
      return false;
    }

    // 1. Pedir permiso explícito al usuario
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      alert('Debes conceder el permiso de Notificaciones para recibir las alertas en tu móvil.');
      return false;
    }

    // 2. Obtener clave pública VAPID del Cloudflare Worker
    const vapidUrl = (typeof apiUrl === 'function') ? apiUrl('/api/push/vapid-public-key') : '/api/push/vapid-public-key';
    const keyRes = await fetch(vapidUrl);
    if (!keyRes.ok) throw new Error('No se pudo obtener la clave VAPID');
    const { publicKey } = await keyRes.json();

    // 3. Suscribirse a Apple/Google Push Manager
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    });

    // 4. Guardar suscripción en D1
    const subUrl = (typeof apiUrl === 'function') ? apiUrl('/api/push/subscribe') : '/api/push/subscribe';
    const postRes = await fetch(subUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: sub,
        userId: 'u_victor'
      })
    });

    if (postRes.ok) {
      if (typeof showToast === 'function') {
        showToast('🔔 ¡MÓVIL REGISTRADO PARA PUSH EN SEGUNDO PLANO!');
      }
      if (typeof playSuccessSound === 'function') playSuccessSound();
      return true;
    } else {
      throw new Error('Error al registrar dispositivo en el servidor');
    }
  } catch (err) {
    console.error('Error al suscribir a Push:', err);
    alert('Error activando notificaciones push: ' + err.message);
    return false;
  }
}

async function triggerRealPushTest(delaySeconds = 5) {
  try {
    const testUrl = (typeof apiUrl === 'function') ? apiUrl('/api/push/test') : '/api/push/test';
    const res = await fetch(testUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '⚡ VIROL // VALENCIA 42K PRO',
        body: '¡PRUEBA REAL EXITOSA! Notificación recibida con el móvil en segundo plano.',
        delaySeconds: delaySeconds
      })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      alert(`⏱️ ¡Alerta programada en ${delaySeconds} segundos!\n\nBLOQUEA LA PANTALLA de tu móvil AHORA MISMO para comprobar que suena y vibra en la pantalla de bloqueo.`);
    } else {
      alert(data.message || 'No se pudo enviar la prueba. Asegúrate de haber pulsado antes "Activar Notificaciones Push".');
    }
  } catch (err) {
    alert('Error al probar push: ' + err.message);
  }
}

window.subscribeToRealPushNotifications = subscribeToRealPushNotifications;
window.triggerRealPushTest = triggerRealPushTest;
