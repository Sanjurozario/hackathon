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

-- 5. Seed Initial 9 Events (Matches the VEXORIS official specification)
INSERT INTO public.events (id, name, category, format, min_team_size, max_team_size, registration_open, short_description, full_description, district, accent)
VALUES
  ('it-manager', 'IT MANAGER', 'Technical', 'solo', 1, 1, true, 
   'The ultimate leadership test of crisis management, strategic budgeting, and tech acumen.',
   'Step into the executive suite of a tech conglomerate under severe digital pressure. IT Manager tests your strategic decision-making, tech resource allocation, stress management, and cross-functional leadership in high-stakes corporate simulations.',
   'District Alpha (Technical Hub)', 'cyan'),
  
  ('quiz', 'QUIZ', 'Technical', 'group', 2, 2, true,
   'Battle of wits across computational history, algorithms, cybersecurity, and emerging tech.',
   'From the early silicon pioneers to neural network architectures, quantum supremacy, and underground cyber culture. Test your technical knowledge in an intense multi-round buzzer tournament.',
   'District Alpha (Technical Hub)', 'cyan'),
  
  ('funzova', 'FUNZOVA', 'Technical', 'group', 2, 4, true,
   'Unconventional tech-entertainment fusion: blind coding, reverse engineering, and puzzle decoding.',
   'Funzova breaks the monotony of traditional tech challenges. Experience high-speed code relays, blindfolded algorithmic typing, cryptic clue hunts, and quirky engineering problem-solving.',
   'District Alpha (Technical Hub)', 'cyan'),
  
  ('vextalk', 'VEXTALK', 'Technical', 'solo', 1, 1, true,
   'Keynote oratory on frontier technologies, ethical AI, and futuristic urban computing.',
   'The city needs bold voices. VexTalk provides the stage for thought leaders to pitch visionary ideas, dissect emerging tech paradoxes, and persuade audiences through compelling verbal rhetoric and slide design.',
   'District Alpha (Technical Hub)', 'cyan'),
  
  ('debate', 'DEBATE', 'Technical', 'group', 2, 2, true,
   'Oxford-style parliamentary clashes on algorithmic governance, privacy, and digital power.',
   'Clash heads on the critical controversies shaping tomorrow’s digital civilisation. Argue for or against motions on AI autonomy, surveillance capitalism, decentralized economics, and cyber warfare.',
   'District Alpha (Technical Hub)', 'cyan'),
  
  ('bgmi', 'BGMI', 'Gaming', 'group', 4, 4, true,
   'Squad-based tactical battle royale across Erangel and Miramar. Survival is everything.',
   'Drop into high-intensity drop zones. Coordinate rotations, secure airdrop weaponry, and hold choke points in the ultimate tactical mobile esports showdown.',
   'District Beta (Gaming Arena)', 'red'),
  
  ('nfs', 'NFS', 'Gaming', 'solo', 1, 1, true,
   'High-octane underground street racing. Master drift angles, nitrous timing, and apex turns.',
   'Rubber meets asphalt in a battle of pure precision and nerve. Race through neon-soaked metropolitan expressways and switchbacks under intense tournament bracket conditions.',
   'District Beta (Gaming Arena)', 'red'),
  
  ('deadshot', 'DEADSHOT', 'Gaming', 'solo', 1, 1, true,
   'Precision FPS reflex shootout. Quick-scoping, snap aiming, and tactical reaction time.',
   'One bullet, one target. Step into the virtual firing range and 1v1 arenas where milliseconds determine the victor. Test your hand-eye coordination against the sharpest collegiate shooters.',
   'District Beta (Gaming Arena)', 'red'),
  
  ('real-cricket', 'REAL CRICKET', 'Gaming', 'solo', 1, 1, true,
   'Virtual willow warfare. Shot selection, field placements, and clutch over bowling under pressure.',
   'The thrill of the stadium in the palm of your hand. Execute delicate late cuts, towering sixes over long-on, and unplayable yorkers in tense head-to-head limited-overs matches.',
   'District Beta (Gaming Arena)', 'red')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Events Policies:
-- Anyone can view events
CREATE POLICY "Public can view events" 
  ON public.events FOR SELECT 
  USING (true);

-- Only authenticated admins can modify events
CREATE POLICY "Admins can update events" 
  ON public.events FOR UPDATE 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- Registrations Policies:
-- Anyone can insert a registration (Public registration without account)
CREATE POLICY "Public can register" 
  ON public.registrations FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- Only authenticated admins can view registrations (Strict privacy)
CREATE POLICY "Admins can view registrations" 
  ON public.registrations FOR SELECT 
  TO authenticated 
  USING (true);

-- Only authenticated admins can update/delete registrations
CREATE POLICY "Admins can update registrations" 
  ON public.registrations FOR UPDATE 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete registrations" 
  ON public.registrations FOR DELETE 
  TO authenticated 
  USING (true);

-- Participants Policies:
-- Anyone can insert participants during registration
CREATE POLICY "Public can insert participants" 
  ON public.participants FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- Only authenticated admins can view participant information
CREATE POLICY "Admins can view participants" 
  ON public.participants FOR SELECT 
  TO authenticated 
  USING (true);

-- Only authenticated admins can modify/delete participants
CREATE POLICY "Admins can update participants" 
  ON public.participants FOR UPDATE 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete participants" 
  ON public.participants FOR DELETE 
  TO authenticated 
  USING (true);
