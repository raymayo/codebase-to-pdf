import Student from '../models/Student.js';
import Counter from '../models/Counter.js';
import crypto from 'crypto';




// Helper function to generate a registration number
const generateRegNo = async () => {
    let counter = await Counter.findOneAndUpdate(
        { name: 'registration' }, // Ensure it matches existing document
        { $inc: { value: 1 } }, // Increment the counter
        { new: true, upsert: true } // Return updated document, create if missing
    );

    return `reg-${counter.value}`;
};



// Helper function to generate a random password
const generatePassword = () => crypto.randomBytes(4).toString('hex');

// Main function to create a student
export const createStudent = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const studentData = { ...req.body };

        // Generate a unique registration number
        studentData.regNo = await generateRegNo();

        if (!studentData.regNo) {
            throw new Error("Failed to generate a unique registration number");
        }

        // Generate a password if not provided
        studentData.password = generatePassword()

        const student = new Student(studentData);
        console.log('Student object before saving:', student);

        const savedStudent = await student.save();
        console.log('Student saved:', savedStudent);

        res.status(201).json(savedStudent);
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ error: error.message });
    }
};






// Get all students
export const getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get a single student by ID
export const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: "Student not found" });
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a student by ID
export const updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!student) return res.status(404).json({ error: "Student not found" });
        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a student by ID
export const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ error: "Student not found" });
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

