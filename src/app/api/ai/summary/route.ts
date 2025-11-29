import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Please login to use the service" }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not configured");
      return NextResponse.json({ message: "OpenAI API key not configured" }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get all issues for the user's projects
    const issues = await prisma.issue.findMany({
      where: {
        project: {
          ownerId: user.id
        },
        deletedAt: null // Only get non-deleted issues
      },
      include: {
        project: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (issues.length === 0) {
      return NextResponse.json({ 
        summary: "You don't have any issues yet. Create some issues to get an AI summary!" 
      });
    }

    // Calculate statistics
    const totalIssues = issues.length;
    const highPriorityIssues = issues.filter(i => i.priority === "HIGH");
    const inProgressIssues = issues.filter(i => i.status === "In Progress");
    const doneIssues = issues.filter(i => i.status === "Done");
    const backlogIssues = issues.filter(i => i.status === "Backlog");

    // Format high-priority issues for emphasis
    const highPriorityText = highPriorityIssues.length > 0
      ? highPriorityIssues.map((issue, idx) => 
          `${idx + 1}. [${issue.status}] ${issue.title}${issue.description ? ` - ${issue.description}` : ''}`
        ).join('\n')
      : "None";

    // Format all issues for the AI prompt
    const issuesText = issues.map((issue, idx) => 
      `${idx + 1}. [${issue.status}] ${issue.title} (Priority: ${issue.priority})${issue.description ? ` - ${issue.description}` : ''}`
    ).join('\n');

    const prompt = `You are a project management assistant. Analyze the following project data and provide a concise, actionable summary.

PROJECT STATISTICS:
- Total Issues: ${totalIssues}
- High Priority Issues: ${highPriorityIssues.length}
- In Progress: ${inProgressIssues.length}
- Done: ${doneIssues.length}
- Backlog: ${backlogIssues.length}

HIGH PRIORITY ISSUES (These should be solved first):
${highPriorityText}

ALL ISSUES:
${issuesText}

Please provide a summary that:
1. States the total number of issues created (${totalIssues})
2. Highlights which HIGH priority issues need to be solved (list them if any)
3. Provides overall project status and recommendations

Format your response in 3-4 clear sentences:`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful project management assistant that provides concise, actionable summaries." },
          { role: "user", content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      const summary = completion.choices[0]?.message?.content || "Unable to generate summary.";

      return NextResponse.json({ summary });
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);
      return NextResponse.json({ 
        message: "Failed to generate summary from AI service",
        error: openaiError instanceof Error ? openaiError.message : "Unknown OpenAI error"
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error generating AI summary:", error);
    return NextResponse.json({ 
      message: "Failed to generate summary",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

