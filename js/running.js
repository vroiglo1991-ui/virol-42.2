/**
 * BIOFLOW PRO - RUNNING PHYSIOLOGY ENGINE (JACK DANIELS VDOT & PETER RIEGEL)
 * Calculates physiological thresholds, marathon split predictions, and training paces.
 */

// JACK DANIELS VDOT FORMULA (Daniels & Gilbert formula)
function calculateVDOT(distanceMeters, timeSeconds) {
  if (distanceMeters <= 0 || timeSeconds <= 0) return 38.6;
  const timeMinutes = timeSeconds / 60;
  const v = distanceMeters / timeMinutes; // Velocity in meters/min

  // Oxygen cost of running at velocity v
  const vo2 = -4.60 + 0.182258 * v + 0.000104 * Math.pow(v, 2);

  // Percentage of VO2max sustainable over timeMinutes
  const pctVO2max = 0.8 + 0.1894393 * Math.exp(-0.012778 * timeMinutes) + 0.2989558 * Math.exp(-0.1932605 * timeMinutes);

  const vdot = vo2 / pctVO2max;
  return Math.max(25, Math.min(85, vdot));
}

// PETER RIEGEL FORMULA: T2 = T1 * (D2 / D1)^exponent
function predictRaceTimeRiegel(d1Meters, t1Seconds, d2Meters, exponent = 1.06) {
  if (d1Meters <= 0 || t1Seconds <= 0) return 0;
  return t1Seconds * Math.pow(d2Meters / d1Meters, exponent);
}

// Velocity for a specific target % of VO2max given VDOT
function getVelocityFromVDOT(vdot, percentVO2) {
  const targetVO2 = vdot * percentVO2;
  // Solve 0.000104 * v^2 + 0.182258 * v - (targetVO2 + 4.60) = 0
  const a = 0.000104;
  const b = 0.182258;
  const c = -(targetVO2 + 4.60);
  const v = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
  return v; // m/min
}

function velocityToPaceSecondsPerKm(v) {
  if (v <= 0) return 360;
  return (1000 / v) * 60;
}

function formatPaceMinSec(totalSeconds) {
  if (!totalSeconds || isNaN(totalSeconds) || totalSeconds <= 0) return '--:--';
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.round(totalSeconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function formatTimeHMS(totalSeconds) {
  if (!totalSeconds || isNaN(totalSeconds) || totalSeconds <= 0) return '--:--';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  }
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
}

function getDanielsTrainingPaces(vdot) {
  // Zone intensities according to Jack Daniels Running Formula:
  // Easy (E): ~65-74% VO2max
  // Marathon (M): ~80-84% VO2max
  // Threshold (T): ~87-89% VO2max
  // Interval (I): ~97-100% VO2max
  // Repetition (R): ~105-110% VO2max

  const vE_slow = getVelocityFromVDOT(vdot, 0.65);
  const vE_fast = getVelocityFromVDOT(vdot, 0.74);
  const paceE_slow = velocityToPaceSecondsPerKm(vE_slow);
  const paceE_fast = velocityToPaceSecondsPerKm(vE_fast);

  const vM_slow = getVelocityFromVDOT(vdot, 0.80);
  const vM_fast = getVelocityFromVDOT(vdot, 0.84);
  const paceM_slow = velocityToPaceSecondsPerKm(vM_slow);
  const paceM_fast = velocityToPaceSecondsPerKm(vM_fast);

  const vT_slow = getVelocityFromVDOT(vdot, 0.87);
  const vT_fast = getVelocityFromVDOT(vdot, 0.89);
  const paceT_slow = velocityToPaceSecondsPerKm(vT_slow);
  const paceT_fast = velocityToPaceSecondsPerKm(vT_fast);

  const vI_slow = getVelocityFromVDOT(vdot, 0.97);
  const vI_fast = getVelocityFromVDOT(vdot, 1.00);
  const paceI_slow = velocityToPaceSecondsPerKm(vI_slow);
  const paceI_fast = velocityToPaceSecondsPerKm(vI_fast);

  const vR_slow = getVelocityFromVDOT(vdot, 1.05);
  const vR_fast = getVelocityFromVDOT(vdot, 1.10);
  const paceR_slow = velocityToPaceSecondsPerKm(vR_slow);
  const paceR_fast = velocityToPaceSecondsPerKm(vR_fast);

  return {
    easy: `${formatPaceMinSec(paceE_fast)} - ${formatPaceMinSec(paceE_slow)}`,
    marathon: `${formatPaceMinSec(paceM_fast)} - ${formatPaceMinSec(paceM_slow)}`,
    threshold: `${formatPaceMinSec(paceT_fast)} - ${formatPaceMinSec(paceT_slow)}`,
    interval: `${formatPaceMinSec(paceI_fast)} - ${formatPaceMinSec(paceI_slow)}`,
    repetition: `${formatPaceMinSec(paceR_fast)} - ${formatPaceMinSec(paceR_slow)}`
  };
}

function renderRunningTab() {
  const running = appState.running || {};
  const benchmark = running.benchmark || {
    name: 'Carrera de mañana (Martes)',
    distanceKm: 8.51,
    movingTimeSec: 2949,
    paceStr: '5:46/km',
    elevation: 8,
    heartRate: 154
  };

  const distMeters = (benchmark.distanceKm || 8.51) * 1000;
  const timeSeconds = benchmark.movingTimeSec || 2949;

  // 1. Calculate Daniels VDOT
  const vdot = calculateVDOT(distMeters, timeSeconds);
  const vdotFormatted = vdot.toFixed(1);

  // Update Benchmark HUD
  const vdotPill = document.getElementById('running-vdot-pill');
  if (vdotPill) vdotPill.innerText = `VDOT ${vdotFormatted}`;

  const benchName = document.getElementById('bench-activity-name');
  if (benchName) benchName.innerText = benchmark.name || 'Sesión de carrera';

  const benchDist = document.getElementById('bench-distance');
  if (benchDist) benchDist.innerHTML = `${benchmark.distanceKm} <span class="unit">KM</span>`;

  const benchTime = document.getElementById('bench-time');
  if (benchTime) benchTime.innerText = formatTimeHMS(timeSeconds);

  const benchPace = document.getElementById('bench-pace');
  if (benchPace) benchPace.innerText = benchmark.paceStr || `${formatPaceMinSec((timeSeconds / distMeters) * 1000)} /km`;

  const benchElev = document.getElementById('bench-elevation');
  if (benchElev) benchElev.innerText = `${benchmark.elevation || 8} m • ${benchmark.heartRate || 154} ppm`;

  // 2. Race Predictions (Half 21.097 km & Full Marathon 42.195 km)
  // Peter Riegel: exponent 1.06 for Half Marathon, 1.07 for Full Marathon (accounting for amateur marathon fatigue)
  const predHalfSeconds = predictRaceTimeRiegel(distMeters, timeSeconds, 21097, 1.06);
  const predFullSeconds = predictRaceTimeRiegel(distMeters, timeSeconds, 42195, 1.07);

  // Half Marathon metrics
  const halfPaceSec = predHalfSeconds / 21.097;
  const halfSpeedKmh = (21.097 / (predHalfSeconds / 3600)).toFixed(1);
  const halfSplit10 = formatTimeHMS(halfPaceSec * 10);

  const predHalfTimeEl = document.getElementById('pred-half-time');
  if (predHalfTimeEl) predHalfTimeEl.innerText = formatTimeHMS(predHalfSeconds);

  const predHalfPaceEl = document.getElementById('pred-half-pace');
  if (predHalfPaceEl) predHalfPaceEl.innerHTML = `${formatPaceMinSec(halfPaceSec)} <span class="unit">/km</span>`;

  const predHalfSpeedEl = document.getElementById('pred-half-speed');
  if (predHalfSpeedEl) predHalfSpeedEl.innerHTML = `${halfSpeedKmh} <span class="unit">KM/H</span>`;

  const predHalfSplit10El = document.getElementById('pred-half-split10');
  if (predHalfSplit10El) predHalfSplit10El.innerText = halfSplit10;

  // Full Marathon metrics
  const fullPaceSec = predFullSeconds / 42.195;
  const fullSpeedKmh = (42.195 / (predFullSeconds / 3600)).toFixed(1);
  const fullSplit21 = formatTimeHMS(fullPaceSec * 21.097);
  const fullSplit30 = formatTimeHMS(fullPaceSec * 30.0);

  const predFullTimeEl = document.getElementById('pred-full-time');
  if (predFullTimeEl) predFullTimeEl.innerText = formatTimeHMS(predFullSeconds);

  const predFullPaceEl = document.getElementById('pred-full-pace');
  if (predFullPaceEl) predFullPaceEl.innerHTML = `${formatPaceMinSec(fullPaceSec)} <span class="unit">/km</span>`;

  const predFullSpeedEl = document.getElementById('pred-full-speed');
  if (predFullSpeedEl) predFullSpeedEl.innerHTML = `${fullSpeedKmh} <span class="unit">KM/H</span>`;

  const predFullSplit21El = document.getElementById('pred-full-split21');
  if (predFullSplit21El) predFullSplit21El.innerText = fullSplit21;

  const predFullSplit30El = document.getElementById('pred-full-split30');
  if (predFullSplit30El) predFullSplit30El.innerText = fullSplit30;

  // 3. Weekly Volume & Fatigue Semaphore
  let weeklyRunningKm = 0;
  for (let i = 0; i < 7; i++) {
    const dayKey = getTodayKey(i);
    const dayData = appState.days[dayKey];
    if (dayData && dayData.stravaActivity && dayData.stravaActivity.distanceKm) {
      weeklyRunningKm += parseFloat(dayData.stravaActivity.distanceKm) || 0;
    }
  }

  // If no day has Strava data logged yet in state, show benchmark distance as active week sample
  if (weeklyRunningKm === 0 && benchmark.distanceKm) {
    weeklyRunningKm = benchmark.distanceKm;
  }

  const targetWeeklyKm = running.weeklyTargetKm || 44.0;
  const volumePct = Math.min(130, Math.round((weeklyRunningKm / targetWeeklyKm) * 100));

  const progressKmEl = document.getElementById('semaphore-progress-km');
  if (progressKmEl) {
    progressKmEl.innerHTML = `<strong>${weeklyRunningKm.toFixed(2)}</strong> / ${targetWeeklyKm.toFixed(2)} KM ACUMULADOS EN LA SEMANA`;
  }

  const progressPctEl = document.getElementById('semaphore-progress-pct');
  if (progressPctEl) {
    progressPctEl.innerText = `${volumePct}%`;
  }

  const fillBar = document.getElementById('semaphore-fill-bar');
  if (fillBar) {
    fillBar.style.width = `${Math.min(100, volumePct)}%`;
  }

  const statusPill = document.getElementById('semaphore-status-pill');
  const statusTxt = document.getElementById('semaphore-status-text');
  if (statusPill && statusTxt) {
    if (weeklyRunningKm < 35.0) {
      statusPill.style.background = '#3b82f6';
      statusPill.style.color = '#ffffff';
      statusTxt.innerText = `DESCARGA / INICIO (${volumePct}%)`;
    } else if (weeklyRunningKm >= 35.0 && weeklyRunningKm <= 46.0) {
      statusPill.style.background = 'var(--c-volt)';
      statusPill.style.color = '#000000';
      statusTxt.innerText = `ZONA ÓPTIMA MARATÓN (${volumePct}%)`;
    } else if (weeklyRunningKm > 46.0 && weeklyRunningKm <= 52.0) {
      statusPill.style.background = '#eab308';
      statusPill.style.color = '#000000';
      statusTxt.innerText = `ALTA CARGA SEMANAL (${volumePct}%)`;
    } else {
      statusPill.style.background = '#ef4444';
      statusPill.style.color = '#ffffff';
      statusTxt.innerText = `SOBRECARGA / FATIGA (${volumePct}%)`;
    }
  }

  // 4. Jack Daniels Training Paces
  const danielsPaces = getDanielsTrainingPaces(vdot);
  const danielsLbl = document.getElementById('daniels-vdot-lbl');
  if (danielsLbl) danielsLbl.innerText = vdotFormatted;

  const paceE = document.getElementById('pace-val-e');
  if (paceE) paceE.innerHTML = `${danielsPaces.easy} <span class="unit">/km</span>`;

  const paceM = document.getElementById('pace-val-m');
  if (paceM) paceM.innerHTML = `${danielsPaces.marathon} <span class="unit">/km</span>`;

  const paceT = document.getElementById('pace-val-t');
  if (paceT) paceT.innerHTML = `${danielsPaces.threshold} <span class="unit">/km</span>`;

  const paceI = document.getElementById('pace-val-i');
  if (paceI) paceI.innerHTML = `${danielsPaces.interval} <span class="unit">/km</span>`;

  const paceR = document.getElementById('pace-val-r');
  if (paceR) paceR.innerHTML = `${danielsPaces.repetition} <span class="unit">/km</span>`;
}

function initRunningModule() {
  renderRunningTab();

  // Button to trigger Strava sync from running view
  const btnSync = document.getElementById('btn-running-sync-strava');
  if (btnSync) {
    btnSync.addEventListener('click', () => {
      playCheckSound();
      openStravaModal();
    });
  }

  // Button to simulate Victor's real run
  const btnSim = document.getElementById('btn-running-simulate-run');
  if (btnSim) {
    btnSim.addEventListener('click', () => {
      simulateTodayRun();
      renderRunningTab();
      showToast('⚡ Sesión real de 8.51 km aplicada como benchmark activo');
    });
  }

  // Benchmark editor modal
  const btnEditBench = document.getElementById('btn-open-benchmark-editor');
  const benchModal = document.getElementById('benchmark-modal-overlay');
  const btnCloseBench = document.getElementById('btn-close-benchmark-modal');
  const btnCancelBench = document.getElementById('btn-cancel-benchmark');
  const btnSaveBench = document.getElementById('btn-save-benchmark');

  const distInp = document.getElementById('input-bench-dist');
  const minInp = document.getElementById('input-bench-min');
  const secInp = document.getElementById('input-bench-sec');

  if (btnEditBench && benchModal) {
    btnEditBench.addEventListener('click', () => {
      const bm = (appState.running && appState.running.benchmark) || {};
      if (distInp) distInp.value = bm.distanceKm || 8.51;
      const totalSec = bm.movingTimeSec || 2949;
      if (minInp) minInp.value = Math.floor(totalSec / 60);
      if (secInp) secInp.value = totalSec % 60;
      benchModal.classList.add('active');
    });
  }

  const closeBenchModal = () => {
    if (benchModal) benchModal.classList.remove('active');
  };

  if (btnCloseBench) btnCloseBench.addEventListener('click', closeBenchModal);
  if (btnCancelBench) btnCancelBench.addEventListener('click', closeBenchModal);

  // Presets in benchmark modal
  const presetToday = document.getElementById('btn-bench-preset-today');
  if (presetToday) {
    presetToday.addEventListener('click', () => {
      if (distInp) distInp.value = '8.51';
      if (minInp) minInp.value = '49';
      if (secInp) secInp.value = '9';
    });
  }

  const preset10k = document.getElementById('btn-bench-preset-10k');
  if (preset10k) {
    preset10k.addEventListener('click', () => {
      if (distInp) distInp.value = '10.00';
      if (minInp) minInp.value = '55';
      if (secInp) secInp.value = '0';
    });
  }

  const preset5k = document.getElementById('btn-bench-preset-5k');
  if (preset5k) {
    preset5k.addEventListener('click', () => {
      if (distInp) distInp.value = '5.00';
      if (minInp) minInp.value = '26';
      if (secInp) secInp.value = '30';
    });
  }

  // Save Benchmark
  if (btnSaveBench) {
    btnSaveBench.addEventListener('click', () => {
      const d = parseFloat(distInp?.value) || 8.51;
      const m = parseInt(minInp?.value) || 49;
      const s = parseInt(secInp?.value) || 0;
      const totalSec = (m * 60) + s;
      const paceSec = totalSec / d;

      if (!appState.running) appState.running = {};
      appState.running.benchmark = {
        name: `Test Personal (${d} km)`,
        distanceKm: d,
        movingTimeSec: totalSec,
        paceStr: `${formatPaceMinSec(paceSec)}/km`,
        elevation: 8,
        heartRate: 154
      };

      saveState(appState);
      renderRunningTab();
      closeBenchModal();
      playSuccessSound();
      showToast(`🎯 ¡PREDICCIONES RECALCULADAS CON ${d} KM EN ${m}:${String(s).padStart(2, '0')}!`);
    });
  }
}
