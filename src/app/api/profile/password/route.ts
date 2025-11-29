import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Please login to use the service" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    // Validate new password
    if (!newPassword || newPassword.length < 6 || newPassword.length > 100) {
      return NextResponse.json({ message: "New password must be between 6 and 100 characters" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if user has a password (not OAuth-only)
    if (!user.password) {
      return NextResponse.json({ message: "Password change is not available for OAuth-only users" }, { status: 403 });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      }
    });

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ 
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined
    }, { status: 500 });
  }
}

