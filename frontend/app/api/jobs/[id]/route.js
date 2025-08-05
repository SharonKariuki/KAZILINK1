import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongoose';
import Job from '../../../../models/Job';

// GET /api/jobs/:id
export async function GET(req, { params }) {
  try {
    await connectDB();

    const job = await Job.findById(params.id);

    if (!job) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/jobs/:id
export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const body = await req.json();

    const job = await Job.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true
    });

    if (!job) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/:id
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const job = await Job.findByIdAndDelete(params.id);

    if (!job) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Job deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
