const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Optional: secure all routes if desired
// const { protect, isAdmin } = require("../middleware/authMiddleware");
// router.use(protect, isAdmin);

// Admin authentication
router.post("/signin", adminController.adminSignin);

// Dashboard stats
router.get("/stats", adminController.getStats);


// User management
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id", adminController.updateUserStatus);

// KYC management
router.get("/kyc/pending", adminController.getPendingKYC);
router.patch("/kyc/:id", adminController.updateKYCStatus);

// Job post management
router.get("/jobs", adminController.getJobPosts);
router.patch("/jobs/:id", adminController.updateJobStatus);

// Review management
router.get("/reviews", adminController.getReviews);
router.delete("/reviews/:id", adminController.deleteReview);

// Banner management
router.get("/banners", adminController.getBanners);
router.post("/banners", adminController.addBanner);

module.exports = router;
