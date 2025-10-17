import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewExamModal = ({ examId, isOpen, onClose }) => {
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch exam data when opened
    useEffect(() => {
        if (!examId || !isOpen) return;

        const fetchExam = async () => {
            try {
                setLoading(true);
                setError("");
                const res = await axios.get(`http://localhost:5000/api/exams/${examId}`);
                setExam(res.data);
            } catch (err) {
                setError("Failed to load exam details");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [examId, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-full h-full overflow-hidden rounded-md bg-white shadow-lg flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center border-b px-6 py-4">
                    <h1 className="text-xl font-bold text-gray-800">
                        {exam ? exam.title : "Loading..."}
                    </h1>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
                    >
                        Close
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                    {loading && <p>Loading exam...</p>}
                    {error && <p className="text-red-600">{error}</p>}

                    {exam?.questions?.length > 0 ? (
                        exam.questions.map((q, index) => (
                            <div
                                key={index}
                                className="rounded border border-zinc-200 p-4 space-y-3"
                            >
                                <h2 className="font-medium">
                                    {index + 1}. {q.questionText}
                                </h2>
                                <div className="grid grid-cols-2 gap-2">
                                    {q.choices.map((choice, cIndex) => (
                                        <div
                                            key={cIndex}
                                            className={`rounded-md border px-3 py-2 text-sm ${cIndex === q.correctAnswer
                                                    ? "border-green-600 bg-green-50 text-green-800 font-medium"
                                                    : "border-zinc-200 bg-zinc-50"
                                                }`}
                                        >
                                            {choice}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        !loading && <p>No questions available.</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t px-6 py-4">
                    {/* <button
                        type="button"
                        onClick={onClose}
                        className="rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
                    >
                        Close
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default ViewExamModal;
