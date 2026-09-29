import { createClient } from '@supabase/supabase-js'
const url = import.meta.env.VITE_SUPABASE_URL, key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const configured = Boolean(url && key && url.startsWith('http') && !url.includes('YOUR-PROJECT'))
export const supabase = createClient(configured ? url : 'https://placeholder.supabase.co', configured ? key : 'placeholder')
