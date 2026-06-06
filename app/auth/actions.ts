'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { sendWelcomeEmail } from '@/utils/resend'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error)
    return redirect('/login?message=Could not authenticate user')
  }

  // Ensure user is in the public.users table (handles the case where signup insert failed due to RLS/email confirmation)
  if (authData?.user) {
    const { data: profile } = await supabase.from('users').select('id').eq('id', authData.user.id).single()
    if (!profile) {
      await supabase.from('users').insert({ 
        id: authData.user.id, 
        handle: authData.user.user_metadata?.handle || `user_${authData.user.id.substring(0, 8)}`
      })
    }
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
    options: {
      data: {
        handle: handle,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    }
  })

  if (error) {
    console.error('Signup error:', error)
    return redirect('/signup?message=Could not sign up user')
  }

  if (data.user) {
    // Attempt to insert handle into users table immediately (may fail if email confirmation is required)
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
