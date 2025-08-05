import { connectToDatabase } from "../../../lib/mongoose";
import KYC from "../../../models/KYC";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const kycData = await KYC.find();

    return NextResponse.json(kycData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch KYC data", error: error.message },
      { status: 500 }
    );
  }
}
