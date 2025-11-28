import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nqqjcykjvhmybemmtufa.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xcWpjeWtqdmhteWJlbW10dWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzAzOTAsImV4cCI6MjA3OTkwNjM5MH0.Np_Co31N6Qxdmx8qJ0NS3IZHsYp8CPzqxkXChPFIgMQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
