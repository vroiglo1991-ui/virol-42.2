/**
 * BIOFLOW - VALENCIA 42K PRO
 * cards.js - Generador de "Cards" HD (1080 x 1350 px)
 * Tarjetas gráficas atléticas para Instagram Stories, WhatsApp y Redes
 */

(function () {
  'use strict';

  let currentCardMode = 'week'; // 'today' | 'week'

  /**
   * Dibuja la cuadrícula táctica y miras en el canvas
   */
  function drawAthleticGrid(ctx, width, height) {
    ctx.save();
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
    ctx.lineWidth = 1;

    const step = 90;
    for (let x = step; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = step; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Miras tácticas (+) en las esquinas
    ctx.strokeStyle = '#D4FF00';
    ctx.lineWidth = 2;
    const corners = [
      [50, 50],
      [width - 50, 50],
      [50, height - 50],
      [width - 50, height - 50]
    ];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy);
      ctx.lineTo(cx + 15, cy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy - 15);
      ctx.lineTo(cx, cy + 15);
      ctx.stroke();
    });

    ctx.restore();
  }

  /**
   * Dibuja un rectángulo con esquinas redondeadas
   */
  function drawRoundedRect(ctx, x, y, w, h, radius, fillStyle, strokeStyle, lineWidth = 1) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Función principal que renderiza la Card atlética en alta resolución (1080x1350)
   */
  async function renderCard(canvas, options = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Asegurar fuentes cargadas
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (e) {
        console.warn('Font loading wait skipped:', e);
      }
    }

    const W = 1080;
    const H = 1350;
    canvas.width = W;
    canvas.height = H;

    const mode = options.mode || currentCardMode || 'week';
    const dayIdx = typeof options.dayIndex === 'number' ? options.dayIndex : (typeof selectedDayIndex === 'number' ? selectedDayIndex : new Date().getDay());

    const workouts = typeof getWorkouts === 'function' ? getWorkouts() : (typeof DEFAULT_WORKOUTS !== 'undefined' ? DEFAULT_WORKOUTS : {});
    const workout = workouts[dayIdx] || {};
    const state = typeof appState !== 'undefined' ? appState : {};
    const dayKey = `day_${dayIdx}`;
    const dayData = (state.days && state.days[dayKey]) || {};

    // 1. FONDO ATHLETIC DARK GRADIENT
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#06080E');
    bgGrad.addColorStop(0.5, '#0B101B');
    bgGrad.addColorStop(1, '#080B12');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. CUADRÍCULA TÁCTICA
    drawAthleticGrid(ctx, W, H);

    // 3. HEADER // BRANDING & FECHA
    drawRoundedRect(ctx, 80, 75, 340, 44, 6, 'rgba(212, 255, 0, 0.1)', '#D4FF00', 1.5);
    ctx.fillStyle = '#D4FF00';
    ctx.font = '700 16px "Space Grotesk", sans-serif';
    ctx.fillText('⚡ BIOFLOW // VALENCIA 42K PRO', 100, 103);

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    drawRoundedRect(ctx, W - 380, 75, 300, 44, 6, 'rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.2)', 1);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '700 16px "Space Grotesk", sans-serif';
    ctx.fillText(`📅 ${dateFormatted}`, W - 355, 103);

    // Separador con acento Volt
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 145);
    ctx.lineTo(W - 80, 145);
    ctx.stroke();

    ctx.strokeStyle = '#D4FF00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, 145);
    ctx.lineTo(240, 145);
    ctx.stroke();

    // ==========================================
    // RENDERIZADO SEGÚN EL MODO (TODAY vs WEEK)
    // ==========================================
    if (mode === 'today') {
      const isRun = workout.km > 0 || (workout.discipline && workout.discipline.includes('RUN'));
      const discTag = (workout.discipline || 'ENTRENAMIENTO').toUpperCase();
      const discColor = isRun ? '#D4FF00' : '#38BDF8';

      drawRoundedRect(ctx, 80, 185, 260, 42, 4, isRun ? 'rgba(212, 255, 0, 0.15)' : 'rgba(56, 189, 248, 0.15)', discColor, 1.5);
      ctx.fillStyle = discColor;
      ctx.font = '900 18px "Space Grotesk", sans-serif';
      ctx.fillText(`[ ${discTag} ]`, 100, 212);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 68px "Bebas Neue", sans-serif';
      const sessionTitle = (workout.title || 'ENTRENAMIENTO PROGRAMADO').toUpperCase();
      if (sessionTitle.length > 28) {
        ctx.font = '900 54px "Bebas Neue", sans-serif';
      }
      ctx.fillText(sessionTitle, 80, 295);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
      const metaText = (workout.meta || workout.intensity || 'Enfoque: Rendimiento y Constancia').toUpperCase();
      ctx.fillText(metaText.length > 56 ? metaText.slice(0, 56) + '...' : metaText, 80, 335);

      // MÉTRICAS HERO
      const boxW = 440;
      const boxH = 220;
      const yBox = 375;

      // Caja 1: Distancia / Volumen
      drawRoundedRect(ctx, 80, yBox, boxW, boxH, 8, '#0B111D', 'rgba(212, 255, 0, 0.35)', 2);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '700 16px "Space Grotesk", sans-serif';
      ctx.fillText(isRun ? 'DISTANCIA OBJETIVO' : 'VOLUMEN DE FUERZA', 105, yBox + 45);

      ctx.fillStyle = '#D4FF00';
      ctx.font = '900 96px "Bebas Neue", sans-serif';
      const mainStatNum = isRun ? `${workout.km || 0}` : (workout.steps ? `${workout.steps.length * 3}+` : '16+');
      ctx.fillText(mainStatNum, 105, yBox + 145);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 26px "Bebas Neue", sans-serif';
      ctx.fillText(isRun ? 'KILÓMETROS' : 'SERIES TOTALES', 105 + (mainStatNum.length * 45) + 15, yBox + 115);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(isRun ? 'Ritmo sostenido Zona 2' : 'Sobrecarga progresiva RPE 8', 105, yBox + 185);

      // Caja 2: Ritmo / Intensidad
      drawRoundedRect(ctx, W - 80 - boxW, yBox, boxW, boxH, 8, '#0B111D', 'rgba(56, 189, 248, 0.35)', 2);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '700 16px "Space Grotesk", sans-serif';
      ctx.fillText(isRun ? 'RITMO SUGERIDO' : 'INTENSIDAD DE SESIÓN', W - 80 - boxW + 25, yBox + 45);

      ctx.fillStyle = '#38BDF8';
      ctx.font = '900 84px "Bebas Neue", sans-serif';
      let paceVal = '5:50';
      if (typeof getPacesForVDOT === 'function' && typeof calculateVDOT === 'function') {
        const vdot = calculateVDOT(8.51, 2949);
        const paces = getPacesForVDOT(vdot);
        paceVal = workout.km >= 18 ? paces.M : paces.E.split(' - ')[0];
      }
      const secondaryStat = isRun ? `${paceVal}` : 'RPE 8.5';
      ctx.fillText(secondaryStat, W - 80 - boxW + 25, yBox + 145);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 26px "Bebas Neue", sans-serif';
      ctx.fillText(isRun ? '/KM' : 'FUERZA PURA', W - 80 - boxW + 25 + (secondaryStat.length * 38) + 15, yBox + 115);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(isRun ? 'Calibrado con VDOT Daniels' : 'Hipertrofia & Resistencia', W - 80 - boxW + 25, yBox + 185);

      // Estado de cumplimiento
      const isCompleted = !!dayData.workoutCompleted;
      const hasStrava = !!dayData.stravaActivity;
      const yStatus = 635;

      if (isCompleted || hasStrava) {
        drawRoundedRect(ctx, 80, yStatus, W - 160, 85, 8, 'rgba(34, 197, 94, 0.12)', '#22C55E', 2);
        ctx.fillStyle = '#22C55E';
        ctx.font = '900 28px "Space Grotesk", sans-serif';
        ctx.fillText('✔ SESIÓN COMPLETADA Y REGISTRADA', 110, yStatus + 52);

        if (hasStrava) {
          const act = dayData.stravaActivity;
          const distKm = (act.distance / 1000).toFixed(2);
          ctx.fillStyle = '#FC4C02';
          ctx.font = '700 18px "Space Grotesk", sans-serif';
          ctx.fillText(`⚡ STRAVA VERIFIED: ${distKm} KM`, W - 380, yStatus + 50);
        }
      } else {
        drawRoundedRect(ctx, 80, yStatus, W - 160, 85, 8, 'rgba(255, 90, 0, 0.10)', 'rgba(255, 90, 0, 0.5)', 1.5);
        ctx.fillStyle = '#FF5A00';
        ctx.font = '900 26px "Space Grotesk", sans-serif';
        ctx.fillText('⚡ SESIÓN PROGRAMADA // HOY', 110, yStatus + 52);

        ctx.fillStyle = '#94A3B8';
        ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Objetivo del día listo para ejecutar', W - 380, yStatus + 50);
      }

      // Suplementación
      const ySupps = 755;
      drawRoundedRect(ctx, 80, ySupps, W - 160, 95, 8, '#0E1422', 'rgba(255, 255, 255, 0.08)', 1);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '700 14px "Space Grotesk", sans-serif';
      ctx.fillText('NUTRICIÓN & PROTOCOLO DIARIO (73 KG):', 105, ySupps + 32);

      const items = [
        { label: 'CREATINA 5G', checked: !!dayData.supp_creatina },
        { label: 'OMEGA 3', checked: !!dayData.supp_omega3 },
        { label: 'WHEY 30G', checked: !!dayData.supp_whey },
        { label: 'MAGNESIO NOCHE', checked: !!dayData.supp_magnesio }
      ];

      items.forEach((item, idx) => {
        const xPos = 105 + (idx * 225);
        ctx.fillStyle = item.checked ? '#D4FF00' : 'rgba(255, 255, 255, 0.35)';
        ctx.font = item.checked ? '900 18px "Space Grotesk", sans-serif' : '600 18px "Space Grotesk", sans-serif';
        ctx.fillText(`${item.checked ? '✔' : '○'} ${item.label}`, xPos, ySupps + 68);
      });

    } else {
      // ==========================================
      // MODO 'WEEK' (CARD SEMANA)
      // ==========================================
      drawRoundedRect(ctx, 80, 185, 300, 42, 4, 'rgba(212, 255, 0, 0.15)', '#D4FF00', 1.5);
      ctx.fillStyle = '#D4FF00';
      ctx.font = '900 18px "Space Grotesk", sans-serif';
      ctx.fillText('[ REPORTE SEMANAL DE CARGA ]', 100, 212);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 68px "Bebas Neue", sans-serif';
      ctx.fillText('VOLUMEN & RENDIMIENTO SEMANAL', 80, 295);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('OBJETIVO 44 KM DE CARRERA + RUTINA PULL-PUSH-LEGS', 80, 335);

      // MÉTRICAS HERO MODO WEEK
      const boxW = 440;
      const boxH = 220;
      const yBox = 375;

      let weekKm = 0;
      let completedDaysCount = 0;
      for (let i = 0; i < 7; i++) {
        const dk = `day_${i}`;
        const d = state.days && state.days[dk];
        if (d && d.workoutCompleted) completedDaysCount++;
        if (d && d.stravaActivity && d.stravaActivity.distance) {
          weekKm += (d.stravaActivity.distance / 1000);
        } else if (d && d.workoutCompleted && workouts[i] && workouts[i].km) {
          weekKm += workouts[i].km;
        }
      }
      if (weekKm === 0 && state.running && state.running.benchmark) {
        weekKm = 8.51;
      }

      // Caja 1: KM Semanales
      drawRoundedRect(ctx, 80, yBox, boxW, boxH, 8, '#0B111D', 'rgba(212, 255, 0, 0.35)', 2);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '700 16px "Space Grotesk", sans-serif';
      ctx.fillText('VOLUMEN ACUMULADO EN LA SEMANA', 105, yBox + 45);

      ctx.fillStyle = '#D4FF00';
      ctx.font = '900 96px "Bebas Neue", sans-serif';
      const kmStr = weekKm.toFixed(1);
      ctx.fillText(kmStr, 105, yBox + 145);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 26px "Bebas Neue", sans-serif';
      ctx.fillText('/ 44.0 KM OBJETIVO', 105 + (kmStr.length * 45) + 15, yBox + 115);

      const pct = Math.min(100, Math.round((weekKm / 44.0) * 100));
      ctx.fillStyle = '#64748B';
      ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`Progreso de volumen: ${pct}% completado`, 105, yBox + 185);

      // Caja 2: Predicción Maratón 42K
      drawRoundedRect(ctx, W - 80 - boxW, yBox, boxW, boxH, 8, '#0B111D', 'rgba(56, 189, 248, 0.35)', 2);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '700 16px "Space Grotesk", sans-serif';
      ctx.fillText('PREDICCIÓN MARATÓN VALENCIA 2026', W - 80 - boxW + 25, yBox + 45);

      ctx.fillStyle = '#38BDF8';
      ctx.font = '900 84px "Bebas Neue", sans-serif';
      let fullTime = '4h 08m';
      if (typeof predictMarathonTime === 'function') {
        const pred = predictMarathonTime(8.51, 2949);
        fullTime = pred.marathonTimeStr || '4h 08m';
      }
      ctx.fillText(fullTime, W - 80 - boxW + 25, yBox + 145);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 26px "Bebas Neue", sans-serif';
      ctx.fillText('42.195 KM', W - 80 - boxW + 25 + (fullTime.length * 35) + 15, yBox + 115);

      ctx.fillStyle = '#64748B';
      ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Modelo Fisiológico Riegel + Daniels', W - 80 - boxW + 25, yBox + 185);

      // Calendario de 7 días
      const yDays = 635;
      drawRoundedRect(ctx, 80, yDays, W - 160, 215, 8, '#0E1422', 'rgba(255, 255, 255, 0.08)', 1);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '700 16px "Space Grotesk", sans-serif';
      ctx.fillText('CUMPLIMIENTO DE ENTRENAMIENTOS DE LA SEMANA:', 105, yDays + 40);

      const daysOfWeek = [
        { idx: 1, name: 'LUN', desc: 'PULL' },
        { idx: 2, name: 'MAR', desc: '12K RUN' },
        { idx: 3, name: 'MIÉ', desc: 'PUSH' },
        { idx: 4, name: 'JUE', desc: '12K RUN' },
        { idx: 5, name: 'VIE', desc: 'LEGS' },
        { idx: 6, name: 'SÁB', desc: 'REST' },
        { idx: 0, name: 'DOM', desc: '20K RUN' }
      ];

      const pillW = 118;
      const pillH = 110;
      daysOfWeek.forEach((d, i) => {
        const xPill = 105 + (i * 128);
        const yPill = yDays + 65;
        const dk = `day_${d.idx}`;
        const isDone = !!(state.days && state.days[dk] && state.days[dk].workoutCompleted);

        drawRoundedRect(ctx, xPill, yPill, pillW, pillH, 6, isDone ? 'rgba(212, 255, 0, 0.12)' : 'rgba(255, 255, 255, 0.03)', isDone ? '#D4FF00' : 'rgba(255, 255, 255, 0.1)', 1.5);

        ctx.fillStyle = isDone ? '#D4FF00' : '#FFFFFF';
        ctx.font = '900 20px "Space Grotesk", sans-serif';
        ctx.fillText(d.name, xPill + (pillW / 2) - 18, yPill + 35);

        ctx.fillStyle = isDone ? '#FFFFFF' : '#64748B';
        ctx.font = '700 14px "Space Grotesk", sans-serif';
        ctx.fillText(d.desc, xPill + (pillW / 2) - 26, yPill + 65);

        ctx.fillStyle = isDone ? '#22C55E' : '#475569';
        ctx.font = '900 18px "Space Grotesk", sans-serif';
        ctx.fillText(isDone ? '✔ HECHO' : '○ PLAN', xPill + (pillW / 2) - 28, yPill + 95);
      });
    }

    // ==========================================
    // MANTRA / COACHING
    // ==========================================
    const yCoach = 890;
    const coachBoxH = 200;
    drawRoundedRect(ctx, 80, yCoach, W - 160, coachBoxH, 8, '#0C111C', 'rgba(255, 90, 0, 0.25)', 1);

    ctx.fillStyle = '#FF5A00';
    ctx.fillRect(80, yCoach, 8, coachBoxH);

    ctx.fillStyle = '#FF5A00';
    ctx.font = '900 17px "Space Grotesk", sans-serif';
    ctx.fillText('🦍 VALENCE FIT COACHING & ATLETISMO:', 115, yCoach + 45);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
    const quoteL1 = '"LA DISCIPLINA SUPERA AL TALENTO. EL CRONÓMETRO NO NEGOCIA:';
    const quoteL2 = ' CADA KILÓMETRO EN LAS PIERNAS ES VICTORIA EL 06 DE DICIEMBRE."';
    ctx.fillText(quoteL1, 115, yCoach + 95);
    ctx.fillText(quoteL2, 115, yCoach + 130);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 16px "Space Grotesk", sans-serif';
    ctx.fillText('— PLANIFICACIÓN Y ENTRENAMIENTO GUIADO // JOSEMI', 115, yCoach + 175);

    // ==========================================
    // PERFIL DEL ATLETA
    // ==========================================
    const yProfile = 1120;
    drawRoundedRect(ctx, 80, yProfile, W - 160, 105, 8, '#0B0F17', 'rgba(255, 255, 255, 0.1)', 1);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 26px "Bebas Neue", sans-serif';
    const athleteName = (state.profile && state.profile.name) ? state.profile.name.toUpperCase() : 'VÍCTOR';
    const athleteWeight = (state.profile && state.profile.weight) ? `${state.profile.weight} KG` : '73.0 KG';
    ctx.fillText(`ATLETA: ${athleteName} • ${athleteWeight}`, 115, yProfile + 45);

    ctx.fillStyle = '#D4FF00';
    ctx.font = '700 16px "Space Grotesk", sans-serif';
    ctx.fillText('OBJETIVO: 42.195 KM MARATÓN VALENCIA // SUB 3:30 TARGET', 115, yProfile + 80);

    drawRoundedRect(ctx, W - 280, yProfile + 25, 170, 55, 6, 'rgba(212, 255, 0, 0.1)', '#D4FF00', 1.5);
    ctx.fillStyle = '#D4FF00';
    ctx.font = '900 26px "Bebas Neue", sans-serif';
    ctx.fillText('VDOT: 38.6', W - 250, yProfile + 62);

    // ==========================================
    // FOOTER
    // ==========================================
    const yFoot = 1260;
    ctx.fillStyle = '#475569';
    ctx.font = '600 14px "Space Grotesk", sans-serif';
    ctx.fillText('GENERATED BY BIOFLOW ATHLETICS ENGINE // VALENCIA 2026', 80, yFoot);

    ctx.fillStyle = '#D4FF00';
    ctx.font = '900 18px "Bebas Neue", sans-serif';
    ctx.fillText('JUST DO IT.', W - 165, yFoot);

    for (let b = 0; b < 18; b++) {
      ctx.fillStyle = b % 3 === 0 ? '#D4FF00' : (b % 2 === 0 ? '#FFFFFF' : '#475569');
      const barW = (b % 4 === 0) ? 4 : 2;
      ctx.fillRect(80 + (b * 6), yFoot + 15, barW, 20);
    }

    // Actualizar previsualización <img> para soporte nativo y guardado directo en móviles
    try {
      const dataUrl = canvas.toDataURL('image/png', 0.95);
      const imgPreview = document.getElementById('card-preview-img');
      if (imgPreview) {
        imgPreview.src = dataUrl;
      }
    } catch (e) {
      console.warn('Preview dataUrl update skipped:', e);
    }
  }

  /**
   * Abre el modal de exportación
   */
  function openCardModal(mode = 'week') {
    currentCardMode = mode;
    const modal = document.getElementById('brutal-card-modal-overlay');
    if (!modal) {
      console.error('Modal overlay #brutal-card-modal-overlay not found');
      return;
    }

    // Activar tanto la clase .active como display: flex para compatibilidad total con CSS
    modal.classList.add('active');
    modal.style.display = 'flex';

    // Actualizar botones de filtro
    const btnToday = document.getElementById('btn-card-mode-today');
    const btnWeek = document.getElementById('btn-card-mode-week');
    if (btnToday && btnWeek) {
      if (mode === 'today') {
        btnToday.style.background = 'var(--c-volt)';
        btnToday.style.color = '#000';
        btnWeek.style.background = 'transparent';
        btnWeek.style.color = 'var(--text-sub)';
      } else {
        btnWeek.style.background = 'var(--c-volt)';
        btnWeek.style.color = '#000';
        btnToday.style.background = 'transparent';
        btnToday.style.color = 'var(--text-sub)';
      }
    }

    const canvas = document.getElementById('brutal-card-canvas');
    if (canvas) {
      renderCard(canvas, { mode, dayIndex: (typeof selectedDayIndex === 'number' ? selectedDayIndex : new Date().getDay()) });
    }
  }

  /**
   * Cierra el modal
   */
  function closeCardModal() {
    const modal = document.getElementById('brutal-card-modal-overlay');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  /**
   * Descarga la imagen en alta resolución como PNG
   */
  function downloadCard() {
    const canvas = document.getElementById('brutal-card-canvas');
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const nowStr = new Date().toISOString().slice(0, 10);
      link.download = `VIROL-42K-CARD-${currentCardMode.toUpperCase()}-${nowStr}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (typeof showToast === 'function') {
        showToast('📥 ¡CARD GUARDADA! Lista para compartir');
      }
      if (typeof playSuccessSound === 'function') {
        playSuccessSound();
      }
    } catch (err) {
      console.error('Error downloading Card:', err);
      if (typeof showToast === 'function') {
        showToast('⚠️ Error al generar la descarga');
      }
    }
  }

  /**
   * Comparte en Instagram Stories, WhatsApp o redes usando Web Share API
   */
  async function shareCard() {
    const canvas = document.getElementById('brutal-card-canvas');
    if (!canvas) return;

    if (!navigator.share || !canvas.toBlob) {
      downloadCard();
      return;
    }

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          downloadCard();
          return;
        }

        const nowStr = new Date().toISOString().slice(0, 10);
        const fileName = `VIROL-42K-CARD-${currentCardMode}-${nowStr}.png`;
        const file = new File([blob], fileName, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'VIROL // VALENCIA 42K PRO',
            text: '🔥 Plan de entrenamiento hacia la Maratón de Valencia 2026. ¡Disciplina pura!'
          });
          if (typeof showToast === 'function') {
            showToast('📲 ¡Compartido con éxito!');
          }
        } else {
          downloadCard();
        }
      }, 'image/png', 1.0);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Web Share error:', err);
        downloadCard();
      }
    }
  }

  /**
   * Inicializa escuchadores directos y delegación de eventos en el documento
   */
  function initBrutalCardsModule() {
    // Delegación global: cualquier clic en botón o sub-icono de CARD dispara la apertura
    document.addEventListener('click', (e) => {
      const btnWeek = e.target.closest('#btn-open-week-card, [data-action="open-week-card"]');
      if (btnWeek) {
        e.preventDefault();
        openCardModal('week');
        return;
      }

      const btnToday = e.target.closest('#btn-open-today-card, [data-action="open-today-card"]');
      if (btnToday) {
        e.preventDefault();
        openCardModal('today');
        return;
      }

      // Clic fuera del modal (overlay) para cerrar
      const modal = document.getElementById('brutal-card-modal-overlay');
      if (modal && e.target === modal) {
        closeCardModal();
      }
    });

    // Botones dentro del modal
    const btnClose = document.getElementById('btn-close-brutal-card');
    if (btnClose) btnClose.addEventListener('click', closeCardModal);

    const btnCloseFoot = document.getElementById('btn-close-brutal-card-foot');
    if (btnCloseFoot) btnCloseFoot.addEventListener('click', closeCardModal);

    const btnDownload = document.getElementById('btn-download-brutal-card');
    if (btnDownload) btnDownload.addEventListener('click', downloadCard);

    const btnShare = document.getElementById('btn-share-brutal-card');
    if (btnShare) btnShare.addEventListener('click', shareCard);

    const btnModeToday = document.getElementById('btn-card-mode-today');
    if (btnModeToday) {
      btnModeToday.addEventListener('click', () => openCardModal('today'));
    }

    const btnModeWeek = document.getElementById('btn-card-mode-week');
    if (btnModeWeek) {
      btnModeWeek.addEventListener('click', () => openCardModal('week'));
    }
  }

  // Exponer al objeto global para compatibilidad con código existente
  window.renderCard = renderCard;
  window.renderBrutalCard = renderCard;
  window.openCardModal = openCardModal;
  window.openBrutalCardModal = openCardModal;
  window.closeCardModal = closeCardModal;
  window.closeBrutalCardModal = closeCardModal;
  window.downloadCard = downloadCard;
  window.downloadBrutalCard = downloadCard;
  window.shareCard = shareCard;
  window.shareBrutalCard = shareCard;
  window.initBrutalCardsModule = initBrutalCardsModule;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBrutalCardsModule);
  } else {
    initBrutalCardsModule();
  }
})();
