// ✅ File: app/api/courses/route.js

import dbConnect from "@/lib/mongoose";
import Course from "@/models/Course";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const courses = await Course.find().sort({ createdAt: -1 });

    return NextResponse.json(courses);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const { title, description, published } = body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Title is required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const course = await Course.create({
      title: title.trim(),
      description: description || "",
      published: published || false,
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create course",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
