import express from "express";
import ExamResult from "../models/ExamResult.js";
import Exam from "../models/Exam.js";
import Student from '../models/Student.js'

export const submitExam = async (req, res) => {
    try {
        const { studentId, examId, answers, subjectId } = req.body;

        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ error: "Exam not found" });

        let score = 0;
        const processedAnswers = answers.map((ans) => {
            const q = exam.questions.id(ans.questionId);

            // Compare selected choice text with the correct answer text in DB
            const correctChoice = q ? q.choices[q.correctAnswer] : null;
            const isCorrect = !!q && ans.selected != null && ans.selected === correctChoice;

            if (isCorrect) score++;
            return { ...ans, isCorrect };
        });

        // Save exam result
        const examResult = new ExamResult({
            studentId,
            examId,
            score,
            answers: processedAnswers,
        });
        await examResult.save();

        // ✅ Update Student
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ error: "Student not found" });

        // Push exam result reference
        student.examResults.push(examResult._id);

        // Update examScores for quick lookup
        student.examScores.set(subjectId, score);

        // Recalculate totalScore
        student.totalScore = Array.from(student.examScores.values()).reduce(
            (acc, val) => acc + val,
            0
        );

        // Update status
        student.status = "Exam Taken";

        await student.save();

        res.status(201).json({
            message: "Exam submitted and student updated successfully",
            examResult,
            student,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit exam" });
    }
}

