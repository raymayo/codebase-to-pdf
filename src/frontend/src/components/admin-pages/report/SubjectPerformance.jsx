import React, { useEffect, useState } from "react";
import axios from "axios";

const SubjectPerformance = () => {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/report/subject-performance")
            .then(res => setStats(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Exam Statistics</h2>
            <table className="w-full border border-zinc-300">
                <thead className="bg-zinc-100">
                    <tr>
                        <th className="p-2 border">Subject</th>
                        <th className="p-2 border">Highest Score</th>
                        <th className="p-2 border">Lowest Score</th>
                        <th className="p-2 border">Average Score</th>
                        {/* <th className="p-2 border">Passing Rate</th> */}
                    </tr>
                </thead>
                <tbody>
                    {stats.map((s, i) => (
                        <tr key={i}>
                            <td className="p-2 border">{s.subject}</td>
                            <td className="p-2 border">{s.highest}</td>
                            <td className="p-2 border">{s.lowest}</td>
                            <td className="p-2 border">{s.average}</td>
                            {/* <td className="p-2 border">{s.passingRate}</td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubjectPerformance;
