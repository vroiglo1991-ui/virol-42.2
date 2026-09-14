/**
 * BIOFLOW - VALENCIA 42K PRO
 * sync.js - Sincronización en la Nube y Resilencia Offline
 */

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
    const syncUrl = (typeof apiUrl === 'function') ? apiUrl('/api/sync') : ((typeof CLOUD_SYNC_URL !== 'undefined') ? CLOUD_SYNC_URL : '/api/sync');
    
    const payload = {
      version: 1,
      appName: 'VIROL 42K PRO',
      athlete: (appState.profile && appState.profile.name) ? appState.profile.name : 'Víctor',
      profile: appState.profile || null,
      lastUpdated: appState.lastUpdated || Date.now(),
      days: appState.days || {},
      history: appState.history || [],
      themeSetting: appState.themeSetting || 'auto',
      soundEnabled: appState.soundEnabled !== false,
      customMeals: appState.customMeals || null,
      customWorkouts: appState.customWorkouts || null,
      mercadonaList: appState.mercadonaList || null,
      strava: appState.strava || null,
      alarms: appState.alarms || null,
      running: appState.running || null
    };

    const res = await fetch(syncUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.state && typeof data.state === 'object') {
        // Adoptar cualquier campo que el servidor haya fusionado con éxito
        if (data.lastUpdated) appState.lastUpdated = data.lastUpdated;
        const storageKey = (typeof STORAGE_KEY !== 'undefined') ? STORAGE_KEY : 'valencia_42k_victor_prod_v1';
        localStorage.setItem(storageKey, JSON.stringify(appState));
      }
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
    const syncUrl = (typeof apiUrl === 'function') ? apiUrl('/api/sync') : ((typeof CLOUD_SYNC_URL !== 'undefined') ? CLOUD_SYNC_URL : '/api/sync');
    const storageKey = (typeof STORAGE_KEY !== 'undefined') ? STORAGE_KEY : 'valencia_42k_victor_prod_v1';

    const res = await fetch(syncUrl, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const cloudData = await res.json();

    if (cloudData && typeof cloudData === 'object') {
      const localUpdated = appState.lastUpdated || 0;
      const cloudUpdated = cloudData.lastUpdated || 0;

      // Si la nube tiene cambios más recientes (ej. guardados desde el móvil)
      if (cloudUpdated > localUpdated) {
        console.log('Nuevos datos recibidos de la nube (fusión granular):', cloudData);

        // 1. Fusión granular de días
        if (cloudData.days && typeof cloudData.days === 'object') {
          if (!appState.days) appState.days = {};
          for (const [dayKey, dayVal] of Object.entries(cloudData.days)) {
            if (!appState.days[dayKey]) {
              appState.days[dayKey] = dayVal;
            } else {
              appState.days[dayKey] = Object.assign({}, appState.days[dayKey], dayVal);
            }
          }
        }

        // 2. Fusión granular de lista de Mercadona
        if (cloudData.mercadonaList && typeof cloudData.mercadonaList === 'object') {
          if (!appState.mercadonaList) {
            appState.mercadonaList = cloudData.mercadonaList;
          } else {
            for (const [catKey, catVal] of Object.entries(cloudData.mercadonaList)) {
              if (!appState.mercadonaList[catKey]) {
                appState.mercadonaList[catKey] = catVal;
              } else if (Array.isArray(catVal.items)) {
                const localItems = appState.mercadonaList[catKey].items || [];
                const mergedItems = [...catVal.items];
                for (const locIt of localItems) {
                  if (locIt && locIt.name && !mergedItems.some(it => it.name.trim().toLowerCase() === locIt.name.trim().toLowerCase())) {
                    mergedItems.push(locIt);
                  }
                }
                appState.mercadonaList[catKey].items = mergedItems;
              }
            }
          }
        }

        // 3. Fusión de historial semanal
        if (Array.isArray(cloudData.history)) {
          const histMap = new Map();
          for (const h of (appState.history || [])) {
            if (h) histMap.set(String(h.timestamp || h.date), h);
          }
          for (const h of cloudData.history) {
            if (h) histMap.set(String(h.timestamp || h.date), h);
          }
          appState.history = Array.from(histMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        }

        appState.lastUpdated = cloudUpdated;
        if (cloudData.profile) appState.profile = cloudData.profile;
        if (cloudData.themeSetting) appState.themeSetting = cloudData.themeSetting;
        if (typeof cloudData.soundEnabled === 'boolean') appState.soundEnabled = cloudData.soundEnabled;
        if (cloudData.customMeals) appState.customMeals = cloudData.customMeals;
        if (cloudData.customWorkouts) appState.customWorkouts = cloudData.customWorkouts;
        if (cloudData.strava) {
          if (cloudData.strava.token === 'e879a9119db61a2e1c8edaa6bf2c10faa9bad366') {
            cloudData.strava.token = '';
          }
          appState.strava = cloudData.strava;
        }
        if (cloudData.alarms) {
          appState.alarms = Object.assign({}, appState.alarms, cloudData.alarms);
          if (typeof updateAlarmsUI === 'function') updateAlarmsUI();
        }
        if (cloudData.running) {
          appState.running = Object.assign({}, appState.running, cloudData.running);
          if (typeof renderRunningTab === 'function') renderRunningTab();
        }

        localStorage.setItem(storageKey, JSON.stringify(appState));

        // Refrescar interfaces
        if (typeof renderProfileHUD === 'function') renderProfileHUD();
        if (typeof applyTheme === 'function') applyTheme(appState.themeSetting || 'auto');
        if (typeof renderMission === 'function') renderMission(selectedDayIndex);
        if (typeof renderHistory === 'function') renderHistory();
        if (typeof renderMealsTab === 'function') renderMealsTab();
        if (typeof renderMercadonaList === 'function') renderMercadonaList();
        if (typeof renderScheduleCards === 'function') renderScheduleCards();
        if (typeof renderRunningTab === 'function') renderRunningTab();

        updateSyncStatus('synced', 'NUBE OK');
        if (!silent && typeof showToast === 'function') {
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
