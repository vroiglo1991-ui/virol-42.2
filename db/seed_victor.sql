-- ============================================================
-- VIROL // SEED: Víctor como primer usuario real
-- Ejecutar DESPUÉS de schema.sql:
--   wrangler d1 execute virol-db --file=./db/seed_victor.sql
-- ============================================================

INSERT OR IGNORE INTO users (id, email, name, weight_kg, height_cm, role)
VALUES ('u_victor', 'victor@example.com', 'Víctor', 73, 178, 'athlete');

INSERT OR IGNORE INTO goals (id, user_id, label, goal_type, distance_km, target_date, priority)
VALUES
  ('g_media',   'u_victor', 'MEDIA MARATÓN VALENCIA', 'half_marathon', 21.097, '2026-10-25', 2),
  ('g_maraton', 'u_victor', 'MARATÓN DE VALENCIA',    'marathon',      42.195, '2026-12-06', 1);

INSERT OR IGNORE INTO training_plans (id, user_id, name, weekly_km_target, is_active, template_source)
VALUES ('p_victor_1', 'u_victor', 'PULL-PUSH-LEGS + 44KM RUNNING', 44, 1, 'manual');

INSERT OR IGNORE INTO weekly_sessions (id, plan_id, day_of_week, session_type, badge, title, description, target_km, tags, sort_order)
VALUES
  ('s_lun', 'p_victor_1', 1, 'gym', 'GYM // PULL', 'TRACCIÓN & ESPALDA DE HIERRO',
   'Dominadas o jalón al pecho (4x8), Remo con barra/mancuernas (4x10), Pájaros/deltoides posterior (3x12), Curl bíceps (3x10), Rueda abdominal (3x15).',
   0, 'Fuerza,Tren Superior', 1),
  ('s_mar', 'p_victor_1', 2, 'run', 'RUN // 12 KM Z2', 'RODAJE BASE AERÓBICA',
   '12 km continuos a ritmo cómodo conversacional (Zona 2). Construye capilares y enseña al cuerpo a quemar grasas preservando glucógeno.',
   12, 'Aeróbico,Cómodo', 2),
  ('s_mie', 'p_victor_1', 3, 'gym', 'GYM // PUSH', 'EMPUJE & POTENCIA TORÁCICA',
   'Press banca con barra o mancuernas pesadas (4x8), Press militar de pie (3x8), Aperturas con mancuernas (3x12), Fondos en paralelas / tríceps polea (4x10), Plancha frontal (3x1 min).',
   0, 'Fuerza,Tren Superior', 3),
  ('s_jue', 'p_victor_1', 4, 'run', 'RUN // 12 KM CALIDAD', 'SERIES / RITMO MEDIA MARATÓN',
   '2 km calentamiento suave + 8 km ritmo exigente de competición + 2 km trote regenerativo.',
   12, 'Exigencia Cardíaca', 4),
  ('s_vie', 'p_victor_1', 5, 'gym', 'GYM // LEGS CORREDOR', 'PIERNA FUNCIONAL DE HIERRO',
   'Sentadilla búlgara pesada (3x8/pierna), Peso muerto rumano para isquios (3x8), Elevaciones de gemelos/sóleos (4x15), Glúteo medio con banda.',
   0, 'Fuerza útil,Sin fallo extremo', 5),
  ('s_sab', 'p_victor_1', 6, 'rest', 'DESCANSO TOTAL', 'RECUPERACIÓN SAGRADA 100%',
   'CERO ENTRENAMIENTO. Asimilación muscular de la sesión de piernas del viernes. Carga de carbohidratos, siesta regenerativa.',
   0, 'Crecimiento Muscular', 6),
  ('s_dom', 'p_victor_1', 7, 'run', 'RUN // 18-22 KM', 'LA SESIÓN REINA // TIRADA LARGA',
   '18 a 22 km continuos. Piernas descansadas del sábado y reservas de glucógeno a tope.',
   20, 'Fondo Maratón', 7);

INSERT OR IGNORE INTO meal_plans (id, user_id, daily_kcal, protein_g, carbs_g, fat_g, generated_by)
VALUES ('mp_victor_1', 'u_victor', 2850, 150, 400, 72, 'manual');

INSERT OR IGNORE INTO meals (id, meal_plan_id, slot, title, time_window, summary, sort_order)
VALUES
  ('m_desayuno', 'mp_victor_1', 'breakfast',   'DESAYUNO // CARGA MATINAL',              '08:00 - 09:00', '120g Pan rústico + 12ml AOVE + 70g Pavo/Jamón + 35g Queso + 1 Plátano', 1),
  ('m_media',    'mp_victor_1', 'mid_morning',  'MEDIA MAÑANA // PRE-RUN',                '11:30 - 12:30', '4 Tortitas de arroz (~35g) + 1 lata de Atún o 50g pavo', 2),
  ('m_comida',   'mp_victor_1', 'lunch',        'COMIDA // COMBUSTIBLE PRINCIPAL',        '14:00 - 15:00', '120g Arroz/Pasta (o 400g patata) + 180g Lomo o Picada + Gazpacho + Olivas', 3),
  ('m_merienda', 'mp_victor_1', 'snack',        'MERIENDA // RECUPERACIÓN ANABÓLICA',     '18:00 - 19:00', '30g Whey + 1 Plátano grande (~120g) o 4 tortitas', 4),
  ('m_cena',     'mp_victor_1', 'dinner',       'CENA // REPARACIÓN NOCTURNA LIGERA',     '21:30 - 22:30', '300g Patata o 90g Rústico + 2 latas Atún o 160g Lomo + Gazpacho + 25g Queso', 5);

INSERT OR IGNORE INTO supplements (id, user_id, name, dose, timing_note, purpose_note, alarm_time)
VALUES
  ('sup_creatina', 'u_victor', 'CREATINA MONOHIDRATO', '5 G',         'Mañana con agua o desayuno', 'Retención fuerza',         '08:30'),
  ('sup_omega3',   'u_victor', 'OMEGA 3',               '2 PERLAS',    'Con comida',                 'Antiinflamatorio articular','14:00'),
  ('sup_whey',     'u_victor', 'PROTEÍNA WHEY',         '30 G',        'Post-entreno / Merienda',    'Síntesis proteica',        '17:30'),
  ('sup_magnesio', 'u_victor', 'MAGNESIO',              '1 DOSIS NOCTURNA','45 min antes de dormir', 'Sueño profundo REM',       '22:30');

INSERT OR IGNORE INTO notifications (id, user_id, trigger_time, icon, title, body)
VALUES
  ('n_creatina',   'u_victor', '08:30', '⚡', 'CREATINA & OMEGA 3',      'Tomar 5 g de creatina disuelta en agua y 2 perlas de Omega 3 con el desayuno.'),
  ('n_hidratacion','u_victor', '13:00', '💧', 'CONTROL DE HIDRATACIÓN',  'Asegura 1.5 L de agua acumulados antes de la comida principal.'),
  ('n_merienda',   'u_victor', '17:30', '🍌', 'MERIENDA ANABÓLICA',      'Batido de 30g de Proteína Whey + Plátano para reparar fibras musculares.'),
  ('n_magnesio',   'u_victor', '22:30', '🌙', 'MAGNESIO & SUEÑO PROFUNDO','Toma 1 dosis de magnesio 45 min antes de acostarte. ¡Hora de dormir 7-8 horas completas!');
