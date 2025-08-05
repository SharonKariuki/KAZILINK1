const express = require("express");
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
    getJobsByEmployer,
} = require("../controllers/jobController");

// Define routes
router.post("/", createJob);
router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);
router.get('/employer/:employerId', getJobsByEmployer);


module.exports = router;
