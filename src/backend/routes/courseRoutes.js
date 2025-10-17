import express from "express";
import { createCourse, getAllCourses, deleteCourse, editCourse } from "../controllers/courseController.js";

const router = express.Router();

router.get('/', getAllCourses)
router.post('/', createCourse)
router.put("/:id", editCourse)
router.delete("/:id", deleteCourse)




export default router;
