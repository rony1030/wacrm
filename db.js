const { createClient } = require('@supabase/supabase-js');

// Hostinger auto-injects SUPABASE_URL and SUPABASE_API_KEY
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_API_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Test the connection using 'profiles' (which is created by WACRM migrations)
supabase
  .from('profiles')
  .select('*')
  .limit(1)
  .then(({ data, error }) => {
    if (error) console.error('Connection error:', error);
    else console.log('Connected successfully! Profiles data:', data);
  });

module.exports = supabase;
