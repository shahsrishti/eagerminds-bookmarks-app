import { logout } from '@/app/auth/actions'
import { createClient } from '@/utils/supabase/server'
import { LogOut, LayoutDashboard, Settings } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let handle = 'user'
  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('handle')
      .eq('id', user.id)
      .single()
    if (userData?.handle) {
      handle = userData.handle
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <Link href="/dashboard" className="text-xl font-bold tracking-tight text-slate-900">
            Eagerminds
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 bg-slate-100 text-slate-900 rounded-lg font-medium">
            <LayoutDashboard size={18} />
            Bookmarks
          </Link>
          <Link href={`/${handle}`} target="_blank" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
            <Settings size={18} />
            Public Profile
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="px-3 mb-4">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.email}</p>
            <p className="text-xs text-slate-500 truncate">@{handle}</p>
          </div>
          <form action={logout}>
            <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors">
              <LogOut size={18} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
