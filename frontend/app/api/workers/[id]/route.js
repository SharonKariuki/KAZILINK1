// app/api/workers/[id]/route.js

import { NextResponse } from 'next/server';

// fake DB
const workers = [
  {
    id: '1',
    name: 'Jane Doe',
    title: 'Plumber',
    location: 'Nairobi',
    bio: 'Experienced plumber with 10+ years fixing pipes.',
    email: 'jane@example.com',
    phone: '0712345678',
    category: 'Plumbing',
    availability: 'Available',
    rate: 1500,
    skills: ['Pipe fitting', 'Leak repair', 'Soldering'],
    experiences: [
      {
        title: 'Senior Plumber',
        company: 'AquaFix Ltd',
        location: 'Nairobi',
        duration: '2018 - Present',
        description: 'Responsible for major plumbing projects.'
      }
    ]
  },
  // Add more workers if you like
];

export async function GET(request, { params }) {
  const { id } = params;

  const worker = workers.find(w => w.id === id);

  if (!worker) {
    return NextResponse.json({ message: 'Worker not found' }, { status: 404 });
  }

  return NextResponse.json(worker);
}
