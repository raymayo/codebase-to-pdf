import React from "react";
import dayjs from "dayjs";

const StudentDetailsModal = ({ student, isOpen, onClose }) => {
  if (!isOpen || !student) return null;

  const scoreStyle = "border p-2 rounded-md border-zinc-200 bg-white shadow-2xs flex flex-col text-xs text-zinc-500"
  const labelStyle = "text-xs font-base text-zinc-500"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/75">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Student Details</h2>
        <div className="space-y-2 text-sm">
          <div className="grid w-full grid-cols-3 gap-x-2.5 gap-y-4">
            <label className={labelStyle}>
              Registration No.
              <p className="text-base text-black">{student?.regNo || ""}</p>
   
            </label>
            <label className={labelStyle}>
              Name
              <p className="text-base text-black">{student?.name || ""}</p>

             
            </label>
            <label className={labelStyle}>
              Phone
           
                         <p className="text-base text-black">{student?.phone || ""}</p>
            </label>
            <label className={labelStyle}>
              Email
              
                         <p className="text-base text-black">{student?.email || ""}</p>

            </label>
            <label className={labelStyle}>
              Sex
              
                         <p className="text-base text-black">{student?.gender || ""}</p>

            </label>
            <label className={labelStyle}>
              Address
              
                         <p className="text-base text-black">{student?.address || ""}</p>

            </label>
            <label className={labelStyle}>
              Birthday
              
                         <p className="text-base text-black">{dayjs(student?.birthday).format("MMMM D, YYYY") || ""}</p>

            </label>
            <label className={labelStyle}>
              Birthplace
              
                         <p className="text-base text-black">{student?.birthplace || ""}</p>

            </label>
            <label className={labelStyle}>
              Guardian/Parent Name
              
                         <p className="text-base text-black">{student?.guardian || ""}</p>

            </label>
            <label className={labelStyle}>
              Last School Attended
              
                         <p className="text-base text-black">{student?.lastSchool || ""}</p>

            </label>
            <label className={labelStyle}>
              Last School Address
              
                         <p className="text-base text-black">{student?.lastSchoolAddress || ""}</p>

            </label>
            <label className={labelStyle}>
              1st Choice Course
              
                         <p className="text-base text-black">{student?.course1st || ""}</p>

            </label>
            <label className={labelStyle}>
              2nd Choice Course
              
                         <p className="text-base text-black">{student?.course2nd || ""}</p>

            </label>
            <label className={labelStyle}>
              Course Taken (Transferee Only)
              
                         <p className="text-base text-black">{student?.transfereeCourse || "N/A"}</p>

            </label>
          </div>
          <div className="border-t border-zinc-200 mt-4">
            <h2 className="my-2 text-lg font-semibold">Student Scores</h2>
            <div className="grid grid-cols-3 gap-2">

            <p className={scoreStyle}>Social Studies <span className="text-black text-base">{student?.examScores.socialstudies}</span></p>
            <p className={scoreStyle}>Science <span className="text-black text-base">{student?.examScores.science}</span></p>
            <p className={scoreStyle}>Filipino <span className="text-black text-base">{student?.examScores.filipino}</span></p>
            <p className={scoreStyle}>English <span className="text-black text-base">{student?.examScores.english}</span></p>
            <p className={scoreStyle}>Math <span className="text-black text-base">{student?.examScores.math}</span></p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
