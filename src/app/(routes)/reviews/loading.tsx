import { Loader2 } from "lucide-react"

export default function ReviewsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
        <p className="text-lg font-medium text-gray-700">Loading amazing reviews...</p>
      </div>
    </div>
  )
}
