// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('job-platform');

// Create a new document in the collection.
db.applicants.insertOne({
  _id: ObjectId("686273834fbbe47fcd86bf42"),
  jobId: ObjectId("686272f54fbbe47fcd86bf30"),
  firstName: "Sara",
  lastName: "Smith",
  email: "sara.smith@example.com",
  phone: "+15554443333",
  resumeUrl: "https://example.com/resumes/sara_smith.pdf",
  coverLetter: "I am passionate about frontend development and eager to join your team.",
  appliedAt: ISODate("2025-07-01T12:00:00Z")
})

