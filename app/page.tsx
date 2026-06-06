import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50 text-slate-900">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-slate-900">
          Eagerminds Bookmarks
        </h1>
        <p className="text-xl text-slate-600">
          A secure, minimal, and beautiful place to store and share your favorite bookmarks.
        </p>
        
        <div className="flex gap-4 justify-center pt-8">
          <Link 
            href="/login" 
            className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition"
          >
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition"
          >
            Sign up
          </Link>
        </div>
      </div>
    </main>
  )
}
