import { createClient } from '@/utils/supabase/server'
import { deleteBookmark } from './actions'
import Link from 'next/link'
import { Plus, Globe, Lock, ExternalLink, Edit2 } from 'lucide-react'
import { DeleteBookmarkButton } from './DeleteBookmarkButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null // Handled by middleware
  }

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Bookmarks</h1>
          <p className="mt-2 text-slate-600">Manage and organize your saved links.</p>
        </div>
        <Link 
          href="/dashboard/bookmarks/new"
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition"
        >
          <Plus size={18} />
          Add Bookmark
        </Link>
      </div>

      {!bookmarks || bookmarks.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 border-dashed">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-4">
            <Globe size={24} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No bookmarks yet</h3>
          <p className="mt-1 text-slate-500 mb-6">Get started by saving your first link.</p>
          <Link 
            href="/dashboard/bookmarks/new"
            className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition"
          >
            <Plus size={18} />
            Add Bookmark
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <div key={bookmark.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {bookmark.is_public ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200/50">
                      <Globe size={12} />
                      Public
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full border border-slate-200">
                      <Lock size={12} />
                      Private
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Link 
                    href={`/dashboard/bookmarks/${bookmark.id}/edit`}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                  >
                    <Edit2 size={16} />
                  </Link>
                  <DeleteBookmarkButton id={bookmark.id} />
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 line-clamp-1 mb-1">
                {bookmark.title}
              </h3>
              <a 
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition line-clamp-1 group"
              >
                {bookmark.url}
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
