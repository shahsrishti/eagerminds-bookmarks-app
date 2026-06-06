'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createBookmark(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title') as string
  const url = formData.get('url') as string
  const is_public = formData.get('is_public') === 'on'

  const { error } = await supabase.from('bookmarks').insert({
    user_id: user.id,
    title,
    url,
    is_public,
  })

  if (error) {
    throw new Error('Failed to create bookmark')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function updateBookmark(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title') as string
  const url = formData.get('url') as string
  const is_public = formData.get('is_public') === 'on'

  const { error } = await supabase
    .from('bookmarks')
    .update({
      title,
      url,
      is_public,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id) // Extra safety, though RLS protects this

  if (error) {
    throw new Error('Failed to update bookmark')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function deleteBookmark(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // Extra safety

  if (error) {
    throw new Error('Failed to delete bookmark')
  }

  revalidatePath('/dashboard')
}
