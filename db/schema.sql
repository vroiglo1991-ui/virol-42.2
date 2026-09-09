-- ============================================================
-- VIROL // ESQUEMA D1 (SQLite) — MULTI-ATLETA
-- ============================================================
-- Diseñado para Cloudflare D1. Ejecutar con:
--   wrangler d1 execute virol-db --file=./db/schema.sql
-- ============================================================

PRAGMA foreign_keys = ON;

-- ------------------------------------------------------------
-- 1. GYMS (multi-tenant a futuro: marca blanca por gimnasio/entrenador)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gyms (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    logo_url      TEXT,
    primary_color TEXT DEFAULT '#FF5A00',
    accent_color  TEXT DEFAULT '#C8FF00',
    created_at    TEXT DEFAULT (datetime('now'))
);

-- ------------------------------------------------------------
-- 2. USERS (atletas)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id              TEXT PRIMARY KEY,
    gym_id          TEXT REFERENCES gyms(id) ON DELETE SET NULL,
    email           TEXT UNIQUE NOT NULL,
    password_hash   TEXT,
    name            TEXT NOT NULL,
    avatar_url      TEXT,
    weight_kg       REAL,
    height_cm       REAL,
    strava_athlete_id TEXT,
    strava_access_token  TEXT,
    strava_refresh_token TEXT,
    strava_token_expires_at TEXT,
    role            TEXT DEFAULT 'athlete',
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_gym ON users(gym_id);

-- ------------------------------------------------------------
-- 3. GOALS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS goals (
    id            TEXT PRIMARY KEY,
    user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label         TEXT NOT NULL,
    goal_type     TEXT NOT NULL,
    distance_km   REAL,
    target_date   TEXT NOT NULL,
    priority      INTEGER DEFAULT 1,
    created_at    TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_goals_user ON goals(user_id);

-- ------------------------------------------------------------
-- 4. TRAINING_PLANS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS training_plans (
    id            TEXT PRIMARY KEY,
    user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name          TEXT NOT NULL,
    weekly_km_target REAL DEFAULT 0,
    is_active     INTEGER DEFAULT 1,
    template_source TEXT,
    created_at    TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_plans_user ON training_plans(user_id, is_active);

-- ------------------------------------------------------------
-- 5. WEEKLY_SESSIONS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS weekly_sessions (
    id              TEXT PRIMARY KEY,
    plan_id         TEXT NOT NULL REFERENCES training_plans(id) ON DELETE CASCADE,
    day_of_week     INTEGER NOT NULL,
    session_type    TEXT NOT NULL,
    badge           TEXT,
    title           TEXT NOT NULL,
    description     TEXT,
    target_km       REAL DEFAULT 0,
    tags            TEXT,
    exercises_json  TEXT,
    sort_order      INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_sessions_plan ON weekly_sessions(plan_id, day_of_week);

-- ------------------------------------------------------------
-- 6. SESSION_LOGS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS session_logs (
    id              TEXT PRIMARY KEY,
    user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id      TEXT REFERENCES weekly_sessions(id) ON DELETE SET NULL,
    log_date        TEXT NOT NULL,
    completed       INTEGER DEFAULT 0,
    strava_activity_id TEXT,
    distance_km     REAL,
    duration_sec    INTEGER,
    avg_pace_sec_km INTEGER,
    perceived_effort INTEGER,
    sleep_hours     REAL,
    notes           TEXT,
    created_at      TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_logs_user_date ON session_logs(user_id, log_date);

-- ------------------------------------------------------------
-- 7. MEAL_PLANS + MEALS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS meal_plans (
    id              TEXT PRIMARY KEY,
    user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    daily_kcal      INTEGER,
    protein_g       INTEGER,
    carbs_g         INTEGER,
    fat_g           INTEGER,
    is_active       INTEGER DEFAULT 1,
    generated_by    TEXT DEFAULT 'manual',
    created_at      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS meals (
    id              TEXT PRIMARY KEY,
    meal_plan_id    TEXT NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
    slot            TEXT NOT NULL,
    title           TEXT NOT NULL,
    time_window     TEXT,
    summary         TEXT,
    items_json      TEXT,
    sort_order      INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_meals_plan ON meals(meal_plan_id);

-- ------------------------------------------------------------
-- 8. SUPPLEMENTS + LOGS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS supplements (
    id            TEXT PRIMARY KEY,
    user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name          TEXT NOT NULL,
    dose          TEXT,
    timing_note   TEXT,
    purpose_note  TEXT,
    alarm_time    TEXT,
    is_active     INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_supplements_user ON supplements(user_id);

CREATE TABLE IF NOT EXISTS supplement_logs (
    id              TEXT PRIMARY KEY,
    supplement_id   TEXT NOT NULL REFERENCES supplements(id) ON DELETE CASCADE,
    log_date        TEXT NOT NULL,
    taken           INTEGER DEFAULT 0,
    taken_at        TEXT
);

CREATE INDEX IF NOT EXISTS idx_supplogs_date ON supplement_logs(supplement_id, log_date);

-- ------------------------------------------------------------
-- 9. SHOPPING_LISTS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shopping_lists (
    id            TEXT PRIMARY KEY,
    user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week_start    TEXT NOT NULL,
    categories_json TEXT,
    created_at    TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_shopping_user_week ON shopping_lists(user_id, week_start);

-- ------------------------------------------------------------
-- 10. WEEKLY_ARCHIVES
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS weekly_archives (
    id              TEXT PRIMARY KEY,
    user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week_start      TEXT NOT NULL,
    week_end        TEXT NOT NULL,
    total_km        REAL,
    sessions_completed INTEGER,
    sessions_total  INTEGER,
    avg_sleep_hours REAL,
    summary_json    TEXT,
    archived_at     TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_archives_user ON weekly_archives(user_id, week_start);

-- ------------------------------------------------------------
-- 11. NOTIFICATIONS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id            TEXT PRIMARY KEY,
    user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trigger_time  TEXT NOT NULL,
    icon          TEXT,
    title         TEXT NOT NULL,
    body          TEXT,
    is_active     INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
