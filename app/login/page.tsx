import Link from 'next/link'
import { login } from '@/app/auth/actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Please enter your details to sign in.
          </p>
        </div>

        <form className="mt-8 space-y-6" action={login}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-slate-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-slate-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {searchParams?.message && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
              {searchParams.message}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
          >
            Sign in
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link href="/signup" className="font-semibold text-slate-900 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
