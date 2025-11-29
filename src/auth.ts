import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

import Google from "next-auth/providers/google"

export const config = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Hardcoded developer account (bypass database)
        if (credentials.email === "litmerscontest2911@gmail.com" && credentials.password === "litmers123") {
          return {
            id: "dev-account-id",
            email: "litmerscontest2911@gmail.com",
            name: "Litmers Contest",
            image: null,
          }
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  events: {
    createUser: async ({ user }) => {
      if (!user.id) return;

      // Create a default team
      const team = await prisma.team.create({
        data: {
          name: "Personal Team",
          ownerId: user.id,
          members: {
            create: {
              userId: user.id,
              role: "OWNER"
            }
          }
        }
      });

      // Create a default project
      const project = await prisma.project.create({
        data: {
          name: "My Project",
          description: "Your first project",
          teamId: team.id,
          ownerId: user.id,
        }
      });

      // Create sample issues for new users
      const sampleIssues = [
        {
          title: "Implement user authentication",
          description: "Add login and signup functionality",
          status: "Done",
          priority: "HIGH",
          projectId: project.id,
          creatorId: user.id,
          assigneeId: user.id,
        },
        {
          title: "Design dashboard UI",
          description: "Create responsive dashboard layout",
          status: "Done",
          priority: "MEDIUM",
          projectId: project.id,
          creatorId: user.id,
          assigneeId: user.id,
        },
        {
          title: "Add issue tracking",
          description: "Implement CRUD operations for issues",
          status: "In Progress",
          priority: "HIGH",
          projectId: project.id,
          creatorId: user.id,
          assigneeId: user.id,
        },
        {
          title: "Setup database schema",
          description: "Create Prisma models and migrations",
          status: "In Progress",
          priority: "MEDIUM",
          projectId: project.id,
          creatorId: user.id,
          assigneeId: user.id,
        },
        {
          title: "Write unit tests",
          description: "Add test coverage for API routes",
          status: "Backlog",
          priority: "LOW",
          projectId: project.id,
          creatorId: user.id,
          assigneeId: user.id,
        },
        {
          title: "Deploy to production",
          description: "Configure Vercel deployment",
          status: "Backlog",
          priority: "MEDIUM",
          projectId: project.id,
          creatorId: user.id,
          assigneeId: user.id,
        },
      ];

      // Create all sample issues
      await prisma.issue.createMany({
        data: sampleIssues,
      });
    }
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    }
  }
})

export const { handlers, auth, signIn, signOut } = config
