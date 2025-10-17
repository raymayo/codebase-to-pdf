import { useNavigate, useParams } from "react-router-dom";
import { useStudent } from "../../context/StudentContext.jsx";
import { useEffect, useState } from "react";
import {
  Lock,
  Play
} from "lucide-react";

// Map exam titles to icons


const ExamSelection = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { student } = useStudent();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch subjects/exams from backend
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/exams");
        if (!res.ok) throw new Error("Failed to fetch exams.");
        const data = await res.json();
        setSubjects(data); // expect array of { id, title, description? }
      } catch (err) {
        console.error("Error fetching subjects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleStart = (subjectId) => {
    navigate(`/student/${id}/exam/${subjectId}`);
  };


  console.log(student)
  console.log(subjects.length)
  console.log(Object.keys(student.examScores) < subjects.length ? true : false)

  const formatTitle = (str) => {
    if (!str) return "";
    return str
      .split("-")                  // ["social", "studies"]
      .map(word => word[0].toUpperCase() + word.slice(1)) // ["Social", "Studies"]
      .join(" ");                  // "Social Studies"
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!student || !student.examScores) return;
    const totalScore = Object.values(student.examScores).reduce((acc, score) => acc + (score || 0), 0);
    console.log("Total Score:", totalScore);
    try {
      const response = await fetch(`http://localhost:5000/api/register/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examScores: student.examScores, totalScore: totalScore, status: "Exam Taken" }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to submit exam results.");
      }

      navigate(`/student/${id}/success`);
    } catch (err) {
      console.error("Submission error:", err.message);
      alert("Failed to save exam results. Try again.");
    }
  };

  if (!student) return <p>Loading student data...</p>;

  return (
    <div className="flex h-screen w-screen flex-col gap-16 items-center border p-8 lg:justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Welcome to the Entrance Exam</h1>
        <p className="text-zinc-600 text-md">Please complete the following sections in order.</p>
      </div>

      <main className="w-full h-full max-h-fit max-w-7xl gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {loading ? (
          <p>Loading exams...</p>
        ) : (
          subjects.map((exam) => {
            // const Icon = icons[exam.title] || Globe2; // fallback icon
            const score = student.examScores?.[exam.title] ?? null;
            const finished = score !== null;

            return (
              <div
                key={exam._id || exam.id}
                className="h-full w-full p-4 flex flex-col rounded-md border border-zinc-200 text-left shadow-2xs">
                <h1 className="text-lg font-semibold capitalize">{formatTitle(exam.title)} Exam</h1>
                <p className="text-sm text-zinc-600">score: {score !== null ? score : "???"} | 10 questions</p>
                {/* <p>Score: {score !== null ? score : "Not Taken"}</p> */}
                <button
                  className="mt-4 cursor-pointer rounded border border-zinc-300 bg-zinc-900 p-2 text-sm text-zinc-100 shadow-2xs hover:bg-zinc-800 disabled:bg-zinc-300 disabled:text-zinc-500"
                  disabled={finished}
                  onClick={() => handleStart(exam.title)}
                >
                  {finished ?
                    <div className="w-full flex justify-center items-center gap-1 cursor-not-allowed">
                      <Lock size={20} /> Locked
                    </div>
                    : "Start"}
                </button>
              </div>
            );
          })

        )}


      </main>

      <button
        disabled={Object.keys(student.examScores || {}).length < subjects.length ? true : false}
        onClick={handleSubmit}
        className="col-span-5 w-full cursor-pointer rounded-md border border-zinc-300 bg-zinc-900 p-2 text-sm text-zinc-100 shadow-2xs hover:bg-zinc-800 disabled:bg-zinc-300 disabled:text-zinc-500 max-w-7xl"
      >
        Submit Result
      </button>
    </div>
  );
};

export default ExamSelection;
