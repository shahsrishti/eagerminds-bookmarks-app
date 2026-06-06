import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Globe, ExternalLink, ArrowLeft } from 'lucide-react'

export default async function PublicProfilePage({
  params
}: {
  params: Promise<{ handle: string }>
}) {
  const resolvedParams = await params;
  const supabase = await createClient()
  
  // Find user by handle
  const { data: userProfile } = await supabase
    .from('users')
    .select('id, handle')
    .eq('handle', resolvedParams.handle)
    .single()

  if (!userProfile) {
    notFound()
  }

  // Fetch their PUBLIC bookmarks
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userProfile.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-slate-900 transition">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                {userProfile.handle.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">
                  @{userProfile.handle}
                </h1>
                <p className="text-sm text-slate-500">Public Bookmarks</p>
              </div>
            </div>
          </div>
          <Link 
            href="/signup" 
            className="text-sm font-medium text-white bg-slate-900 px-4 py-2 rounded-full hover:bg-slate-800 transition shadow-sm"
          >
            Create your own
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {!bookmarks || bookmarks.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 text-slate-500 mb-6 shadow-inner">
              <Globe size={32} />
            </div>
            <h3 className="text-xl font-medium text-slate-900">No public bookmarks</h3>
            <p className="mt-2 text-slate-500">
              @{userProfile.handle} hasn't shared any bookmarks publicly yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
              <a 
                key={bookmark.id}
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-blue-200 transition relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ExternalLink size={14} />
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-slate-900 line-clamp-2 mb-2 pr-8 group-hover:text-blue-700 transition-colors">
                  {bookmark.title}
                </h3>
                <p className="text-sm text-slate-500 mt-auto line-clamp-1 truncate bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors">
                  {new URL(bookmark.url).hostname.replace('www.', '')}
                </p>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
