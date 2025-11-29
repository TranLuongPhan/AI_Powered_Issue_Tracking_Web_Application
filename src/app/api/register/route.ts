import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        // Create a default team for the new user
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

        // Create a default project for the new user
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

        return NextResponse.json(
            { message: "User created successfully", user: { id: user.id, email: user.email, name: user.name } },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: error?.message || "Internal server error" },
            { status: 500 }
        );
    }
}
