import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
        action: { type: String, required: true, index: true },         // e.g. "EXAM_ARCHIVE", "ATTEMPT_CREATE"
        resource: { type: String, required: true, index: true },       // e.g. "Exam", "User", "Attempt"
        resourceId: { type: String, index: true },                     // store as string to support non-ObjectId too
        ip: String,
        userAgent: String,
        metadata: mongoose.Schema.Types.Mixed,                         // any extra info
    },
    { timestamps: true }
);

ActivityLogSchema.index({ createdAt: -1 });
export default mongoose.model("ActivityLog", ActivityLogSchema);
