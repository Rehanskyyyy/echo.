import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from "next-auth/providers/github"
import { connectToDB } from "@/lib/mongodb"
import User from "@/models/User"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: any }) {
      try {
        await connectToDB()

        const existingUser = await User.findOne({ email: user.email })
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
          })
        }

        return true
      } catch (err) {
        console.log("SignIn Error: ", err)
        return false
      }
    },
    async session({ session }: { session: any }) {
      // attach MongoDB _id to session.user
      await connectToDB()
      const dbUser = await User.findOne({ email: session.user.email })
      session.user.id = dbUser._id.toString()
      return session
    }
  },
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
