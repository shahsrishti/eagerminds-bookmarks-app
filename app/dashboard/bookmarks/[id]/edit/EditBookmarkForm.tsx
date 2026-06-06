'use client'

import { updateBookmark } from '@/app/dashboard/actions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export function EditBookmarkForm({ bookmark }: { bookmark: any }) {
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    try {
      const res = await updateBookmark(bookmark.id, formData)
      if (res?.success) {
        toast.success('Bookmark updated successfully!')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('Failed to update bookmark')
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
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
  )
}
