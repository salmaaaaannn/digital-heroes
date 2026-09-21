'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signup(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('fullName') as string,
      }
    }
  }

  const confirm = formData.get('confirmPassword') as string
  if (data.password !== confirm) {
    redirect('/signup?error=Passwords do not match')
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/signup?error=Could not create user')
  }

  if (authData?.user) {
    try {
      await supabase.from('profiles').upsert({
        id: authData.user.id,
        full_name: (formData.get('fullName') as string)?.trim() || 'Golfer',
        role: 'subscriber',
      })
    } catch (e) {
      console.error('Failed to create profile row in server action:', e)
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
