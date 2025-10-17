import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../admin-pages/dashboard/AdminDashboard.jsx";
import StudentList from "../admin-pages/student/StudentList.jsx";
import AdminList from "../admin-pages/admin/AdminList";
import ManageExam from "../admin-pages/exam/ManageExam.jsx";
import CreateExam from "../admin-pages/exam/CreateExam.jsx";
import CreateCourse from "../admin-pages/exam/CreateCourse.jsx";
import CoursesTable from "../admin-pages/exam/CourseTable";
// import Summary from "../report/Summary.jsx";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/students" element={<StudentList />} />
      <Route path="/admin-list" element={<AdminList />} />
      <Route path="/exam-list" element={<ManageExam />} />
      <Route path="/create-exam" element={<CreateExam />} />
      <Route path="/course-table" element={<CoursesTable />} />
      <Route path="/create-course" element={<CreateCourse />} />
      {/* <Route path="/summary" element={<Summary />} /> */}
    </Routes>
  );
};

export default AdminRoutes;
