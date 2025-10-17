import React, { useState } from "react";
import dayjs from "dayjs";

// Tailwind "variables" for reuse
const labelStyle = "text-xs font-medium text-zinc-500 flex flex-col";
const inputStyle =
  "rounded-md border border-zinc-200 px-3 py-2 font-base text-sm shadow-2xs focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300 text-black";
const scoreStyle =
  "border p-2 rounded-md border-zinc-200 bg-white shadow-2xs flex flex-col text-xs text-zinc-500";
const btnPrimary =
  "cursor-pointer rounded-md bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700";



const EditStudentModal = ({ student, isOpen, onClose, onSave }) => {
  if (!isOpen || !student) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [formData, setFormData] = useState({
    ...student,
    birthday: dayjs(student.birthday).format("YYYY-MM-DD"),
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleScoreChange = (subject, value) => {
    setFormData((prev) => ({
      ...prev,
      examScores: { ...prev.examScores, [subject]: value },
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/75">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="mb-4 text-xl font-semibold">Edit Student Details</h2>
        <div className="space-y-2 text-sm">
          <div className="grid w-full grid-cols-3 gap-x-2.5 gap-y-4">
            {[
              ["regNo", "Registration No."],
              ["name", "Name"],
              ["phone", "Phone"],
              ["email", "Email"],
              ["gender", "Sex"],
              ["address", "Address", "textarea"],
              ["birthday", "Birthday", "date"],
              ["birthplace", "Birthplace"],
              ["guardian", "Guardian/Parent Name"],
              ["lastSchool", "Last School Attended"],
              ["lastSchoolAddress", "Last School Address"],
              ["course1st", "1st Choice Course"],
              ["course2nd", "2nd Choice Course"],
              ["transfereeCourse", "Course Taken (Transferee Only)"],
            ].map(([field, label, type]) => (
              <label key={field} className={labelStyle}>
                {label}
                  <input
                    type={type || "text"}
                    value={formData[field] || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className={`${inputStyle} mt-1`}
                    placeholder="N/A"
                  />
                
              </label>
            ))}
          </div>

          {/* Scores */}
          <div className="border-t border-zinc-200 mt-4">
            <h2 className="my-2 text-lg font-semibold">Student Scores</h2>
            <div className="grid grid-cols-3 gap-2">
              {[
                "socialstudies",
                "science",
                "filipino",
                "english",
                "math",
              ].map((subject) => (
                <label key={subject} className={scoreStyle}>
                  {subject[0].toUpperCase() + subject.slice(1)}
                  <input
                    type="number"
                    value={formData.examScores?.[subject] || ""}
                    onChange={(e) =>
                      handleScoreChange(subject, e.target.value)
                    }
                    className={`${inputStyle} mt-1`}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className='cursor-pointer rounded-md bg-zinc-200 px-4 py-2 text-sm text-black hover:bg-zinc-300'>
            Close
          </button>
          <button
            onClick={handleSubmit}
            className={`${btnPrimary} bg-green-700 hover:bg-green-600`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStudentModal;
