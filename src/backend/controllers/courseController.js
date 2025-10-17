import mongoose from "mongoose"
import Course from "../models/Course.js"

// CREATE (you already have this, added better error handling)
export const createCourse = async (req, res) => {
    try {
        const course = new Course(req.body)
        await course.save()
        res.status(201).json(course)
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ message: "Course name must be unique." })
        }
        console.error("createCourse error:", error)
        res.status(400).json({ message: "Failed to create course", error: error.message })
    }
}

// READ ALL (you already have this)
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 })
        res.json(courses)
    } catch (error) {
        console.error("getAllCourses error:", error)
        res.status(500).json({ message: "Failed to fetch courses", error: error.message })
    }
}

// UPDATE
export const editCourse = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid course id" })
        }

        // Only allow editable fields
        const { name, description, passingScore, department, durationYears } = req.body
        const update = { name, description, passingScore, department, durationYears }

        const course = await Course.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true,
            context: "query",
        })

        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        res.json(course)
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ message: "Course name must be unique." })
        }
        console.error("editCourse error:", error)
        res.status(400).json({ message: "Failed to update course", error: error.message })
    }
}

// DELETE
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid course id" })
        }

        const deleted = await Course.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(404).json({ message: "Course not found" })
        }

        res.status(204).send() // No Content
    } catch (error) {
        console.error("deleteCourse error:", error)
        res.status(500).json({ message: "Failed to delete course", error: error.message })
    }
}
