'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitCharitySelection(userId: string, charityId: string, percentage: number) {
  const supabase = createClient()

  const { error } = await supabase
    .from('user_charities')
    .upsert({ 
      user_id: userId, 
      charity_id: charityId, 
      percentage: percentage 
    }, { onConflict: 'user_id' })

  if (error) {
    console.error("Error setting charity:", error);
    throw new Error('Failed to save charity selection')
  }

  return { success: true }
}
