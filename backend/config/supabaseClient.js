// import dotenv from "dotenv";
import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase credentials
const SUPABASE_URL = 'https://poefvefizqqlhnnkdwdg.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZWZ2ZWZpenFxbGhubmtkd2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2NzgzMzIsImV4cCI6MjA1MDI1NDMzMn0.g6NaYhHPsA97I-9WJzQ8P4FbiXOSe85YPIViNT65vsQ'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
