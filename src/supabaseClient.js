import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pocqjyrhccxsfhnidkuz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvY3FqeXJoY2N4c2Zobmlka3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5ODE0MzgsImV4cCI6MjA2MzU1NzQzOH0.p64S8028GCD3aZSpqhgs6eYLi0O1WTx8F3oWkXWErqI";

export const supabase = createClient(supabaseUrl, supabaseKey);
