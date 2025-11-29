import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Please login to use the service" }, { status: 401 });
    }

    const { name, profileImage } = await req.json();

    // Validate name
    if (!name || name.length < 1 || name.length > 50) {
      return NextResponse.json({ message: "Name must be between 1 and 50 characters" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name,
        image: profileImage || null,
      }
    });

    return NextResponse.json({ 
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ 
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined
    }, { status: 500 });
  }
}

