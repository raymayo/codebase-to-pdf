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
} from "recharts";

import { PieChart, Pie, Cell } from "recharts";

// Function to group scores into ranges
function groupScores(scores, step = 10) {
  const bins = [];

  // Determine max score to know how many bins we need
  const maxScore = Math.max(...scores);
  const binCount = Math.ceil(maxScore / step);

  for (let i = 0; i < binCount; i++) {
    const min = i * step;
    const max = min + step;
    const label = `${min}-${max}`;
    const count = scores.filter((score) => score >= min && score <= max).length;
    bins.push({ range: label, students: count });
  }

  return bins;
}

// Example student scores
const studentScores = [
  5, 12, 18, 22, 29, 29, 29, 35, 35, 35, 37, 42, 42, 42, 42, 42, 42, 48, 51, 51,
  51, 51, 56, 61, 61, 61, 73, 77, 85, 5, 12, 18, 22, 29, 29, 29, 35, 35, 35, 37, 42, 42, 42, 42, 42, 42, 48, 51, 51,
  51, 51, 56, 61, 61, 61, 73, 77, 85, 5, 12, 18, 22, 29, 29, 29, 35, 35, 35, 37, 42, 42, 42, 42, 42, 42, 48, 51, 51,
  51, 51, 56, 61, 61, 61, 73, 77, 85, 5, 12, 18, 22, 29, 29, 29, 35, 35, 35, 37, 42, 42, 42, 42, 42, 42, 48, 51, 51,
  51, 51, 56, 61, 61, 61, 73, 77, 85, 5, 12, 18, 22, 29, 29, 29, 35, 35, 35, 37, 42, 42, 42, 42, 42, 42, 48, 51, 51,
  51, 51, 56, 61, 61, 61, 73, 77, 85, 5, 12, 18, 22, 29, 29, 29, 35, 35, 35, 37, 42, 42, 42, 42, 42, 42, 48, 51, 51,
  51, 51, 56, 61, 61, 61, 73, 77, 85, 5, 12, 18, 22, 29, 29, 29, 35, 35, 35, 37, 42, 42, 42, 42, 42, 42, 48, 51, 51,
  51, 51, 56, 61, 61, 61, 73, 77, 85, 5, 12, 18, 22, 29, 29, 29, 35, 35
];
const gradeData = groupScores(studentScores, 10);

function CustomTooltip({ payload, active }) {
  if (active) {
    return (
      <div className="custom-tooltip px-3 py-1 border border-zinc-200 rounded-lg bg-white shadow-xl text-sm font-mono text-zinc-700 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className="bg-blue-400 w-3 h-3 rounded"></div>
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


export default function FinalGradeChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={gradeData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid horizontal={true} vertical={false} stroke="#e4e4e7" />
        <XAxis
          dataKey="range"
          axisLine={false}
          tickLine={false}
          // underlinePosition={20}
          label={{
            value: "Score Range", position: "insideBottom", offset: -15,
            style: { fontFamily: "Inter", fill: "black" }
          }}
        />
        {/* <YAxis
          label={{
            value: "Number of Students",
            angle: -90,
            position: "insideLeft",
          }}
          tickLine={false}
          axisLine={false}
        /> */}
        <Tooltip content={<CustomTooltip />} cursor={false} />
        {/* <Legend /> */}
        <Bar dataKey="students" fill="#2B7FFF" radius={[6, 6, 6, 6]}
          activeBar={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
