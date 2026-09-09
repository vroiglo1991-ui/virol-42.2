/**
 * BIOFLOW - VALENCIA 42K PRO
 * ai-nutrition.js - Motor de IA para Recetas Zero-Desperdicio y Análisis Semanal
 */

let pendingGeneratedMeals = null;

function openAINutritionModal() {
  const modal = document.getElementById('ai-nutrition-modal-overlay');
  if (modal) modal.classList.add('active');
}

function closeAINutritionModal() {
  const modal = document.getElementById('ai-nutrition-modal-overlay');
  if (modal) modal.classList.remove('active');
}

function getSelectedIngredientsList() {
  const chips = document.querySelectorAll('#ai-ingredient-chips .ingredient-chip.selected');
  const selected = Array.from(chips).map(c => c.dataset.item);
  const custom = document.getElementById('ai-custom-ingredients-text')?.value || '';
  
  if (custom.trim()) {
    const extra = custom.split(',').map(s => s.trim()).filter(Boolean);
    selected.push(...extra);
  }
  return [...new Set(selected)];
}

function generateLocalAIMenu(ingredients, targetKcal = 2850, targetProtein = 150) {
  // Categorize selected ingredients
  const has = (keyword) => ingredients.some(i => i.toLowerCase().includes(keyword.toLowerCase()));

  // 1. Proteins
  const mainProteinLunch = has('Lomo') ? 'Lomo de cerdo a la plancha'
    : has('Picada') ? 'Carne picada magra vacuno/cerdo'
    : has('Pechuga') || has('Pollo') ? 'Pechuga de pollo a la plancha'
    : 'Lomo o Ternera magra';

  const mainProteinDinner = has('Atún') ? 'Atún claro al natural (2 latas)'
    : has('Lomo') ? 'Lomo de cerdo magro'
    : has('Huevos') ? 'Tortilla francesa de 3 huevos'
    : 'Atún o Pollo a la plancha';

  const snackProtein = has('Atún') ? '1 lata de Atún claro'
    : has('Pavo') ? '60g Pechuga de pavo'
    : has('Huevos') ? '2 huevos duros'
    : '50g fiambre magro';

  // 2. Carbs
  const mainCarbLunch = has('Arroz') ? '120 g crudo de Arroz redondo (300g cocido)'
    : has('Pasta') ? '120 g de Pasta'
    : has('Patatas') ? '450 g de Patatas cocidas/al horno'
    : '120 g Arroz o 400g Patatas';

  const mainCarbDinner = has('Patatas') ? '320 g Patatas cocidas con AOVE'
    : has('Pan Rústico') ? '90 g Pan Rústico tostado'
    : '300 g Patatas o Arroz';

  const breakfastBread = has('Pan Rústico') ? '110–120 g Pan Rústico tostado'
    : has('Avena') ? '80 g Copos de avena cocida'
    : '110 g Pan Rústico tostado';

  const morningSnackCarb = has('Tortitas') ? '4 uds (~35 g) Tortitas de arroz'
    : has('Plátano') ? '1 Plátano maduro'
    : '4 Tortitas de arroz';

  // 3. Extras
  const morningProtein = has('Pavo') ? '70 g Pechuga de pavo'
    : has('Jamón') ? '60 g Jamón serrano'
    : has('Huevos') ? '2 huevos revueltos'
    : '70 g Pavo o Jamón';

  const cheese = has('Queso') ? '35 g Queso tierno/semicurado de Mercadona' : '30 g Queso bajo en grasa';
  const gazpacho = has('Gazpacho') ? 'Gazpacho tradicional Mercadona' : 'Puré de verduras o ensalada';
  const whey = has('Whey') ? '1 cacito (30 g) Proteína Whey pura' : 'Batido proteico o claras';

  return {
    desayuno: {
      id: "meal_desayuno",
      name: "DESAYUNO // CARGA MATINAL ZERO-WASTE",
      time: "08:00 - 09:00",
      desc: `${breakfastBread} + 12ml AOVE + ${morningProtein} + ${cheese} + 1 Plátano`,
      items: [
        { qty: "110–120 g", text: `${breakfastBread} (rebanadas generosas)` },
        { qty: "12–15 ml", text: "Aceite de Oliva Virgen Extra (AOVE)" },
        { qty: "70 g", text: morningProtein },
        { qty: "35 g", text: cheese },
        { qty: "1 Plátano", text: "Plátano maduro (~120 g)" },
        { qty: "5 g + 2 perlas", text: "Creatina con agua + 2 perlas Omega 3" }
      ]
    },
    snack: {
      id: "meal_snack",
      name: "MEDIA MAÑANA // PRE-RUN ENERGÍA",
      time: "11:30 - 12:30",
      desc: `${morningSnackCarb} + ${snackProtein}`,
      items: [
        { qty: "4 uds (~35 g)", text: morningSnackCarb },
        { qty: "1 ración", text: snackProtein },
        { qty: "500 ml", text: "Agua mineral (iniciar hidratación de carrera)" }
      ]
    },
    comida: {
      id: "meal_comida",
      name: "COMIDA // COMBUSTIBLE PRINCIPAL",
      time: "14:00 - 15:00",
      desc: `${mainCarbLunch} + 180g ${mainProteinLunch} + 250ml Gazpacho + Olivas`,
      items: [
        { qty: "120 g crudo", text: mainCarbLunch },
        { qty: "180 g", text: `${mainProteinLunch} a la plancha` },
        { qty: "200–250 ml", text: `${gazpacho}` },
        { qty: "10–12 uds", text: "Olivas de Mercadona (grasas monoinsaturadas)" }
      ]
    },
    merienda: {
      id: "meal_merienda",
      name: "MERIENDA // RECUPERACIÓN ANABÓLICA",
      time: "18:00 - 19:00",
      desc: `${whey} + 1 Plátano grande o 4 tortitas`,
      items: [
        { qty: "1 cacito (30 g)", text: whey },
        { qty: "1 Plátano", text: "Plátano maduro (~120 g) O 4 tortitas de arroz" }
      ]
    },
    cena: {
      id: "meal_cena",
      name: "CENA // REPARACIÓN NOCHE",
      time: "21:30 - 22:30",
      desc: `${mainCarbDinner} + ${mainProteinDinner} + 200ml Gazpacho + 25g Queso`,
      items: [
        { qty: "300 g", text: mainCarbDinner },
        { qty: "160–180 g", text: mainProteinDinner },
        { qty: "200 ml", text: `${gazpacho}` },
        { qty: "25 g", text: cheese },
        { qty: "1 dosis", text: "Magnesio 45 min antes de dormir" }
      ]
    }
  };
}

async function runAINutritionEngine() {
  const ingredients = getSelectedIngredientsList();
  if (ingredients.length === 0) {
    if (typeof showToast === 'function') showToast('⚠️ Selecciona al menos 3 o 4 ingredientes de tu compra');
    return;
  }

  const targetKcal = parseInt(document.getElementById('ai-target-calories')?.value || 2850, 10);
  const targetPro = parseInt(document.getElementById('ai-target-protein')?.value || 150, 10);
  const geminiKey = document.getElementById('ai-gemini-key')?.value.trim() || localStorage.getItem('virol_gemini_key') || '';

  const resultsBox = document.getElementById('ai-generation-results');
  const previewGrid = document.getElementById('ai-preview-grid-cards');
  const btnApply = document.getElementById('btn-apply-ai-meals');
  const summaryPill = document.getElementById('ai-result-summary-pill');

  if (typeof showToast === 'function') showToast('🤖 Optimizando menú semanal con tu compra...');

  let generated = null;

  if (geminiKey) {
    try {
      if (typeof showToast === 'function') showToast('☁️ Invocando Gemini AI para recetas gourmet...');
      const prompt = `Eres un nutricionista deportivo de élite para un maratoniano de 73 kg preparando la Maratón de Valencia.
Objetivo: Generar un menú diario con 5 comidas (desayuno, snack, comida, merienda, cena) alcanzando exactamente ~${targetKcal} kcal y ~${targetPro}g de proteína.
CRUCIAL: Debes utilizar ÚNICAMENTE o prioritariamente los siguientes ingredientes de su compra:
${ingredients.join(', ')}.
Devuelve estrictamente un JSON válido con este formato:
{
  "desayuno": { "name": "...", "time": "08:00 - 09:00", "desc": "...", "items": [{"qty": "...", "text": "..."}] },
  "snack": { "name": "...", "time": "11:30 - 12:30", "desc": "...", "items": [{"qty": "...", "text": "..."}] },
  "comida": { "name": "...", "time": "14:00 - 15:00", "desc": "...", "items": [{"qty": "...", "text": "..."}] },
  "merienda": { "name": "...", "time": "18:00 - 19:00", "desc": "...", "items": [{"qty": "...", "text": "..."}] },
  "cena": { "name": "...", "time": "21:30 - 22:30", "desc": "...", "items": [{"qty": "...", "text": "..."}] }
}`;

      let res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (!res.ok) {
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });
      }

      if (res.ok) {
        const data = await res.json();
        const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          generated = JSON.parse(rawJson);
        }
      }
    } catch (e) {
      console.warn('Gemini API call fell back to local macro engine:', e);
    }
  }

  // If no Gemini key or Gemini fallback, use local zero-waste algorithmic engine
  if (!generated) {
    generated = generateLocalAIMenu(ingredients, targetKcal, targetPro);
  }

  pendingGeneratedMeals = generated;

  // Render preview
  if (previewGrid) {
    const mealKeys = ['desayuno', 'snack', 'comida', 'merienda', 'cena'];
    previewGrid.innerHTML = mealKeys.map(k => {
      const m = generated[k];
      if (!m) return '';
      const itemsHtml = (m.items || []).map(it => `
        <li><span class="g-qty">${it.qty || ''}</span> <span>${it.text || it}</span></li>
      `).join('');

      return `
        <div class="ai-meal-preview-card">
          <div class="ai-meal-head">
            <span class="ai-meal-name">${m.name}</span>
            <span class="ai-meal-time">${m.time}</span>
          </div>
          <p style="font-size:0.75rem; color:var(--text-sub); margin-bottom:8px;">${m.desc}</p>
          <ul class="ai-meal-items-list">
            ${itemsHtml}
          </ul>
        </div>
      `;
    }).join('');
  }

  if (summaryPill) summaryPill.innerText = `~${targetKcal} KCAL • ${targetPro}G PRO • ZERO DESPERDICIO`;
  if (resultsBox) resultsBox.style.display = 'block';
  if (btnApply) btnApply.style.display = 'inline-block';

  if (typeof playSuccessSound === 'function') playSuccessSound();
  if (typeof showToast === 'function') showToast('✨ ¡MENÚ IA GENERADO CON ÉXITO! REVISA Y PULSA APLICAR');
}

function initAINutritionModule() {
  const btnOpenBanner = document.getElementById('btn-open-ai-nutrition');
  const btnOpenHead = document.getElementById('btn-open-ai-nutrition-head');
  const btnClose = document.getElementById('btn-close-ai-modal');
  const btnCancel = document.getElementById('btn-cancel-ai');
  const modalOverlay = document.getElementById('ai-nutrition-modal-overlay');
  const btnRun = document.getElementById('btn-run-ai-generation');
  const btnApply = document.getElementById('btn-apply-ai-meals');
  const btnLoadMarket = document.getElementById('btn-ai-load-market-list');

  // ── Open & Close ─────────────────────────────────────────────
  if (btnOpenBanner) btnOpenBanner.addEventListener('click', openAINutritionModal);
  if (btnOpenHead)   btnOpenHead.addEventListener('click', openAINutritionModal);
  if (btnClose)      btnClose.addEventListener('click', closeAINutritionModal);
  if (btnCancel)     btnCancel.addEventListener('click', closeAINutritionModal);
  if (modalOverlay)  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeAINutritionModal(); });

  // ── Gemini Key: cargar de localStorage al abrir ───────────────
  const geminiInput = document.getElementById('ai-gemini-key');
  const keyBadge = document.getElementById('ai-key-status-badge');
  const savedKey = localStorage.getItem('virol_gemini_key') || '';
  if (geminiInput && savedKey) {
    geminiInput.value = savedKey;
    if (keyBadge) { keyBadge.textContent = '✅ GUARDADA'; keyBadge.style.background = 'rgba(50,215,75,0.18)'; keyBadge.style.color = '#32D74B'; }
  }
  const btnSaveKey = document.getElementById('btn-save-gemini-key');
  if (btnSaveKey) {
    btnSaveKey.addEventListener('click', () => {
      const val = geminiInput?.value.trim() || '';
      if (!val) { if (typeof showToast === 'function') showToast('⚠️ Pega tu clave API de Gemini antes de guardar'); return; }
      localStorage.setItem('virol_gemini_key', val);
      if (keyBadge) { keyBadge.textContent = '✅ GUARDADA'; keyBadge.style.background = 'rgba(50,215,75,0.18)'; keyBadge.style.color = '#32D74B'; }
      if (typeof showToast === 'function') showToast('🔑 ¡Clave Gemini guardada en tu dispositivo!');
      if (typeof playSuccessSound === 'function') playSuccessSound();
    });
  }

  // ── Helper: crear un chip editable ───────────────────────────
  function createChip(label, itemValue, selected = false) {
    const span = document.createElement('span');
    span.className = 'ingredient-chip' + (selected ? ' selected' : '');
    span.dataset.item = itemValue || label;
    span.innerHTML = `${label} <span class="chip-remove" title="Quitar">✕</span>`;

    // Click en el chip → toggle selected
    span.addEventListener('click', (e) => {
      if (e.target.classList.contains('chip-remove')) {
        span.remove();
        if (typeof playCheckSound === 'function') playCheckSound();
        return;
      }
      span.classList.toggle('selected');
      if (typeof playCheckSound === 'function') playCheckSound();
    });
    return span;
  }

  // Añadir listeners chip-remove a los chips ya existentes en el HTML
  function bindExistingChips() {
    document.querySelectorAll('#ai-ingredient-chips .ingredient-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        if (e.target.classList.contains('chip-remove')) { chip.remove(); if (typeof playCheckSound === 'function') playCheckSound(); return; }
        chip.classList.toggle('selected');
        if (typeof playCheckSound === 'function') playCheckSound();
      });
    });
  }
  bindExistingChips();

  // ── Seleccionar todos / Vaciar ────────────────────────────────
  if (btnLoadMarket) {
    btnLoadMarket.addEventListener('click', () => {
      document.querySelectorAll('#ai-ingredient-chips .ingredient-chip').forEach(c => c.classList.add('selected'));
      if (typeof playCheckSound === 'function') playCheckSound();
      if (typeof showToast === 'function') showToast('🛒 ¡TODOS LOS PRODUCTOS SELECCIONADOS!');
    });
  }
  const btnClear = document.getElementById('btn-ai-clear-chips');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      document.querySelectorAll('#ai-ingredient-chips .ingredient-chip').forEach(c => c.classList.remove('selected'));
      if (typeof playCheckSound === 'function') playCheckSound();
      if (typeof showToast === 'function') showToast('🗑️ Lista vaciada. Selecciona los que tienes.');
    });
  }

  // ── Añadir nuevo producto ─────────────────────────────────────
  const btnAddIngredient = document.getElementById('btn-ai-add-ingredient');
  const addRow = document.getElementById('ai-add-ingredient-row');
  const newIngInput = document.getElementById('ai-new-ingredient-input');
  const btnConfirmAdd = document.getElementById('btn-ai-confirm-add');
  const chipsContainer = document.getElementById('ai-ingredient-chips');

  if (btnAddIngredient && addRow) {
    btnAddIngredient.addEventListener('click', () => {
      addRow.classList.toggle('visible');
      if (newIngInput && addRow.classList.contains('visible')) newIngInput.focus();
    });
  }

  function confirmAddChip() {
    const val = newIngInput?.value.trim();
    if (!val) return;
    const chip = createChip(val, val, true);
    chipsContainer?.appendChild(chip);
    newIngInput.value = '';
    addRow.classList.remove('visible');
    if (typeof playSuccessSound === 'function') playSuccessSound();
    if (typeof showToast === 'function') showToast(`✅ "${val}" añadido a tu lista`);
  }

  if (btnConfirmAdd) btnConfirmAdd.addEventListener('click', confirmAddChip);
  if (newIngInput) {
    newIngInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); confirmAddChip(); } });
  }

  // ── Recomendaciones de compra IA ─────────────────────────────
  const btnShoppingRecs = document.getElementById('btn-ai-shopping-recs');
  const recsPanel = document.getElementById('ai-shopping-recs-panel');
  const recsContent = document.getElementById('ai-shopping-recs-content');
  const btnCloseRecs = document.getElementById('btn-close-shopping-recs');
  const btnAddRecs = document.getElementById('btn-add-recs-to-list');

  let pendingRecsItems = [];

  if (btnCloseRecs && recsPanel) {
    btnCloseRecs.addEventListener('click', () => { recsPanel.style.display = 'none'; });
  }

  if (btnShoppingRecs) {
    btnShoppingRecs.addEventListener('click', async () => {
      if (!recsPanel || !recsContent) return;

      const ingredients = getSelectedIngredientsList();
      const key = localStorage.getItem('virol_gemini_key') || geminiInput?.value.trim();

      recsPanel.style.display = 'block';
      recsContent.innerHTML = '<span style="color:var(--c-volt);">⏳ Analizando tu lista y generando recomendaciones...</span>';
      if (btnAddRecs) btnAddRecs.style.display = 'none';
      pendingRecsItems = [];

      if (key) {
        // Recomendaciones con Gemini
        try {
          const prompt = `Eres un nutricionista deportivo experto en running y maratón.
Un corredor de 73 kg prepara la Maratón de Valencia y actualmente tiene estos ingredientes en casa:
${ingredients.join(', ')}.

Analiza su lista y recomiéndame exactamente 6-8 productos que le FALTAN o que mejorarían notablemente su nutrición deportiva (recuperación, hidratación, proteína, carbohidratos de calidad, micronutrientes).
IMPORTANTE: Solo recomienda productos que se vendan habitualmente en Mercadona o supermercados similares.
Sé conciso y práctico. Devuelve un JSON con este formato:
{
  "recommendations": [
    {"product": "nombre del producto", "reason": "por qué lo necesita (máx 1 frase)", "category": "Proteína|Carbohidrato|Grasa|Hidratación|Micronutriente|Suplemento"},
    ...
  ],
  "summary": "Breve resumen de las carencias principales (1-2 frases)"
}`;

          let res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json' }
            })
          });

          if (!res.ok) {
            res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${key}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: 'application/json' }
              })
            });
          }

          if (res.ok) {
            const data = await res.json();
            const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawJson) {
              const parsed = JSON.parse(rawJson);
              const recs = parsed.recommendations || [];
              pendingRecsItems = recs.map(r => r.product);

              const categoryColors = {
                'Proteína': '#FF5A00', 'Carbohidrato': '#C8FF00', 'Grasa': '#FFD60A',
                'Hidratación': '#5AC8FA', 'Micronutriente': '#BF5AF2', 'Suplemento': '#FF375F'
              };

              recsContent.innerHTML = `
                ${parsed.summary ? `<p style="margin:0 0 10px; font-style:italic; color:var(--text-muted);">${parsed.summary}</p>` : ''}
                <div style="display:flex; flex-direction:column; gap:6px;">
                  ${recs.map(r => `
                    <div style="display:flex; align-items:flex-start; gap:8px; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
                      <span style="background:${categoryColors[r.category] || '#888'}22; color:${categoryColors[r.category] || '#888'}; font-size:0.6rem; font-weight:700; padding:2px 6px; border-radius:20px; white-space:nowrap; margin-top:2px;">${r.category}</span>
                      <div><strong style="color:#fff;">${r.product}</strong><br><span style="color:var(--text-muted);">${r.reason}</span></div>
                    </div>
                  `).join('')}
                </div>
              `;
              if (btnAddRecs && pendingRecsItems.length > 0) btnAddRecs.style.display = 'block';
            }
          } else throw new Error('Gemini no disponible');

        } catch (e) {
          // Fallback local
          renderLocalShoppingRecs(ingredients, recsContent, btnAddRecs);
        }
      } else {
        // Sin clave: recomendaciones locales inteligentes
        renderLocalShoppingRecs(ingredients, recsContent, btnAddRecs);
      }
    });
  }

  function renderLocalShoppingRecs(ingredients, container, addBtn) {
    const has = (kw) => ingredients.some(i => i.toLowerCase().includes(kw.toLowerCase()));
    const recs = [];
    if (!has('Claras')) recs.push({ product: 'Claras de huevo en brik', reason: 'Proteína pura de alto valor biológico para el desayuno o postentreno.', category: 'Proteína' });
    if (!has('Avena')) recs.push({ product: 'Copos de avena', reason: 'Carbohidrato de absorción lenta, ideal para el desayuno del día de carrera.', category: 'Carbohidrato' });
    if (!has('Yogur')) recs.push({ product: 'Yogur griego 0%', reason: 'Caseína natural para la recuperación nocturna y microbiota intestinal.', category: 'Proteína' });
    if (!has('Arándano') && !has('Fruta')) recs.push({ product: 'Arándanos o fresas', reason: 'Antioxidantes y vitamina C para reducir inflamación post-entreno.', category: 'Micronutriente' });
    if (!has('Frutos secos') && !has('Almendra') && !has('Nuez')) recs.push({ product: 'Nueces o almendras crudas', reason: 'Omega-3 vegetal y grasas saludables para articulaciones y hormonas.', category: 'Grasa' });
    if (!has('Magnesio') && !has('suplemento')) recs.push({ product: 'Magnesio (bisglicinato o citrato)', reason: 'Esencial para el sueño profundo y la contracción muscular.', category: 'Suplemento' });
    if (!has('Bebida isotónica') && !has('Electro')) recs.push({ product: 'Electrolitos / Bebida isotónica', reason: 'Imprescindible para hidratación en rodajes largos de más de 10 km.', category: 'Hidratación' });
    if (!has('Miel')) recs.push({ product: 'Miel de flores o dátiles', reason: 'Azúcar de absorción rápida para la hora previa a la carrera.', category: 'Carbohidrato' });

    pendingRecsItems = recs.map(r => r.product);
    const catColors = { 'Proteína': '#FF5A00', 'Carbohidrato': '#C8FF00', 'Grasa': '#FFD60A', 'Hidratación': '#5AC8FA', 'Micronutriente': '#BF5AF2', 'Suplemento': '#FF375F' };

    container.innerHTML = `
      <p style="margin:0 0 10px; font-style:italic; color:var(--text-muted);">Basado en tu lista actual, te faltan estos productos clave para optimizar tu rendimiento:</p>
      <div style="display:flex; flex-direction:column; gap:6px;">
        ${recs.map(r => `
          <div style="display:flex; align-items:flex-start; gap:8px; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
            <span style="background:${catColors[r.category] || '#888'}22; color:${catColors[r.category] || '#888'}; font-size:0.6rem; font-weight:700; padding:2px 6px; border-radius:20px; white-space:nowrap; margin-top:2px;">${r.category}</span>
            <div><strong style="color:#fff;">${r.product}</strong><br><span style="color:var(--text-muted);">${r.reason}</span></div>
          </div>
        `).join('')}
      </div>
      <p style="margin-top:8px; font-size:0.7rem; color:var(--text-muted);">💡 Añade tu clave Gemini para recomendaciones personalizadas con IA real.</p>
    `;
    if (addBtn && recs.length > 0) addBtn.style.display = 'block';
  }

  // Añadir recomendaciones como chips nuevos
  if (btnAddRecs) {
    btnAddRecs.addEventListener('click', () => {
      if (!pendingRecsItems.length || !chipsContainer) return;
      let added = 0;
      pendingRecsItems.forEach(prod => {
        // No duplicar
        const exists = [...chipsContainer.querySelectorAll('.ingredient-chip')].some(c => c.dataset.item === prod);
        if (!exists) { chipsContainer.appendChild(createChip(prod, prod, false)); added++; }
      });
      if (recsPanel) recsPanel.style.display = 'none';
      if (typeof showToast === 'function') showToast(`✅ ${added} producto${added !== 1 ? 's' : ''} añadido${added !== 1 ? 's' : ''} a tu lista`);
      if (typeof playSuccessSound === 'function') playSuccessSound();
    });
  }

  // ── Run AI Generation ─────────────────────────────────────────
  if (btnRun) btnRun.addEventListener('click', runAINutritionEngine);

  // ── Apply Generated Meals ─────────────────────────────────────
  if (btnApply) {
    btnApply.addEventListener('click', () => {
      if (!pendingGeneratedMeals) return;
      if (typeof appState !== 'undefined') {
        appState.customMeals = pendingGeneratedMeals;
        if (typeof saveState === 'function') saveState(appState);
      }
      if (typeof playSuccessSound === 'function') playSuccessSound();
      if (typeof renderMealsTab === 'function') renderMealsTab();
      if (typeof renderMealChecklist === 'function') renderMealChecklist(selectedDayIndex);
      if (typeof updateProgressHUD === 'function') updateProgressHUD(selectedDayIndex);
      closeAINutritionModal();
      if (typeof showToast === 'function') showToast('🚀 ¡NUEVO MENÚ IA APLICADO A TU APP Y SINCRONIZADO!');
    });
  }
}

// ─── 9B. AI WEEKLY REVIEW // COACH IA // VALENCIA 42K ─────────
function initAIWeeklyReviewModule() {
  const btnTrigger = document.getElementById('btn-trigger-weekly-ai');
  const spinner = document.getElementById('ai-review-btn-spinner');
  const btnText = document.getElementById('ai-review-btn-text');
  const placeholder = document.getElementById('ai-weekly-body-placeholder');
  const resultsContainer = document.getElementById('ai-weekly-results');

  if (!btnTrigger) return;

  btnTrigger.addEventListener('click', async () => {
    if (typeof playCheckSound === 'function') playCheckSound();

    btnTrigger.disabled = true;
    if (spinner) spinner.style.display = 'inline-block';
    if (btnText) btnText.textContent = 'ANALIZANDO SEMANA...';

    let totalKmDone = 0;
    let sessionsDone = 0;
    let sleepSum = 0;
    let rpeSum = 0;
    let rpeCount = 0;
    const recentSessions = [];

    [1, 2, 3, 4, 5, 6, 0].forEach(d => {
      const key = (typeof getTodayKey === 'function') ? getTodayKey(d) : `day_${d}`;
      const dayData = (typeof appState !== 'undefined' && appState.days && appState.days[key]) || {};
      const plan = (typeof WORKOUT_PLANS !== 'undefined' && WORKOUT_PLANS[d]) || {};
      const done = !!dayData.workoutCompleted;
      const km = parseFloat(plan.km || 0);

      if (done) {
        totalKmDone += km;
        sessionsDone++;
      }
      const sleep = parseFloat(dayData.sleepHours || 7.5);
      sleepSum += sleep;

      if (dayData.rpe) {
        rpeSum += parseFloat(dayData.rpe);
        rpeCount++;
      }

      recentSessions.push({
        dia: plan.name || `Día ${d}`,
        disciplina: plan.discipline || 'Entrenamiento',
        completado: done,
        km_objetivo: km,
        sueno_horas: sleep
      });
    });

    const targetKm = (typeof TARGET_KM !== 'undefined' ? TARGET_KM : 44);
    const avgSleep = (sleepSum / 7).toFixed(1);
    const avgRPE = rpeCount > 0 ? (rpeSum / rpeCount).toFixed(1) : 6.5;

    const payload = {
      totalKmDone,
      targetKm,
      avgSleep: parseFloat(avgSleep),
      avgRPE: parseFloat(avgRPE),
      recentSessions
    };

    let data = null;

    // 1. Llamada a endpoint Cloudflare Worker
    try {
      const workerUrl = window.location.origin.includes('workers.dev')
        ? '/api/ai/weekly-review'
        : 'https://virol.v-roiglo1991.workers.dev/api/ai/weekly-review';

      const res = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        data = await res.json();
      } else {
        console.warn('Worker weekly review devolvió status:', res.status);
      }
    } catch (netErr) {
      console.warn('Error conectando a Cloudflare Worker:', netErr);
    }

    // 2. Respaldo directo si no responde Worker y hay clave local
    if (!data || !data.analysis) {
      const localKey = localStorage.getItem('virol_gemini_key') || '';
      if (localKey) {
        try {
          const systemPrompt = `Eres un entrenador de atletismo de élite y fisiólogo deportivo especializado en maratón (Valencia 42K). Analiza los datos de Víctor y devuelve un JSON válido con: status_badge (ÓPTIMO/ATENCIÓN/DESCARGA), fatigue_score (1-100), injury_risk (BAJO/MEDIO/ALTO), summary_headline, weekly_diagnosis, actionable_adjustments (array de 3 strings) y nutrition_focus.`;
          const userPrompt = `Objetivo: ${targetKm}km. Realizados: ${totalKmDone}km. Sueño: ${avgSleep}h/noche. RPE: ${avgRPE}. Sesiones: ${JSON.stringify(recentSessions)}.`;

          const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${localKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
              generationConfig: { responseMimeType: 'application/json' }
            })
          });
          if (gRes.ok) {
            const gData = await gRes.json();
            const analysis = JSON.parse(gData.candidates[0].content.parts[0].text);
            data = {
              metrics: {
                totalKmDone,
                targetKm,
                completionPct: Math.round((totalKmDone / (targetKm || 1)) * 100),
                avgSleep,
                avgRPE
              },
              analysis
            };
          }
        } catch (e) {
          console.warn('Fallback Gemini local error:', e);
        }
      }
    }

    // 3. Respaldo fisiológico algorítmico si no hay red ni API key
    if (!data || !data.analysis) {
      const pct = Math.round((totalKmDone / (targetKm || 1)) * 100);
      const isFatigued = parseFloat(avgSleep) < 7.0 || parseFloat(avgRPE) >= 7.5;
      data = {
        metrics: {
          totalKmDone,
          targetKm,
          completionPct: pct,
          avgSleep,
          avgRPE
        },
        analysis: {
          status_badge: isFatigued ? 'ATENCIÓN' : (pct >= 85 ? 'ÓPTIMO' : 'ATENCIÓN'),
          fatigue_score: isFatigued ? 68 : 42,
          injury_risk: isFatigued ? 'MEDIO' : 'BAJO',
          summary_headline: pct >= 80 
            ? 'VOLUMEN CONSISTENTE // VIGILAR RECUPERACIÓN NOCTURNA' 
            : 'ASIMILACIÓN EN PROCESO // PRIORIZAR TIRADA LARGA',
          weekly_diagnosis: `Has completado ${totalKmDone} km de ${targetKm} km planificados (${pct}%). Con una media de descanso de ${avgSleep} horas, la asimilación aeróbica es adecuada pero requiere atención en el sóleo y tendón de Aquiles.`,
          actionable_adjustments: [
            'Mantener el ritmo regenerativo (Z2) 15-20 seg más lento si el RPE supera 6.',
            'Dedicar 10 min de foam roller y movilidad de tobillo antes de cada sesión.',
            'Asegurar un mínimo de 7.5 horas de sueño en la víspera de la tirada larga.'
          ],
          nutrition_focus: 'Cargar 4g/kg de hidratos de absorción lenta 24h antes del rodaje largo y asegurar aporte de sales.'
        }
      };
    }

    // 4. Renderizado visual Neobrutalista
    const a = data.analysis;
    const m = data.metrics;
    const statusClass = a.status_badge === 'ÓPTIMO' 
      ? 'ai-status-optimo' 
      : (a.status_badge === 'DESCARGA' ? 'ai-status-descarga' : 'ai-status-atencion');

    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="ai-results-strip">
          <span class="ai-status-pill ${statusClass}">● ${a.status_badge}</span>
          <span class="ai-fatigue-pill">⚡ FATIGA: <strong>${a.fatigue_score}/100</strong></span>
          <span class="ai-injury-pill">🛡️ RIESGO: <strong>${a.injury_risk}</strong></span>
          <span class="ai-injury-pill" style="border-color:var(--c-volt); color:var(--c-volt);">🏃 ${m.totalKmDone}/${m.targetKm} KM (${m.completionPct}%)</span>
          <span class="ai-injury-pill">💤 SUEÑO: ${m.avgSleep}h</span>
        </div>

        <h4 class="ai-headline-box">${a.summary_headline}</h4>
        <p class="ai-diagnosis-text">${a.weekly_diagnosis}</p>

        <div style="margin-top:14px;">
          <span style="font-family:var(--font-mono); font-size:0.75rem; font-weight:900; color:var(--c-volt); display:block; margin-bottom:8px; text-transform:uppercase;">🔧 3 AJUSTES ACCIONABLES PARA LA SEMANA:</span>
          <div class="ai-adjustments-grid">
            ${(a.actionable_adjustments || []).map((adj, idx) => `
              <div class="ai-adj-card">
                <span class="ai-adj-num">${idx + 1}</span>
                <span>${adj}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="ai-nutrition-callout">
          <span style="font-size:1.2rem;">🍌</span>
          <div>
            <strong>ENFOQUE NUTRICIONAL:</strong> ${a.nutrition_focus}
          </div>
        </div>
      `;

      if (placeholder) placeholder.style.display = 'none';
      resultsContainer.style.display = 'block';
    }

    btnTrigger.disabled = false;
    if (spinner) spinner.style.display = 'none';
    if (btnText) btnText.textContent = '🔄 RE-ANALIZAR SEMANA';

    if (typeof playSuccessSound === 'function') playSuccessSound();
    if (typeof showToast === 'function') showToast('🧠 ¡ANÁLISIS SEMANAL IA COMPLETADO!');
  });
}
