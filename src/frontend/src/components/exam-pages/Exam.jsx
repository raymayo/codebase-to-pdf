import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudent } from "../../context/StudentContext.jsx";
import { Circle, CheckCircle } from "lucide-react";
import axios from "axios";

const Exam = () => {
  const { id, subjectId } = useParams();
  const { student, setStudent } = useStudent();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({}); // { [qIdx]: choiceIndex }
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const QUESTION_LIMIT = 10;

  // Fisher-Yates shuffle (stable & unbiased)
  const shuffleArray = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Fetch exam details
  useEffect(() => {
    if (!subjectId) return;
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/exams/title/${subjectId}`)
      .then((res) => {
        if (res.data?.questions) {
          // Shuffle questions (limit applied)
          let shuffledQuestions = shuffleArray(res.data.questions).slice(
            0,
            QUESTION_LIMIT
          );

          // Shuffle choices per question BUT DO NOT mutate 'correctAnswer' from DB
          shuffledQuestions = shuffledQuestions.map((q) => ({
            ...q,
            choices: shuffleArray(q.choices),
          }));

          setExam({ ...res.data, questions: shuffledQuestions });
        } else {
          setExam(res.data);
        }
      })
      .catch((err) => console.error("Failed to fetch exam:", err))
      .finally(() => setLoading(false));
  }, [subjectId]);

  // Prevent retake if student already has score
  useEffect(() => {
    const existingScore =
      student?.examScores?.[subjectId] ??
      (student?.examScores instanceof Map
        ? student.examScores.get(subjectId)
        : 0);

    if (existingScore && Number(existingScore) !== 0) {
      navigate(`/student/${id}/exam/`);
    }
  }, [student, subjectId, id, navigate]);

  if (!student) return null;
  if (!student.examScores) return <p>Loading student exam data...</p>;

  const handleAnswerChange = (questionIndex, choiceIndex) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: choiceIndex }));
  };

  const allAnswered = useMemo(() => {
    if (!exam?.questions) return false;
    return exam.questions.every((_, idx) => answers[idx] !== undefined);
  }, [answers, exam]);

  const submitExam = async () => {
    if (!exam?.questions) return;

    // IMPORTANT: backend expects choice TEXT in 'selected', not an index,
    // and also needs 'subjectId' in the body.
    const formattedAnswers = exam.questions.map((q, idx) => {
      const chosenIdx = answers[idx];
      const selectedText =
        chosenIdx !== undefined ? q.choices[chosenIdx] : null;

      return {
        questionId: q._id, // Mongo subdoc id
        selected: selectedText, // <-- TEXT, aligns with backend comparison
      };
    });

    setSubmitting(true);
    try {
      const res = await axios.post("http://localhost:5000/api/exam-result", {
        studentId: student._id,
        examId: exam._id,
        subjectId, // <-- include this for Student.examScores map
        answers: formattedAnswers,
      });

      // Update student context with returned score
      const newScore = res.data?.examResult?.score ?? 0;

      setStudent((prev) => ({
        ...prev,
        examScores: {
          ...(prev?.examScores || {}),
          [subjectId]: newScore,
        },
        // Optional: keep examResults list & status in sync if backend returned them
        ...(res.data?.student
          ? {
            examResults: res.data.student.examResults,
            totalScore: res.data.student.totalScore,
            status: res.data.student.status,
          }
          : {}),
      }));

      navigate(`/student/${id}/exam/`);
    } catch (err) {
      console.error("Failed to submit exam:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-start p-8 overflow-y-auto bg-zinc-50">
      <h1 className="text-2xl font-bold uppercase">
        {subjectId?.toUpperCase()} Exam
      </h1>

      {loading ? (
        <p className="mt-4">Loading exam details...</p>
      ) : exam ? (
        <div className="mt-6 w-full max-w-2xl space-y-6">
          {exam.questions.map((q, qIdx) => (
            <div
              key={q._id?.$oid || q._id || qIdx}
              className="rounded-lg border border-zinc-200 p-4 shadow-2xs bg-white"
            >
              <p className="font-medium border-b pb-2 border-zinc-200">
                {qIdx + 1}. {q.questionText}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {q.choices.map((choice, cIdx) => {
                  const isSelected = answers[qIdx] === cIdx;
                  return (
                    <label
                      key={cIdx}
                      className={`flex items-center gap-2 cursor-pointer rounded py-1 px-2 transition-all duration-150 border-2 border-black/0 ${isSelected
                        ? "border-green-600 bg-green-600/25"
                        : "hover:bg-zinc-100"
                        }`}
                      onClick={() => handleAnswerChange(qIdx, cIdx)}
                    >
                      {isSelected ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-zinc-400" />
                      )}
                      <span>{choice}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            className="mt-6 w-full rounded-md bg-zinc-900 px-4 py-2 text-sm text-white disabled:bg-zinc-500 hover:bg-zinc-800/95 transition-all duration-200 cursor-pointer"
            onClick={submitExam}
            disabled={submitting || !allAnswered}
          >
            {submitting ? "Submitting..." : "Submit Exam"}
          </button>
          {!allAnswered && (
            <p className="text-xs text-zinc-500 text-center">
              Please answer all questions.
            </p>
          )}
        </div>
      ) : (
        <p className="mt-4">No exam found.</p>
      )}
    </div>
  );
};

export default Exam;
