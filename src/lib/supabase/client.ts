import { createBrowserClient } from '@supabase/ssr'

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Boolean(
    url && 
    !url.includes('dummy') && 
    key && 
    !key.includes('dummy') &&
    key !== 'YOUR_KEY_HERE'
  );
}

export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const configured = isSupabaseConfigured();

  // Strip trailing /rest/v1 or trailing slash if accidentally added
  const supabaseUrl = configured && rawUrl
    ? rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
    : 'https://dummy.supabase.co';

  return createBrowserClient(
    supabaseUrl,
    configured && supabaseKey ? supabaseKey : 'dummy_key'
  )
}
