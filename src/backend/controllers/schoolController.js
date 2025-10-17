import College from '../models/College.js';
import School from '../models/School.js';

export const searchSchool = async (req, res) => {
    try {
        const { q } = req.query; // get the search query

        if (!q) {
            return res.status(400).json({ message: "Query parameter 'q' is required" });
        }

        // Case-insensitive partial match on school_name
        const schools = await School.find({
            institutionName: { $regex: q, $options: "i" },
        })
            .limit(20) // limit results for performance
            .select(
                "school_id institutionName region province municipality programs tvl_specializations"
            ); // select only necessary fields

        res.json(schools);
    } catch (error) {
        console.error("Error searching colleges:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const searchCollege = async (req, res) => {
    try {
        const { q } = req.query; // get the search query from query params

        if (!q) {
            return res.status(400).json({ message: "Query parameter 'q' is required" });
        }

        // Case-insensitive partial match on the institution name
        const colleges = await College.find({
            institutionName: { $regex: q, $options: "i" },
        })
            .limit(20) // limit results for performance
            .select("schoolId institutionName region institutionType province municipality"); // select only needed fields

        res.json(colleges);
    } catch (error) {
        console.error("Error searching colleges:", error);
        res.status(500).json({ message: "Server error" });
    }
};

