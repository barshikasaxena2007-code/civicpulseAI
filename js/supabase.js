const SUPABASE_URL='https://qoruebryqinpgtenpdix.supabase.co';
const SUPABASE_ANON_KEY='sb_publishable_cs35k1m7OkuJDq_iD5mOkQ_LgxPB5ZT';
const supabaseClient=supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
window.supabaseClient=supabaseClient;