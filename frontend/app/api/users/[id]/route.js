import { connectToDatabase } from '../../../../lib/mongoose';
import User from '../../../../models/User';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  const { id } = params;
  const { action, updates } = await request.json();

  try {
    await connectToDatabase();

    let updatedUser;

    if (action === 'update') {
      updatedUser = await User.findByIdAndUpdate(
        id,
        updates,
        { new: true }
      );
    } else if (action === 'activate') {
      updatedUser = await User.findByIdAndUpdate(
        id,
        { active: true },
        { new: true }
      );
    } else if (action === 'deactivate') {
      updatedUser = await User.findByIdAndUpdate(
        id,
        { active: false },
        { new: true }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'Unknown action.' },
        { status: 400 }
      );
    }

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User ${action} successful`,
      user: updatedUser
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: `User ${action} failed`, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await connectToDatabase();

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'User deletion failed', error: error.message },
      { status: 500 }
    );
  }
}
