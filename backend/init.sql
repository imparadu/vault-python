CREATE TABLE IF NOT EXISTS users (
  username VARCHAR(50) PRIMARY KEY,
  password VARCHAR(100) NOT NULL,
  rights TEXT[] NOT NULL
);

INSERT INTO users (username, password, rights) VALUES
  ('admin', '$2b$10$t5.8789Qq5w3HxtVvZnuWegDggaZ2mwi1oTd62ldXpCdE95P7A0oK', '{"read_db-cred","write_db-cred","read_api-key"}'),
  ('user1', '$2b$10$KNf1vMEIGPWUdr4jLGLR5ecxBDGxpmmdPKWwgkF2q2A4JIDuhJdZ6', '{"read_db-cred"}')
ON CONFLICT (username) DO NOTHING;
