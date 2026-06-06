'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { sendWelcomeEmail } from '@/utils/resend'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?message=Could not authenticate user')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const handle = formData.get('handle') as string

  if (!handle || !email || !password) {
    return redirect('/signup?message=All fields are required')
  }

  // Check if handle is already taken
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('handle', handle)
    .single()

  if (existingUser) {
    return redirect('/signup?message=Handle is already taken')
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return redirect('/signup?message=Could not sign up user')
  }

  if (data.user) {
    // Insert handle into users table
    const { error: insertError } = await supabase
      .from('users')
      .insert({ id: data.user.id, handle: handle })

    if (insertError) {
      // In a real app, we might handle this gracefully (e.g. asking them to pick another handle later)
      console.error('Error inserting user handle:', insertError)
    }

    // Send welcome email via Resend
    await sendWelcomeEmail(email, handle)
  }

  return redirect('/login?message=Check email to continue sign in process')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
