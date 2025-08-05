import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongoose';
import Job from '../../../models/Job';

// GET /api/jobs
export async function GET() {
  try {
    await connectDB();

    const jobs = await Job.find();

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/jobs
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const newJob = await Job.create(body);

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
