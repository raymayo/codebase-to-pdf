// Generic archive/unarchive for any Mongoose model with the "archivable" fields
export function buildArchiveController(Model, resourceName) {
    return {
        archive: async (req, res) => {
            const { id } = req.params;
            const doc = await Model.findByIdAndUpdate(
                id,
                {
                    $set: {
                        isArchived: true,
                        archivedAt: new Date(),
                        archivedBy: req.user?._id ?? null
                    }
                },
                { new: true }
            );
            if (!doc) return res.status(404).json({ error: `${resourceName} not found` });
            res.locals.resourceId = id;
            res.locals.metadata = { isArchived: true };
            return res.json({ message: `${resourceName} archived`, data: doc });
        },

        unarchive: async (req, res) => {
            const { id } = req.params;
            const doc = await Model.findByIdAndUpdate(
                id,
                { $set: { isArchived: false }, $unset: { archivedAt: 1, archivedBy: 1 } },
                { new: true }
            );
            if (!doc) return res.status(404).json({ error: `${resourceName} not found` });
            res.locals.resourceId = id;
            res.locals.metadata = { isArchived: false };
            return res.json({ message: `${resourceName} unarchived`, data: doc });
        },

        list: async (req, res) => {
            const { archived } = req.query; // "true" | "false" | undefined
            const filter = {};
            if (archived === "true") filter.isArchived = true;
            if (archived === "false") filter.isArchived = false;

            const { page = 1, limit = 20, q } = req.query;
            if (q) filter.title = { $regex: q, $options: "i" }; // customize per model

            const skip = (Number(page) - 1) * Number(limit);
            const [items, total] = await Promise.all([
                Model.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(Number(limit)),
                Model.countDocuments(filter)
            ]);

            return res.json({
                items, total, page: Number(page), pages: Math.ceil(total / Number(limit))
            });
        }
    };
}
