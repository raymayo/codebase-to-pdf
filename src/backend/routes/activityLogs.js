import { Router } from "express";
import ActivityLog from "../models/ActivityLog.js";
const router = Router();

router.get("/", async (req, res) => {
    const { page = 1, limit = 20, userId, action, resource, from, to, q } = req.query;

    const filter = {};
    if (userId) filter.userId = userId;
    if (action) filter.action = action;
    if (resource) filter.resource = resource;
    if (from || to) {
        filter.createdAt = {};
        if (from) filter.createdAt.$gte = new Date(from);
        if (to) filter.createdAt.$lte = new Date(to);
    }
    if (q) {
        // free text: search action/resource/resourceId
        filter.$or = [
            { action: new RegExp(q, "i") },
            { resource: new RegExp(q, "i") },
            { resourceId: new RegExp(q, "i") }
        ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
        ActivityLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
        ActivityLog.countDocuments(filter)
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export default router;
