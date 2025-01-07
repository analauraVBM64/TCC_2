import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ghcyoiewtxywpzitgset.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoY3lvaWV3dHh5d3B6aXRnc2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2ODUwODAsImV4cCI6MjA1MTI2MTA4MH0.zNElzP9EXv5N4btIZjfIPZPXouCd9HKSfzEUa3etVNg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
