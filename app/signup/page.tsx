"use client"

import React, { useEffect, useState } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Particles from "../Particles/Particles"

const Signup = () => {
  const { data: session } = useSession()
  const router = useRouter()

  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      router.replace('/') // clear history
    }
  }, [session])

  const handleSignIn = (provider: string) => {
    setLoadingProvider(provider)
    signIn(provider)
  }

  return (
    <>
      {/* Particle Background */}
      <div className="fixed inset-0 z-[-1] bg-black">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={250}
          particleSpread={15}
          speed={0.1}
          particleBaseSize={200}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Page Content */}
      <div className="relative z-10 h-[100dvh] w-screen flex flex-col">
        {/* Top-left echo */}
        <h1 className="absolute top-6 left-6 text-5xl text-white tracking-tight">echo.</h1>

        {/* Centered signup content */}
        <div className="flex-1 flex flex-col">
          {/* Content Section */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-white text-4xl mb-5">Sign Up</p>
            <div className="space-y-4">

              {/* Google Sign In */}
              <button
                onClick={() => handleSignIn("google")}
                disabled={loadingProvider === "google"}
                className="flex items-center justify-center w-64 gap-3 px-4 py-2 bg-white text-black rounded-full shadow hover:shadow-md transition disabled:opacity-50"
              >
                {loadingProvider === "google" ? (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
                )}
                {loadingProvider === "google" ? "Signing in..." : "Continue with Google"}
              </button>

              {/* GitHub Sign In */}
              <button
                onClick={() => handleSignIn("github")}
                disabled={loadingProvider === "github"}
                className="flex items-center justify-center w-64 gap-3 px-4 py-2 bg-white text-black rounded-full shadow hover:shadow-md transition disabled:opacity-50"
              >
                {loadingProvider === "github" ? (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <img src="/github-icon.svg" alt="GitHub" className="w-5 h-5 invert" />
                )}
                {loadingProvider === "github" ? "Signing in..." : "Continue with GitHub"}
              </button>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="flex justify-center items-end px-4">
            <footer className="mt-auto w-full sm:w-auto bg-white text-zinc-800 px-7 py-1 rounded-full mb-4 text-center sm:text-base">
              © echo. | You're lookin' at <a target="_blank" href="https://x.com/Rehanskyyyy" className="underline">Rehan's</a> work
            </footer>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup
