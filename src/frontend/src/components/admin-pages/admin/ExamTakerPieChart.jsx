import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

const data = [
    { name: "Registered Only", value: 246 },
    { name: "Exam Takers", value: 825 },
];



const COLORS = ["#3b82f6", "#2563eb"];

// Custom Tooltip that includes the slice color
function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        const { name, value, fill } = payload[0].payload; // <- grab fill
        return (
            <div className="custom-tooltip px-3 py-1 border border-zinc-200 rounded-lg bg-white shadow-xl text-sm font-mono text-zinc-700 flex items-center gap-2">
                <div className="flex items-center gap-1">

                    <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: fill }}
                    ></div>
                    <span className="label text-zinc-700">{name}:</span>
                </div>
                <span className="label text-base font-medium">{value}</span>
            </div >
        );
    }
    return null;
}

export default function ExamTakerPieChart() {



    const [examTakers, setExamTakers] = useState([])

    useEffect(() => {
        const fetchExamTakers = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/report");
                if (!response.ok) {
                    throw new Error("Failed to fetch admins");
                }
                const data = await response.json();
                setExamTakers(data);
                console.log(data)
            } catch (error) {
                console.error(error);
            }
        };

        fetchExamTakers();
    }, [])

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
        const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${((percent ?? 1) * 100).toFixed(0)}%`}
            </text>
        );
    };



    return (

        <ResponsiveContainer>
            <PieChart>
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Legend />
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="95%"
                    // label
                    labelLine={false}
                    label={renderCustomizedLabel}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>

    );
}
