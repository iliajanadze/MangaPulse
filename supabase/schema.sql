-- ==============================================================================
-- MangaPulse - Supabase / PostgreSQL Database Schema
-- Run this in your Supabase SQL Editor (supabase.com -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Mangas Table
CREATE TABLE IF NOT EXISTS mangas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  alt_title TEXT,
  author TEXT NOT NULL DEFAULT 'Unknown',
  artist TEXT,
  mangadex_id TEXT UNIQUE,
  cover_image TEXT,
  banner_image TEXT,
  description TEXT,
  status TEXT DEFAULT 'Ongoing' CHECK (status IN ('Ongoing', 'Completed', 'Hiatus')),
  genres TEXT[] DEFAULT '{}',
  rating NUMERIC(3, 2) DEFAULT 5.0,
  views BIGINT DEFAULT 0,
  latest_chapter TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Chapters Table
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manga_id UUID NOT NULL REFERENCES mangas(id) ON DELETE CASCADE,
  chapter_number TEXT NOT NULL,
  title TEXT,
  release_date TIMESTAMPTZ DEFAULT NOW(),
  page_count INT DEFAULT 0,
  pages TEXT[] NOT NULL DEFAULT '{}',
  scanlation_group TEXT DEFAULT 'MangaPulse Bot',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(manga_id, chapter_number)
);

-- 4. User Reading History Table (Tracks current reading page)
CREATE TABLE IF NOT EXISTS reading_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID, -- Optional Supabase Auth user ID
  manga_id UUID NOT NULL REFERENCES mangas(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  page_index INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, manga_id)
);

-- 5. User Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  manga_id UUID NOT NULL REFERENCES mangas(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, manga_id)
);

-- 6. Indexes for ultra-fast query performance
CREATE INDEX IF NOT EXISTS idx_mangas_rating ON mangas(rating DESC);
CREATE INDEX IF NOT EXISTS idx_mangas_views ON mangas(views DESC);
CREATE INDEX IF NOT EXISTS idx_mangas_updated ON mangas(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chapters_lookup ON chapters(manga_id, chapter_number DESC);

-- 7. Sample Initial Seed Data (Optional)
INSERT INTO mangas (id, title, alt_title, author, mangadex_id, description, status, genres, rating, latest_chapter)
VALUES 
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Shadow Sovereign: Monarch Rise',
  'სოლო მონარქი: ჩრდილის აღზევება',
  'Chugong',
  '32d76d19-8a05-4db0-9fc2-e0b0648fe9d0',
  '10 წლის წინ, როდესაც კარიბჭეები გაიხსნა, სუნ ჯინ-ვუ გახდა უძლიერესი ჩრდილის მონარქი.',
  'Ongoing',
  ARRAY['Action', 'Fantasy', 'Supernatural'],
  4.95,
  '182'
)
ON CONFLICT (mangadex_id) DO NOTHING;
