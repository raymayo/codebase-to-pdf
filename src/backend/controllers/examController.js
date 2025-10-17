import Exam from '../models/Exam.js';

export const createExam = async (req, res) => {
    try {
        const exam = new Exam(req.body);
        await exam.save();
        res.status(201).json(exam);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getExam = async (req, res) => {
    try{
        const exam = await Exam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        res.status(200).json(exam); 
    }catch (error) {
        res.status(500).json({ message: "Failed to fetch exam", error: error.message });
    }
}


export const getAllExam = async (req, res) => {
    try {
        const exams = await Exam.find();
        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch exams", error: error.message });
    }
}

export const updateExam = async (req, res) => {
    try{
        const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        res.status(200).json(exam);    
    }catch (error) {
        res.status(400).json({ message: "Failed to update exam", error: error.message });
    }
}

export const deleteExam = async (req, res) => {
    try{
        const exam = await Exam.findByIdAndDelete(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        res.status(200).json({ message: "Exam deleted successfully" });
    }catch(error){
        res.status(500).json({ message: "Failed to delete exam", error: error.message });
    }
}


export const getExamByTitle = async (req, res) => {
    try{
        const { title } = req.params;
        const exam = await Exam.findOne({ title: title });
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        res.status(200).json(exam); 
    }catch(error){
        res.status(500).json({ message: "Failed to fetch exam by title", error: error.message });
    }
}