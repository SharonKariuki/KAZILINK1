import express from "express";
import multer from "multer";
import Worker from "../models/workerModel.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST /api/workers
router.post(
  "/",
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "idFront", maxCount: 1 },
    { name: "idBack", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        dob,
        gender,
        street,
        city,
        state,
        zip,
        country,
        occupation,
        experience,
        education,
        degree,
        field,
        completionYear,
        hasCert,
        certificationName,
        issuingOrg,
        certificationDate,
        criminalRecord,
        explanation,
        confirmInfo,
        consent,
      } = req.body;

      const skills = [];
      for (let key in req.body) {
        if (key.startsWith("skills[")) {
          skills.push(req.body[key]);
        }
      }

      const newWorker = new Worker({
        name: `${firstName} ${lastName}`,
        email,
        phone,
        dob,
        gender,
        address: {
          street,
          city,
          state,
          zip,
          country,
        },
        occupation,
        experience: Number(experience || 0),
        skills,
        education: {
          institution: education,
          degree,
          field,
          completionYear,
        },
        certifications:
          hasCert === "true"
            ? {
                name: certificationName,
                issuingOrg,
                date: certificationDate,
                file: req.files["certificate"]
                  ? req.files["certificate"][0].filename
                  : null,
              }
            : null,
        criminalRecord,
        explanation,
        confirmInfo: confirmInfo === "true",
        consent: consent === "true",
        files: {
          cv: req.files["cv"] ? req.files["cv"][0].filename : null,
          idFront: req.files["idFront"]
            ? req.files["idFront"][0].filename
            : null,
          idBack: req.files["idBack"]
            ? req.files["idBack"][0].filename
            : null,
        },
      });

      const savedWorker = await newWorker.save();
      res.status(201).json(savedWorker);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
);

// NEW: GET /api/workers/me
router.get("/me", async (req, res) => {
  try {
    // For now, just fetch the first worker in the DB
    const worker = await Worker.findOne();

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.json(worker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
