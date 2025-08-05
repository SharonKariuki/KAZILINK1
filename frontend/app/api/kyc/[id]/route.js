import { connectToDatabase } from "../../../../Lib/mongoose";
import KYC from "../../../../models/KYC";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  const { id } = params;

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { action } = body;

  if (!action) {
    return NextResponse.json(
      { success: false, message: "Action is required" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    // Find the KYC document by ID
    const kycDoc = await KYC.findById(id);

    if (!kycDoc) {
      return NextResponse.json(
        { success: false, message: "KYC document not found" },
        { status: 404 }
      );
    }

    if (action === "approve") {
      kycDoc.status = "approved";
    } else if (action === "reject") {
      kycDoc.status = "rejected";
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }

    await kycDoc.save();

    return NextResponse.json({
      success: true,
      message: `KYC ${action} successful`,
      kyc: kycDoc,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: `KYC ${action} failed`, error: error.message },
      { status: 500 }
    );
  }
}
