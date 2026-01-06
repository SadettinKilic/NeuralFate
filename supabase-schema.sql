-- Neural Fate Database Schema
-- Run this script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Rooms table for multiplayer sessions
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_code VARCHAR(4) UNIQUE NOT NULL,
  host_id UUID,
  difficulty VARCHAR(10) DEFAULT 'MEDIUM',
  status VARCHAR(20) DEFAULT 'waiting',
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  current_phase VARCHAR(20) DEFAULT 'setup'
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  player_number INTEGER,
  name VARCHAR(50),
  avatar VARCHAR(100),
  choices JSONB DEFAULT '[]',
  suspicion_level INTEGER DEFAULT 100,
  is_killer BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Scenarios table for caching successful stories
CREATE TABLE IF NOT EXISTS scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  difficulty VARCHAR(10),
  convergence_location VARCHAR(100),
  dilemmas JSONB,
  questions JSONB,
  rating INTEGER,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Game state table for real-time synchronization
CREATE TABLE IF NOT EXISTS game_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  current_time VARCHAR(5),
  phase VARCHAR(20),
  data JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_rooms_code ON rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_players_room ON players(room_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_difficulty ON scenarios(difficulty);
CREATE INDEX IF NOT EXISTS idx_scenarios_rating ON scenarios(rating);
CREATE INDEX IF NOT EXISTS idx_game_state_room ON game_state(room_id);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_state ENABLE ROW LEVEL SECURITY;

-- Policies for public access (adjust based on security needs)
CREATE POLICY "Allow all operations on rooms" ON rooms FOR ALL USING (true);
CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true);
CREATE POLICY "Allow all operations on scenarios" ON scenarios FOR ALL USING (true);
CREATE POLICY "Allow all operations on game_state" ON game_state FOR ALL USING (true);
