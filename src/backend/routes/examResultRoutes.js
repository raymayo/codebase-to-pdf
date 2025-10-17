import express from "express";
import { submitExam } from "../controllers/examResultController.js";

const router = express.Router();

router.post("/", submitExam);


export default router;