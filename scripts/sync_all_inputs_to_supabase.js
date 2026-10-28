// sync_all_inputs_to_supabase.js
// Continuously connects to Supabase and syncs all trip inputs until success.

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://jxtmvfamgyrmnlzfgfwq.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_4-sM0agOoz1UH8I5zUKBGw_LTTn-9Qy';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const allInputsPayload = {
  destination: "Udaipur, Rajasthan, India",
  trending_destinations: ["Jaipur", "Varanasi", "Hampi", "Goa", "Udaipur"],
  start_date: "Oct 14",
  end_date: "Oct 18",
  days: 4,
  nights: 3,
  guests: 2,
  spend_per_person: 18500,
  total_budget: 37000,
  budget_tier: "Comfortable Boutique",
  budget_breakdown: {
    stay_pct: 42,
    experiences_pct: 34,
    dining_transit_pct: 24
  },
  interests: [
    "Heritage & Forts",
    "Culinary Trails",
    "Nature & Lakes",
    "Art & Workshops",
    "Folk Performances",
    "Evening Rooftops",
    "Lake Kayaking"
  ],
  spiritual_traditions: [
    "Hindu & Vedic Temples",
    "Jain Pilgrimage & Architecture",
    "Sufi & Islamic Shrines",
    "Buddhist Monasteries",
    "Sikh Gurdwaras",
    "Ancient Synagogues & Churches",
    "All Spiritual Traditions / Secular"
  ],
  expedition_paces: ["Relaxed", "Balanced", "Packed"],
  selected_pace: "Balanced",
  transit_modes: ["directions_walk", "local_taxi", "directions_bus", "two_wheeler"],
  selected_transit: "local_taxi",
  status: "active",
  created_at: new Date().toISOString()
};

async function syncLoop(maxAttempts = 10, intervalSeconds = 3) {
  console.log("=============================================================");
  console.log("YatraSathi: Supabase Trip Inputs Sync Engine");
  console.log("Target Supabase URL:", SUPABASE_URL);
  console.log("=============================================================\n");

  const tables = ['trip_inputs', 'trips'];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`[Attempt ${attempt}/${maxAttempts}] Attempting to push inputs to Supabase...`);

    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).insert([allInputsPayload]).select();
        
        if (!error && data) {
          console.log(`\n>>> SUCCESS! All inputs successfully recorded into Supabase table '${table}'!`);
          console.log("Recorded record:", JSON.stringify(data[0], null, 2));
          return true;
        }

        if (error) {
          if (error.message.includes('Could not find the table') || error.code === 'PGRST205') {
            console.log(`Table '${table}' not found in public schema.`);
          } else {
            console.log(`Supabase error on '${table}':`, error.message);
          }
        }
      } catch (err) {
        console.log(`Connection error on '${table}':`, err.message);
      }
    }

    if (attempt < maxAttempts) {
      console.log(`Waiting ${intervalSeconds} seconds before retry...`);
      await new Promise(r => setTimeout(r, intervalSeconds * 1000));
    }
  }

  console.log("\n-------------------------------------------------------------");
  console.log("NOTICE: Supabase table 'trip_inputs' has not been created in the database yet.");
  console.log("To create it in Supabase Dashboard SQL Editor, run:");
  console.log(`
CREATE TABLE IF NOT EXISTS public.trip_inputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    destination TEXT NOT NULL,
    trending_destinations JSONB,
    start_date TEXT,
    end_date TEXT,
    days INT NOT NULL,
    nights INT,
    guests INT NOT NULL,
    spend_per_person NUMERIC,
    total_budget NUMERIC,
    budget_tier TEXT,
    budget_breakdown JSONB,
    interests JSONB,
    spiritual_traditions JSONB,
    expedition_paces JSONB,
    selected_pace TEXT,
    transit_modes JSONB,
    selected_transit TEXT,
    status TEXT DEFAULT 'active'
);

ALTER TABLE public.trip_inputs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon insert" ON public.trip_inputs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select" ON public.trip_inputs FOR SELECT USING (true);
  `);
  console.log("-------------------------------------------------------------\n");
  return false;
}

syncLoop();
