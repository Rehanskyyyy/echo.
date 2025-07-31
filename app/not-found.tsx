import Link from 'next/link'
import { Ghost } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center text-white px-4 text-center overflow-hidden">
      {/* 🔮 Echo Gradient Background */}
      <div className="absolute inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />

      <Ghost className="h-20 w-20 text-zinc-300 mb-6" />
      <h2 className="text-3xl text-purple-300 mb-2">Oops! Page not found.</h2>
      <p className="text-zinc-400 mb-6">The page you’re looking for doesn’t exist or has been moved.</p>
      <Link
        href="/"
        className="bg-purple-600 hover:bg-purple-700 transition-colors px-5 py-2 rounded-lg text-white shadow-lg cursor-default"
      >
        Head back & Hit play
      </Link>
    </div>
  )
}
