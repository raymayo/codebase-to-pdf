import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

const data = [
  { name: "CSD", value: 143 },
  { name: "HM", value: 342 },
  { name: "TEED", value: 320 },
  { name: "BED", value: 245 },
];

function CustomTooltip({ payload, active }) {
  if (active) {
    return (
      <div className="custom-tooltip px-3 py-1 border border-zinc-200 rounded-lg bg-white shadow-xl text-sm font-mono text-zinc-700 flex items-center gap-2">
        <div className="flex items-center gap-1">
          {/* <div className="bg-blue-400 w-3 h-3 rounded"></div> */}
          <p className="label text-zinc-700">{`Student(s):`}</p>
        </div>
        <p className="label text-base font-medium">{`${payload[0].value}`}</p>
        {/* <p className="intro">{'hello'}</p>
        <p className="desc">Anything you want can be displayed here.</p> */}
      </div>
    );
  }

  return null;
}

const COLORS = ["#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8"];

const HorizontalBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout="vertical" // ✅ horizontal bars
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
      >
        <CartesianGrid horizontal={false} vertical={true} stroke="#e4e4e7" />
        <XAxis type="number" axisLine={false}
          tickLine={false} />
        <YAxis type="category" dataKey="name" />
        <Tooltip content={<CustomTooltip />} cursor={false} />
        <Legend />
        <Bar dataKey="value"
          radius={[6, 6, 6, 6]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HorizontalBarChart;
