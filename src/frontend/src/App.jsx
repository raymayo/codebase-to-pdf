import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./components/exam-pages/Registration.jsx";
import GenerateQR from "./components/exam-pages/GenerateQR.jsx";
import Entrance from "./components/exam-pages/Entrance.jsx";
import UpdateDetails from "./components/exam-pages/UpdateDetails.jsx";
import ExamSelection from "./components/exam-pages/ExamSelection.jsx";
import Exam from "./components/exam-pages/Exam.jsx";
import Success from "./components/exam-pages/Success.jsx";
import Scanner from "./components/exam-pages/CodeScanner.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { StudentProvider } from "./context/StudentContext.jsx"; // Import your context provider
import AdminLogin from "./components/AdminLogin.jsx";

import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import Test from "./components/test/Test.jsx";

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <StudentProvider>
      {/* Context should wrap the entire Router */}
      <Router>
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/test" element={<Test />} />
          <Route path="/entrance" element={<Entrance />} />
          <Route path="/student/:id" element={<GenerateQR />} />
          <Route path="/scan" element={<Scanner />} />
          <Route path="/admin" element={<AdminLogin />} />

          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/*" element={<AdminPanel />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/student/:id/details" element={<UpdateDetails />} />
            <Route path="/student/:id/exam" element={<ExamSelection />} />
            <Route path="/student/:id/exam/:subjectId" element={<Exam />} />
            <Route path="/student/:id/success" element={<Success />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </StudentProvider>
  );
}

export default App;
