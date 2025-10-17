import Exam from "../models/Exam.js";
import ActivityLog from "../models/ActivityLog.js";
// import other models as needed

const MODELS = { Exam, ActivityLog /*, User, Attempt, ...*/ };

export async function exportJson(req, res) {
    // Optional auth/role check here
    const payload = {};
    for (const [name, Model] of Object.entries(MODELS)) {
        const docs = await Model.find({}).lean();
        payload[name] = docs;
    }

    const filename = `backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(payload, null, 2));
}

export async function importJson(req, res) {
    // Expect a JSON body with { Exam: [...], ActivityLog: [...], ... }
    // Optional: dryRun
    const { dryRun } = req.query;
    const body = req.body;

    if (!body || typeof body !== "object") {
        return res.status(400).json({ error: "Invalid JSON payload" });
    }

    const results = {};
    for (const [name, arr] of Object.entries(body)) {
        if (!Array.isArray(arr)) continue;
        const Model = MODELS[name];
        if (!Model) continue;

        if (dryRun === "true") {
            results[name] = { wouldInsert: arr.length };
            continue;
        }

        // Simple strategy: clear collection then insert (or write an upsert map by _id)
        await Model.deleteMany({});
        // Preserve _id if present
        const prepared = arr.map(d => {
            const { _id, ...rest } = d;
            return _id ? { _id, ...rest } : rest;
        });
        // Bulk insert
        await Model.insertMany(prepared, { ordered: false });
        results[name] = { inserted: prepared.length };
    }

    res.json({ ok: true, results });
}
