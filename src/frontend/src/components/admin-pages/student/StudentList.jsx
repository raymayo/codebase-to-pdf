import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

import { Eye, SquarePen, Trash, MoreVertical, ChevronDown, ChevronUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import PrintPage from "./PrintPage.jsx";
import StudentDetailsModal from "./StudentDetailsModal.jsx";
import EditStudentModal from "./EditStudentModal.jsx";
import toast from "react-hot-toast";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  function formatToMDY(dateInput) {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/student");
      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error(error);
    }
  };

  const saveStudentDetails = async (updatedStudent) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/student/${updatedStudent.regNo}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedStudent),
        }
      );

      if (!res.ok) throw new Error("Failed to save student details");

      await res.json();
      toast.success("Student details saved successfully!");
      setIsEditModalOpen(false);
      fetchStudents();
    } catch (error) {
      console.error(error);
      toast.error("Error saving student details.");
    }
  };

  const deleteStudent = async (regNo) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/student/${regNo}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete student");

      toast.success("Student deleted successfully!");
      fetchStudents();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting student.");
    }
  };

  // --- Define columns for TanStack Table ---
  const columns = [
    {
      accessorKey: "regNo",
      header: "Exam ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "course1st",
      header: "Course Applied",
    },
    {
      accessorKey: "examDate",
      header: "Exam Date",
      cell: ({ row }) => formatToMDY(row.original.examDate),
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "totalScore",
      header: "Score",
    },
    {
      accessorKey: "lastSchool",
      header: "Last School",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedStudent(student);
                  setIsModalOpen(true);
                }}
              >
                <Eye size={14} className="mr-2" />
                View Student
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedStudent(student);
                  setIsEditModalOpen(true);
                }}
              >
                <SquarePen size={14} className="mr-2" />
                Edit Student
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <PrintPage student={student} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => deleteStudent(student.regNo)}
                className="text-red-600 focus:text-red-700"
              >
                <Trash size={14} className="mr-2" />
                Delete Student
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // --- Create table instance ---
  const table = useReactTable({
    data: students,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <h1 className="w-full text-2xl font-semibold">Manage Students</h1>

      {/* Search box */}
      <div className="flex items-center">
        <Input
          placeholder="Search students..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="h-full rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer select-none"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: <ChevronUp className="inline-block ml-1" size={20} />,
                      desc: <ChevronDown className="inline-block ml-1" size={20} />,
                    }[header.column.getIsSorted()] ?? null}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <StudentDetailsModal
        student={selectedStudent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <EditStudentModal
        student={selectedStudent}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={saveStudentDetails}
      />
    </div>
  );
};

export default StudentList;
