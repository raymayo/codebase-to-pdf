import React from "react";
import { useState, useEffect } from "react";
import Tooltip from "../../admin-components/Tooltip.jsx";
import { SquarePen, Eye, Trash } from "lucide-react";
import EditExamModal from "./EditExamModal.jsx";
import ViewExamModel from "./ViewExamModal.jsx";

const ManageExam = () => {
  const [exams, setExams] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const openEditModal = (selectedExam) => {
    setSelectedExam(selectedExam);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedExam(null);
    setEditModalOpen(false);
  }

  const openViewModal = (selectedExam) => {
    setSelectedExam(selectedExam);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedExam(null);
    setViewModalOpen(false);
  }


  const fetchExams = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/exams/");
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      console.log(data);
      setExams(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

    fetchExams();
  }, []);

  return (
    <div className="my-auto flex h-full w-full flex-col items-center lg:justify-start">
      <h1 className="mb-4 w-full text-2xl font-semibold">
        Manage Examinations
      </h1>
      <div className="h-fit w-full rounded-md border border-zinc-300 bg-white">
        <table className="h-full w-full">
          <thead>
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                #
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Title
              </th>
              {/* <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Description
              </th> */}
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam, index) => (
              <tr key={index}>
                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                  {index + 1}
                </td>
                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                  {exam.title}
                </td>
                {/* <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                  {exam.description}
                </td> */}
                <td className="w-fit border-t border-zinc-300 px-4 py-3 text-left text-sm">
                  <div className="flex gap-2">

                    <Tooltip text="View Exam" position="top">
                      <button
                        onClick={() => openViewModal(exam._id)}
                        className="cursor-pointer rounded-md border border-zinc-300 p-2 shadow-2xs transition-all duration-200 hover:bg-zinc-100"
                      >
                        <Eye size={16} className="text-zinc-900" />
                      </button>
                    </Tooltip>

                    <Tooltip text="Edit Exam" position="top">
                      <button
                        onClick={() => openEditModal(exam._id)}
                        className="cursor-pointer rounded-md border border-zinc-300 p-2 shadow-2xs transition-all duration-200 hover:bg-zinc-100"
                      >
                        <SquarePen size={16} className="text-zinc-900" />
                      </button>
                    </Tooltip>

                    <Tooltip text="Delete Exam" position="top">
                      <button

                        className="cursor-pointer rounded-md border border-zinc-300 p-2 shadow-2xs transition-all duration-200 hover:bg-zinc-100"
                      >
                        <Trash size={16} className="text-red-500" />
                      </button>
                    </Tooltip>
                    {/* <button className="border border-zinc-300 rounded-md cursor-pointer">E</button>
                                        <button className="border border-zinc-300 rounded-md cursor-pointer">D</button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditExamModal
        examId={selectedExam}
        isOpen={editModalOpen}
        onClose={closeEditModal}
        onUpdate={fetchExams}
      />

      <ViewExamModel
        examId={selectedExam}
        isOpen={viewModalOpen}
        onClose={closeViewModal}
      />
    </div>
  );
};

export default ManageExam;
