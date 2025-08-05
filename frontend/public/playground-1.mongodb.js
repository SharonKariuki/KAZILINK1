// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('job-platform');

// Create a new document in the collection.
db.employers.insertOne({
  _id: ObjectId("686271e04fbbe47fcd86bf17"),
  companyName: "Tech Solutions Ltd.",
  email: "contact@techsolutions.com",
  firstName: "Tom",
  lastName: "Thompson",
  phone: "+19876543210",
  createdAt: ISODate("2025-06-30T10:15:00Z")
})

