import { cache } from 'react';
import { createClient } from './server';

/**
 * Deduplicated server-side user retrieval for Server Components.
 * React cache() ensures that within a single render request cycle,
 * multiple calls to getAuthUser() share the exact same promise and result,
 * avoiding duplicate remote network roundtrips to Supabase Auth.
 */
export const getAuthUser = cache(async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
