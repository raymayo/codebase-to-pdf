import React, { useState, useEffect } from "react";
import axios from "axios";
import { CookingPot } from "lucide-react";
import toast from "react-hot-toast";

// Reusable Question Block
const QuestionForm = ({ q, index, onChange, onChoiceChange, onRemove }) => (
    <div className="relative space-y-3 rounded border border-gray-200 p-4">
        <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-2 right-2 text-sm text-red-600 hover:underline"
        >
            Remove
        </button>

        <div>
            <label className="mb-1 flex flex-col gap-1 text-sm font-medium">
                Question {index + 1}
            </label>
            <input
                className="w-full rounded-md border border-zinc-200 p-2 text-base shadow-2xs"
                value={q.questionText}
                onChange={(e) => onChange(index, "questionText", e.target.value)}
                required
            />
        </div>

        <div className="grid grid-cols-2 gap-2">
            {q.choices.map((choice, cIndex) => (
                <input
                    key={cIndex}
                    className="rounded-md border border-zinc-200 p-2 text-base shadow-2xs"
                    value={choice}
                    placeholder={`Choice ${cIndex + 1}`}
                    onChange={(e) => onChoiceChange(index, cIndex, e.target.value)}
                    required
                />
            ))}
        </div>

        <div>
            <label className="mb-1 flex flex-col gap-1 text-sm font-medium">
                Correct Answer
            </label>
            <select
                className="rounded-md border border-zinc-200 p-2 text-base shadow-2xs"
                value={q.correctAnswer}
                onChange={(e) => onChange(index, "correctAnswer", e.target.value)}
            >
                {q.choices.map((_, i) => (
                    <option key={i} value={i}>
                        Choice {i + 1}
                    </option>
                ))}
            </select>
        </div>
    </div>
);

const EditExamModal = ({ examId, isOpen, onClose, onUpdated }) => {
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch exam data
    useEffect(() => {
        if (!examId || !isOpen) return;

        const fetchExam = async () => {
            try {
                console.log('open')
                setLoading(true);
                const res = await axios.get(`http://localhost:5000/api/exams/${examId}`);
                console.log(res.data)
                setTitle(res.data.title);
                setQuestions(res.data.questions || []);
            } catch (err) {
                setError("Failed to fetch exam data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [examId, isOpen]);

    // Helpers
    const updateQuestions = (updater) => setQuestions((prev) => [...updater(prev)]);

    const handleQuestionChange = (index, field, value) => {
        updateQuestions((prev) => {
            const updated = [...prev];
            if (field === "questionText") updated[index].questionText = value;
            if (field === "correctAnswer") updated[index].correctAnswer = parseInt(value);
            return updated;
        });
    };

    const handleChoiceChange = (qIndex, cIndex, value) => {
        updateQuestions((prev) => {
            const updated = [...prev];
            updated[qIndex].choices[cIndex] = value;
            return updated;
        });
    };

    const addQuestion = () => {
        setQuestions((prev) => [
            ...prev,
            { questionText: "", choices: ["", "", "", ""], correctAnswer: 0 },
        ]);
    };

    const removeQuestion = (index) => {
        setQuestions((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await axios.put(`http://localhost:5000/api/exams/${examId}`, {
                title,
                questions,
            });
            toast.success("Exam updated successfully");
            onUpdated?.();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update exam");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className=" w-full max-w-full h-full bg-white p-6 shadow-lg flex flex-col justtify-between">

<div className="flex justify-between items-center w-full">

                <h1 className="mb-6 text-2xl font-bold text-gray-800">Edit Exam </h1>
                <button
                    type="button"
                    onClick={addQuestion}
                    className="cursor-pointer rounded border border-zinc-200 bg-white px-4 py-2 text-sm text-black shadow-2xs transition-all duration-300 hover:bg-zinc-100"
                    >
                    + Add Question
                </button>
                    </div>
                <form onSubmit={handleSubmit} id="examUpdateForm" className="space-y-6 overflow-y-auto h-full">
                    <div>
                        <label className="mb-1 flex flex-col gap-1 text-sm font-medium">Title</label>
                        <input
                            className="w-full rounded-md border border-zinc-200 p-2 text-base shadow-2xs"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {questions.map((q, index) => (
                        <QuestionForm
                            key={index}
                            q={q}
                            index={index}
                            onChange={handleQuestionChange}
                            onChoiceChange={handleChoiceChange}
                            onRemove={removeQuestion}
                        />
                    ))}

                  

                    {error && <p className="text-sm text-red-600">{error}</p>}

                </form>
                <div className="flex justify-end gap-3 pt-4">
               
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded border border-zinc-200 bg-white px-4 py-2 text-sm shadow hover:bg-zinc-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="examUpdateForm"
                        disabled={loading}
                        className="rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
                    >
                        {loading ? "Updating..." : "Update Exam"}
                    </button>
                </div>
            </div>

           
        </div>
    );
};

export default EditExamModal;
