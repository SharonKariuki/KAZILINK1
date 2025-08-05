// app/api/contact/route.js
import { connectToDatabase } from "../../../../lib/mongoose";
import ContactMessage from '../../../models/ContactMessage';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    // Connect to MongoDB
    await coonectToDatabase();

    // Save to DB
    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Contact Form Submission from ${name}`,
      text: `New contact form submission:

Name: ${name}
Email: ${email}

Message:
${message}`,
    });

    return new Response(
      JSON.stringify({ message: 'Message received successfully!' }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: 'Something went wrong.' }),
      { status: 500 }
    );
  }
}
