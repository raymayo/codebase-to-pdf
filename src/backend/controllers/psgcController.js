import Psgc from "../models/Psgc.js";

/** utilities */
const toRegex = (q) => (q ? new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") : null);
const sortStrings = (arr) =>
    arr.sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base", numeric: true }));

/** GET /api/psgc/regions?q=&limit= */
export const getRegions = async (req, res) => {
    try {
        const q = toRegex(req.query.q || "");
        const limit = Math.min(parseInt(req.query.limit || "50", 10), 500);
        const filter = {};
        if (q) filter.region = q;

        const values = await Psgc.distinct("region", filter);
        return res.json(sortStrings(values).slice(0, limit));
    } catch (err) {
        console.error("getRegions error:", err);
        res.status(500).json({ error: "Failed to fetch regions" });
    }
};

/** GET /api/psgc/provinces?region=&q=&limit= */
export const getProvinces = async (req, res) => {
    try {
        const { region } = req.query;
        if (!region) return res.status(400).json({ error: "region is required" });

        const q = toRegex(req.query.q || "");
        const limit = Math.min(parseInt(req.query.limit || "50", 10), 500);

        const filter = { region };
        if (q) filter.province = q;

        const values = await Psgc.distinct("province", filter);
        return res.json(sortStrings(values).slice(0, limit));
    } catch (err) {
        console.error("getProvinces error:", err);
        res.status(500).json({ error: "Failed to fetch provinces" });
    }
};

/** GET /api/psgc/municipalities?region=&province=&q=&limit= */
export const getMunicipalities = async (req, res) => {
    try {
        const { region, province } = req.query;
        if (!region || !province)
            return res.status(400).json({ error: "region and province are required" });

        const q = toRegex(req.query.q || "");
        const limit = Math.min(parseInt(req.query.limit || "50", 10), 500);

        const filter = { region, province };
        if (q) filter.municipality = q;

        const values = await Psgc.distinct("municipality", filter);
        return res.json(sortStrings(values).slice(0, limit));
    } catch (err) {
        console.error("getMunicipalities error:", err);
        res.status(500).json({ error: "Failed to fetch municipalities" });
    }
};

/** GET /api/psgc/barangays?region=&province=&municipality=&q=&limit= */
export const getBarangays = async (req, res) => {
    try {
        const { region, province, municipality } = req.query;
        if (!region || !province || !municipality)
            return res
                .status(400)
                .json({ error: "region, province and municipality are required" });

        const q = toRegex(req.query.q || "");
        const limit = Math.min(parseInt(req.query.limit || "50", 10), 500);

        const filter = { region, province, municipality };
        if (q) filter.brgy = q;

        const values = await Psgc.distinct("brgy", filter);
        return res.json(sortStrings(values).slice(0, limit));
    } catch (err) {
        console.error("getBarangays error:", err);
        res.status(500).json({ error: "Failed to fetch barangays" });
    }
};
