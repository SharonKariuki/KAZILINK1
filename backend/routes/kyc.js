const express = require("express");
const multer = require("multer");
const kycController = require("../controllers/kycController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/submit",
  upload.fields([
    { name: "selfie", maxCount: 1 },
    { name: "idFront", maxCount: 1 },
    { name: "idBack", maxCount: 1 }
  ]),
  kycController.submitKYC
);

router.get("/documents", kycController.getKYCDocuments);

module.exports = router;
