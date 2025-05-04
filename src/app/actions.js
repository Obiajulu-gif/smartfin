"use server";

import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function login(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // Check if user exists and password is correct
    if (!user) {
      return { error: "Invalid email or password" };
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { error: "Invalid email or password" };
    }

    // Set authentication cookie or token
    cookies().set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Authentication failed" };
  }
}

export async function logout() {
  cookies().delete("userId");
  redirect("/login");
}

export async function getSession() {
  const userId = cookies().get("userId")?.value;
  
  if (!userId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    
    return user;
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
}
