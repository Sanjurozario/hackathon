-- ==============================================================================
-- VEXORIS SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Create Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Technical', 'Gaming')),
  format TEXT NOT NULL CHECK (format IN ('solo', 'group')),
  min_team_size INT NOT NULL DEFAULT 1,
  max_team_size INT NOT NULL DEFAULT 1,
  registration_open BOOLEAN NOT NULL DEFAULT true,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  rules JSONB NOT NULL DEFAULT '[]'::jsonb,
  eligibility TEXT NOT NULL DEFAULT 'Enrolled college students with valid student ID.',
  date TEXT DEFAULT 'TBA — Fest Schedule Announced Soon',
  time TEXT DEFAULT 'TBA',
  venue TEXT DEFAULT 'Main Campus Arena',
  prizes TEXT DEFAULT 'Cash Awards, Certificates & Trophies',
  district TEXT NOT NULL,
  accent TEXT NOT NULL DEFAULT 'cyan',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Registrations Table
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code TEXT UNIQUE NOT NULL,
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE RESTRICT,
  format TEXT NOT NULL CHECK (format IN ('solo', 'group')),
  team_name TEXT,
  participant_count INT NOT NULL CHECK (participant_count >= 1),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlisted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Participants Table
CREATE TABLE IF NOT EXISTS public.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE RESTRICT,
  full_name TEXT NOT NULL,
  class_course TEXT NOT NULL,
  department TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Uniqueness Enforcement:
-- Prevent a participant with the same Name and Department from submitting twice to the same event
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_participant_per_event
  ON public.participants (event_id, LOWER(TRIM(full_name)), LOWER(TRIM(department)));

-- Create indexes for fast search and joins
CREATE INDEX IF NOT EXISTS idx_participants_reg_id ON public.participants(registration_id);
CREATE INDEX IF NOT EXISTS idx_participants_event_id ON public.participants(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON public.registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_ref_code ON public.registrations(reference_code);

-- 5. Seed Initial 9 Official Events (Matches src/data/events.js)
INSERT INTO public.events (id, name, category, format, min_team_size, max_team_size, registration_open, short_description, full_description, district, accent)
VALUES
  ('it-manager', 'IT MANAGER', 'Technical', 'solo', 1, 1, true, 
   'Step into the role of an IT manager testing leadership, crisis response, and tech decision making.',
   'Troubleshoot systems, solve network issues, allocate digital resources, and manage critical server crises under extreme time pressure.',
   'Technical District', 'cyan'),
  
  ('quiz', 'QUIZ', 'Technical', 'group', 2, 2, true,
   'Test your knowledge across computing history, algorithms, cybersecurity, and emerging tech.',
   'Battle of wits in a rapid-fire buzzer showdown where precision and recall separate the champions from the rest.',
   'Technical District', 'cyan'),
  
  ('funzova', 'FUNZOVA', 'Technical', 'solo', 1, 1, true,
   'Fun meets tech: high-speed logic puzzles, algorithmic relays, and surprise challenges.',
   'Funzova fuses technical problem solving with adrenaline-filled party challenges.',
   'Technical District', 'cyan'),
  
  ('vextalk', 'VEXTALK', 'Technical', 'solo', 1, 1, true,
   'Business case presentations and solutions evaluated on communication and problem solving.',
   'VexTalk provides the stage for thinkers and innovators to articulate persuasive solutions to complex business problems.',
   'Technical District', 'cyan'),
  
  ('debate', 'DEBATE', 'Technical', 'group', 2, 2, true,
   'Competitive collegiate debate clashes on critical tech and societal motions.',
   'Clash heads on critical controversies shaping tomorrow''s digital civilization with constructive speeches and sharp rebuttals.',
   'Technical District', 'cyan'),
  
  ('bgmi', 'BGMI', 'Gaming', 'group', 4, 4, true,
   'Tactical mobile battle royale tournament across Erangel, Rondo, and Miramar.',
   'High-intensity drops, coordinated rotations, sniper cover, and tactical pushes across 3 competitive rounds.',
   'Gaming District', 'red'),
  
  ('nfs', 'NFS', 'Gaming', 'solo', 1, 1, true,
   'High-octane underground racing tournament with keyboard and controller setups.',
   'Rubber meets asphalt in a high-speed underground showcase across 4 knockout stages.',
   'Gaming District', 'red'),
  
  ('free-fire', 'FREE FIRE', 'Gaming', 'group', 4, 4, true,
   'Premier mobile battle royale championship across Kalahari, Purgatory, and Bermuda.',
   'Fast-paced squad combat across three battleground maps. Outmaneuver opponents and claim the ultimate Booyah.',
   'Gaming District', 'red'),
  
  ('efootball', 'E-FOOTBALL', 'Gaming', 'solo', 1, 1, true,
   'Intense 1v1 virtual soccer tournament with realistic pitch physics and tactical play.',
   'Take control of world football giants. Master tactical passing, precision shooting, and defensive solidity in knockout matches.',
   'Gaming District', 'red')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  format = EXCLUDED.format,
  min_team_size = EXCLUDED.min_team_size,
  max_team_size = EXCLUDED.max_team_size,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  district = EXCLUDED.district,
  accent = EXCLUDED.accent;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Events Policies:
-- Anyone can view events
DROP POLICY IF EXISTS "Public can view events" ON public.events;
CREATE POLICY "Public can view events" 
  ON public.events FOR SELECT 
  USING (true);

-- Only authenticated admins can modify events
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
CREATE POLICY "Admins can update events" 
  ON public.events FOR UPDATE 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- Registrations Policies:
-- Anyone can insert a registration (Public registration without account)
DROP POLICY IF EXISTS "Public can register" ON public.registrations;
CREATE POLICY "Public can register" 
  ON public.registrations FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- Public & Admins can read registrations (required for .select() on insert and verification)
DROP POLICY IF EXISTS "Admins can view registrations" ON public.registrations;
DROP POLICY IF EXISTS "Public can view registrations" ON public.registrations;
CREATE POLICY "Public can view registrations" 
  ON public.registrations FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- Only authenticated admins can update/delete registrations
DROP POLICY IF EXISTS "Admins can update registrations" ON public.registrations;
CREATE POLICY "Admins can update registrations" 
  ON public.registrations FOR UPDATE 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete registrations" ON public.registrations;
CREATE POLICY "Admins can delete registrations" 
  ON public.registrations FOR DELETE 
  TO authenticated 
  USING (true);

-- Participants Policies:
-- Anyone can insert participants during registration
DROP POLICY IF EXISTS "Public can insert participants" ON public.participants;
CREATE POLICY "Public can insert participants" 
  ON public.participants FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- Public & Admins can read participants (required for duplicate verification)
DROP POLICY IF EXISTS "Admins can view participants" ON public.participants;
DROP POLICY IF EXISTS "Public can view participants" ON public.participants;
CREATE POLICY "Public can view participants" 
  ON public.participants FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- Only authenticated admins can modify/delete participants
DROP POLICY IF EXISTS "Admins can update participants" ON public.participants;
CREATE POLICY "Admins can update participants" 
  ON public.participants FOR UPDATE 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete participants" ON public.participants;
CREATE POLICY "Admins can delete participants" 
  ON public.participants FOR DELETE 
  TO authenticated 
  USING (true);
