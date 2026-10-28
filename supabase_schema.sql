-- Supabase SQL Schema for ITM Hackathon (YatraSathi)
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run

CREATE TABLE IF NOT EXISTS public.trip_inputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    destination TEXT NOT NULL,
    trending_destinations JSONB DEFAULT '["Jaipur", "Varanasi", "Hampi", "Goa", "Udaipur"]'::jsonb,
    start_date TEXT DEFAULT 'Oct 14',
    end_date TEXT DEFAULT 'Oct 18',
    days INT NOT NULL DEFAULT 4,
    nights INT DEFAULT 3,
    guests INT NOT NULL DEFAULT 2,
    spend_per_person NUMERIC DEFAULT 18500.0,
    total_budget NUMERIC DEFAULT 37000.0,
    budget_tier TEXT DEFAULT 'Comfortable Boutique',
    budget_breakdown JSONB DEFAULT '{"stay_pct": 42, "experiences_pct": 34, "dining_transit_pct": 24}'::jsonb,
    interests JSONB DEFAULT '["Heritage & Forts", "Culinary Trails", "Nature & Lakes", "Art & Workshops", "Folk Performances", "Evening Rooftops", "Lake Kayaking"]'::jsonb,
    spiritual_traditions JSONB DEFAULT '["Hindu & Vedic Temples", "Jain Pilgrimage & Architecture", "Sufi & Islamic Shrines", "Buddhist Monasteries", "Sikh Gurdwaras", "Ancient Synagogues & Churches", "All Spiritual Traditions / Secular"]'::jsonb,
    expedition_paces JSONB DEFAULT '["Relaxed", "Balanced", "Packed"]'::jsonb,
    selected_pace TEXT DEFAULT 'Balanced',
    transit_modes JSONB DEFAULT '["directions_walk", "local_taxi", "directions_bus", "two_wheeler"]'::jsonb,
    selected_transit TEXT DEFAULT 'local_taxi',
    status TEXT DEFAULT 'active',
    generated_itinerary JSONB DEFAULT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.trip_inputs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users with publishable/anon key to insert and select
CREATE POLICY "Allow public insert to trip_inputs"
    ON public.trip_inputs FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public read from trip_inputs"
    ON public.trip_inputs FOR SELECT
    USING (true);

CREATE POLICY "Allow public update to trip_inputs"
    ON public.trip_inputs FOR UPDATE
    USING (true);
