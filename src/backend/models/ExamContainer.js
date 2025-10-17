import mongoose from "mongoose";

const examContainerSchema = new mongoose.Schema(
    {
        academicYear: { type: String, required: true },
        // e.g., "2025-2026"

        description: { type: String },
        // optional, e.g., "Entrance Exam for freshmen applicants"

        exams: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Exam" }
        ],
        // references to individual subject exams

        isActive: { type: Boolean, default: true },
        // mark current active exam cycle




        // Archive fields
        isArchived: { type: Boolean, default: false, index: true },
        archivedAt: { type: Date },
        archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export default mongoose.model("ExamContainer", examContainerSchema);
