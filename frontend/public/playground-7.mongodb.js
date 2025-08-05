// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('job-platform');

// Create a new document in the collection.
db.messages.insertOne({
  _id: ObjectId("686275214fbbe47fcd86bf66"),
  jobId: ObjectId("686272f54fbbe47fcd86bf30"),
  employerId: ObjectId("686271e04fbbe47fcd86bf17"),
  applicantId: ObjectId("686273834fbbe47fcd86bf42"),
  sender: "employer",
  messageText: "Hi Sara, thanks for applying. When would you be available for an interview?",
  sentAt: ISODate("2025-07-01T13:15:00Z")
})

