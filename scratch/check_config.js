const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role bypasses RLS
);

async function check() {
  const { data: configs, error: configError } = await supabase
    .from('whatsapp_config')
    .select('*');

  console.log('--- whatsapp_config table ---');
  if (configError) {
    console.error('Error fetching configs:', configError);
  } else {
    console.log(configs);
  }

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*');

  console.log('--- profiles table ---');
  if (profileError) {
    console.error('Error fetching profiles:', profileError);
  } else {
    console.log(profiles);
  }
}

check();
