import mongoose from "mongoose";

const PsgcSchema = new mongoose.Schema(
    {
        region: { type: String, required: true, trim: true },
        province: { type: String, required: true, trim: true },
        municipality: { type: String, required: true, trim: true },
        brgy: { type: String, required: true, trim: true },
    },
    { collection: "psgc" }
);

PsgcSchema.index({ region: 1 });
PsgcSchema.index({ region: 1, province: 1 });
PsgcSchema.index({ region: 1, province: 1, municipality: 1 });
PsgcSchema.index({ region: 1, province: 1, municipality: 1, brgy: 1 });

export default mongoose.model("Psgc", PsgcSchema);
