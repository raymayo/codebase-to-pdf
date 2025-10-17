import React from "react";
import TotalRegisteredStudent from "../admin/TotalRegisteredStudent.jsx";
import LineChartComponent from "../admin/LineChartComponent.jsx";
// import PieChartComponent from "../dashboard-components/PieChartComponent.jsx";
import HorizontalBarChart from "../admin/HorizontalBarChart.jsx";
import FinalGradeChart from "../admin/FinalGradeChart.jsx";
import ExamTakerPieChart from "../admin/ExamTakerPieChart.jsx";
import TopPerformers from "./TopPerformers.jsx";

const AdminDashboard = () => {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-3 grid-rows-2 h-full w-full gap-4">
        <TopPerformers />
        <div className="rounded-md border border-zinc-200 p-4 shadow w-full flex flex-col focus:outline-none h-full">
          <h1 className="text-xl font-semibold text-center mb-4">Exam Takers</h1>
          <ExamTakerPieChart />
        </div>
        <div className="rounded-md border border-zinc-200 p-4 shadow w-full flex flex-col focus:outline-none h-full">
          <h1 className="text-xl font-semibold text-center mb-4">Examinee Scores</h1>
          <FinalGradeChart />
        </div>

        <div className="rounded-md border border-zinc-200 p-4 shadow w-full flex flex-col focus:outline-none h-full">
          <h1 className="text-xl font-semibold text-center mb-4">Exam Takers</h1>
          <HorizontalBarChart />
        </div>
        <TotalRegisteredStudent />
      </div>
    </div>
  );
};

export default AdminDashboard;
