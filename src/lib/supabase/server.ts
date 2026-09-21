import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

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
  const cookieStore = cookies()
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isConfigured = isSupabaseConfigured();

  const supabaseUrl = isConfigured && rawUrl
    ? rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
    : 'https://dummy.supabase.co';

  return createServerClient(
    supabaseUrl,
    isConfigured && supabaseKey ? supabaseKey : 'dummy_key',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Ignored if called from a Server Component where cookies cannot be set
          }
        },
      },
      global: {
        fetch: async (url, options) => {
          if (!isConfigured) {
            // Instantly return empty result if unconfigured to avoid connection timeouts
            return new Response(JSON.stringify([]), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          try {
            return await fetch(url, { ...options, signal: controller.signal });
          } finally {
            clearTimeout(timeoutId);
          }
        }
      }
    }
  )
}

export function createAdminClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (
    !rawUrl ||
    !serviceRoleKey ||
    serviceRoleKey === 'YOUR_SERVICE_ROLE_KEY' ||
    serviceRoleKey.includes('dummy')
  ) {
    return null;
  }

  const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
