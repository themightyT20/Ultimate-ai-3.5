CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  api_key TEXT UNIQUE
);

CREATE TABLE chats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL,
  message TEXT NOT NULL,
  role TEXT NOT NULL, -- e.g. 'user' or 'assistant'
  created_at TIMESTAMP DEFAULT NOW()
);
