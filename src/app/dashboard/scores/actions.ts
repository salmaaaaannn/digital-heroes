'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export interface SubmitScoreResult {
  success: boolean
  error?: string
  message?: string
}

export async function submitScore(formData: FormData): Promise<SubmitScoreResult> {
  try {
    const supabase = createClient()

    // 1. Authenticate user from real session
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: "You must be logged in to record a score.",
      }
    }

    // 2. Extract and sanitize inputs
    const rawScore = formData.get('score')
    const rawDate = formData.get('playedAt') || formData.get('scoreDate')

    if (!rawScore) {
      return {
        success: false,
        error: "Please enter your Stableford score.",
      }
    }

    const score = Number(rawScore)
    if (!Number.isInteger(score) || score < 1 || score > 45) {
      return {
        success: false,
        error: "Stableford score must be a whole number between 1 and 45.",
      }
    }

    if (!rawDate || typeof rawDate !== 'string') {
      return {
        success: false,
        error: "Score date is required.",
      }
    }

    // Normalize date to YYYY-MM-DD
    const parsedDate = new Date(rawDate)
    if (isNaN(parsedDate.getTime())) {
      return {
        success: false,
        error: "Invalid date format. Please select a valid date.",
      }
    }

    const normalizedDate = parsedDate.toISOString().split('T')[0]

    // 3. Ensure user profile exists to satisfy foreign key constraints
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (!existingProfile) {
      await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Golfer',
        role: 'subscriber',
      })
    }

    // 4. Explicit duplicate date check for THAT USER only
    const { data: existingScore } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', user.id)
      .eq('score_date', normalizedDate)
      .maybeSingle()

    if (existingScore) {
      return {
        success: false,
        error: "You already have a score for this date.",
      }
    }

    // 5. Insert new score
    const { data: insertedRow, error: insertError } = await supabase
      .from('scores')
      .insert({
        user_id: user.id,
        stableford_score: score,
        score_date: normalizedDate,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error("submitScore Supabase error:", {
        error: insertError,
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
      })

      // Duplicate constraint violation code in Postgres is 23505
      if (insertError.code === '23505') {
        return {
          success: false,
          error: "You already have a score for this date.",
        }
      }

      return {
        success: false,
        error: "We couldn't save your score right now. Please try again.",
      }
    }

    // 6. Rolling 5-Score Rule: Prune scores so exactly the latest 5 remain
    // The newly submitted score is always retained, and oldest excess score is pruned
    const { data: userScores } = await supabase
      .from('scores')
      .select('id, score_date')
      .eq('user_id', user.id)
      .order('score_date', { ascending: false })

    if (userScores && userScores.length > 5) {
      let excessIds: string[] = []
      const newScoreIndex = userScores.findIndex(s => s.id === insertedRow?.id)
      if (newScoreIndex >= 5) {
        // Newly added score has the oldest date, so prune the oldest previous score (index 4)
        excessIds = [userScores[4].id]
      } else {
        // Prune the trailing excess score(s)
        excessIds = userScores.slice(5).map(s => s.id)
      }

      if (excessIds.length > 0) {
        await supabase
          .from('scores')
          .delete()
          .in('id', excessIds)
      }
    }

    // 7. Revalidate relevant pages
    revalidatePath('/dashboard/scores')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/performance')
    revalidatePath('/dashboard/achievements')

    return {
      success: true,
      message: "Score logged successfully into your Performance Core!",
    }
  } catch (err: any) {
    console.error("submitScore unexpected exception:", err)
    return {
      success: false,
      error: "An unexpected error occurred while saving your score. Please try again.",
    }
  }
}
