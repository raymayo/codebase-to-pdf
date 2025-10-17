import mongoose from "mongoose";

const CollegeSchema = new mongoose.Schema(
    {
        region: {
            type: String,
            required: true,
        },
        institutionName: {
            type: String,
            required: true,
        },
        institutionType: {
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
    },
    { timestamps: true }
);

const College = mongoose.models.College || mongoose.model("College", CollegeSchema);

export default College;
