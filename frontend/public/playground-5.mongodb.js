// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('job-platform');

// Create a new document in the collection.
db.jobViews.insertOne({
  _id: ObjectId("6862745d4fbbe47fcd86bf54"),
  jobId: ObjectId("686272f54fbbe47fcd86bf30"),
  views: 56,
  lastViewedAt: ISODate("2025-07-02T15:20:00Z")
})

