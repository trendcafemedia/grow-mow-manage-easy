
import { createClient } from '@supabase/supabase-js';

// Fallback to hardcoded values from src/integrations/supabase/client.ts if env vars aren't available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://vtvlpphqcfektueuapeh.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0dmxwcGhxY2Zla3R1ZXVhcGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjkwOTYsImV4cCI6MjA2MDg0NTA5Nn0.nlfeKa4T8JKWfVkM6rsT5mv2B2cg9LNwklmN591QIcM";

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials missing. Authentication features may not work correctly.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
