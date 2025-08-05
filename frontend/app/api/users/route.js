import { connectToDatabase } from '../../../lib/mongoose'
import User from '../../../models/User'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectToDatabase()

    const users = await User.find()

    return NextResponse.json(users)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users', error: error.message },
      { status: 500 }
    )
  }
}
