import express from "express";
import { searchCollege, searchSchool } from "../controllers/schoolController.js";

const router = express.Router();

// Route to search colleges based on query
router.get("/", searchSchool);
router.get("/college", searchCollege);

export default router;
