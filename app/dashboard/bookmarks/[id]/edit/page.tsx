import { updateBookmark } from '@/app/dashboard/actions'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default async function EditBookmarkPage({
  params
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: bookmark } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!bookmark) {
    redirect('/dashboard')
  }

  // We bind the ID to the server action to pass it along
  const updateBookmarkWithId = updateBookmark.bind(null, bookmark.id)

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition mb-4"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Edit Bookmark</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <form action={updateBookmarkWithId} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={bookmark.title}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-1">
              URL
            </label>
            <input
              type="url"
              name="url"
              id="url"
              defaultValue={bookmark.url}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-blue-500 transition"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex h-6 items-center">
              <input
                id="is_public"
                name="is_public"
                type="checkbox"
                defaultChecked={bookmark.is_public}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
            </div>
            <div className="text-sm">
              <label htmlFor="is_public" className="font-medium text-slate-900">
                Make Public
              </label>
              <p className="text-slate-500">Anyone can see this bookmark on your public profile.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Link 
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition shadow-sm"
            >
              Update Bookmark
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
