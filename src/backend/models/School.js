import mongoose from "mongoose";

const SchoolSchema = new mongoose.Schema(
    {
        schoolId: {
            type: String,
            required: true,
            unique: true,
        },
        region: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            required: true,
        },
        municipality: {
            type: String,
            required: true,
        },

        institutionName: {
            type: String,
            required: true,
        },
        programs: {
            type: [String],
            default: [],
        },
        tvlSpecializations: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

const School = mongoose.models.School || mongoose.model("School", SchoolSchema);

export default School;
