import { connectToDatabase } from "../../../../lib/mongoose";
import Employer from "../../../../models/Employer";
import  Types  from "./mongoose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    await connectToDatabase();

    // Validate ObjectId if using MongoDB _id
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid employer ID." },
        { status: 400 }
      );
    }

    const employer = await Employer.findById(id).lean();

    if (!employer) {
      return NextResponse.json(
        { message: "Employer not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(employer);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching employer.", error: error.message },
      { status: 500 }
    );
  }
}

