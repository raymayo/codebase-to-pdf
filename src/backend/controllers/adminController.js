import Admin from "../models/Admin.js";

export const createAdmin = async (req, res) => {
    try {
        const { username, password, email, phone, role } = req.body;

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const newAdmin = new Admin({ username, password, email, phone, role });
        await newAdmin.save();

        res.status(201).json({ message: "Admin created successfully" });
    } catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const admin = await Admin.findOne({ username });

        if (!admin || admin.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json({
            username: admin.username,
            role: admin.role,
        });
    } catch (error) {
        console.error("Error logging in admin:", error.message);
        res.status(500).json({ message: "Server error during login" });
    }
};


export const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        console.error("Error fetching admins:", error.message);
        res.status(500).json({ message: "Server error while fetching admins" });
    }
}

