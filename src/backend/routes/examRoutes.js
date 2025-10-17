import express from "express";
import {
    createExam, getAllExam, getExam, updateExam, deleteExam, getExamByTitle
} from "../controllers/examController.js";


const router = express.Router();

router.post("/", createExam);
router.get("/", getAllExam)
router.get("/title/:title", getExamByTitle);
router.get("/:id", getExam);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);


export default router;
