import React, { useEffect, useState } from "react";
import axios from "axios";

const TopPerformers = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/student") // ✅ adjust API endpoint
            .then((res) => {
                const scored = res.data.map((s) => {
                    const totalScore = Object.values(s.examScores || {}).reduce(
                        (sum, val) => sum + val,
                        0
                    );
                    return { ...s, totalScore };
                });

                const sorted = scored
                    .sort((a, b) => b.totalScore - a.totalScore)
                    .slice(0, 5); // ✅ Top 5 performers

                setStudents(sorted);
            })
            .catch((err) => console.error("Failed to fetch students:", err));
    }, []);

    return (
        <div className="w-full border border-zinc-200 bg-white shadow rounded-lg p-4 overflow-y-auto row-span-2">
            <h2 className="text-xl font-semibold text-center">
                Top Entrance Exam Performers
            </h2>
            <div className="w-full p-6">

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-sm">
                            <th className="font-medium  ">Rank</th>
                            <th className="font-medium  ">Student</th>
                            <th className="font-medium  ">Chosen Course</th>
                            <th className="font-medium text-right">Total Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((s, idx) => (
                            <tr key={s._id} className="border-b border-zinc-200 hover:bg-gray-50 ">
                                <td className="font-base text-sm text-left p-2">{idx + 1}</td>
                                <td className="font-base text-sm text-left p-2">{s.name}</td>
                                <td className="font-base text-sm text-left p-2">{s.course1st}</td>
                                <td className="font-base text-sm text-right p-2">
                                    {s.totalScore} pts
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopPerformers;
