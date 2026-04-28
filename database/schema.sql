CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  dob        DATE,
  blood_type VARCHAR(5),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE visits (
  id          SERIAL PRIMARY KEY,
  user_id     INT REFERENCES users(id) ON DELETE CASCADE,
  doctor_name VARCHAR(100),
  specialty   VARCHAR(100),
  visit_date  DATE NOT NULL,
  notes       TEXT,
  diagnosis   TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE medications (
  id         SERIAL PRIMARY KEY,
  user_id    INT REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(100) NOT NULL,
  dosage     VARCHAR(50),
  frequency  VARCHAR(50),
  start_date DATE,
  end_date   DATE,
  is_active  BOOLEAN DEFAULT TRUE
);

CREATE TABLE lab_results (
  id            SERIAL PRIMARY KEY,
  user_id       INT REFERENCES users(id) ON DELETE CASCADE,
  visit_id      INT REFERENCES visits(id),
  test_name     VARCHAR(150) NOT NULL,
  value         NUMERIC,
  unit          VARCHAR(30),
  reference_min NUMERIC,
  reference_max NUMERIC,
  test_date     DATE NOT NULL
);

CREATE TABLE symptoms (
  id        SERIAL PRIMARY KEY,
  user_id   INT REFERENCES users(id) ON DELETE CASCADE,
  symptom   VARCHAR(200),
  severity  INT CHECK (severity BETWEEN 1 AND 10),
  logged_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_insights (
  id           SERIAL PRIMARY KEY,
  user_id      INT REFERENCES users(id) ON DELETE CASCADE,
  insight_type VARCHAR(50),
  content      TEXT,
  generated_at TIMESTAMP DEFAULT NOW()
);