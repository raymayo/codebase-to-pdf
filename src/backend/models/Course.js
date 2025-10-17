import mongoose, { Mongoose } from "mongoose";

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        default: ""
    },
    passingScore: {
        type: Number,
        required: true,
        min: 0,
    },
    department: {
        type: String,
        required: true,
        trim: true,
    },
    durationYears: {
        type: String,
        default: "4",
    },

    // Archive fields
    isArchived: { type: Boolean, default: false, index: true },
    archivedAt: { type: Date },
    archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
},
    { timestamps: true }
)

export default mongoose.model("Course", CourseSchema)