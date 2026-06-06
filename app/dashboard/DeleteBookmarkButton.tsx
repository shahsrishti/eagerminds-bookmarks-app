'use client'

import { deleteBookmark } from './actions'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export function DeleteBookmarkButton({ id }: { id: string }) {
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm('Are you sure you want to delete this bookmark?')) {
      return
    }
    try {
      await deleteBookmark(id)
      toast.success('Bookmark deleted!')
      router.refresh()
    } catch {
      toast.error('Failed to delete bookmark')
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
      title="Delete Bookmark"
    >
      <Trash2 size={16} />
    </button>
  )
}
