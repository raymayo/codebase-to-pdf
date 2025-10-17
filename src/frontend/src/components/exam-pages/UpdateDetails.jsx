/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStudent } from "../../context/StudentContext.jsx";
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { ChevronDownIcon } from "lucide-react"
import { format } from "date-fns"
import SchoolSelect from "../exam-components/SchoolSelect.jsx";
import SearchableSelect from "../exam-components/SearchableSelect"
import { BookOpenText } from 'lucide-react';


const UpdateDetails = () => {

  const navigate = useNavigate();
  const { id } = useParams();
  const { student, setStudent } = useStudent();
  const [courses, setCourses] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [key, setKey] = useState(id);

  // 👇 Always declare hooks here, never after a conditional
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(undefined);

  useEffect(() => {
    if (student?.birthday) {
      setDate(new Date(student.birthday));
    }
  }, [student?.birthday]);


  const submitStudentData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/register/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to update student data.");
      }
    } catch (error) {
      console.error("Error updating student data:", error);
      setErrorMessage("An error occurred while updating the data");
    }
  };

  const fetchCourse = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/course")
      if (!res.ok) {
        throw new Error("Failed to fetch courses")
      }
      const data = await res.json()
      setCourses(data)
      console.log("Courses:", data)
    } catch (err) {
      console.error("fetchCourse error:", err)
    }
  }

  useEffect(() => {
    if (!id) return;
    const fetchStudentData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/register/${id}`,
        );
        const data = await response.json();

        console.log(data);

        if (response.ok) {
          setStudent({
            _id: data._id,
            regNo: data.regNo,
            email: data.email,
            phone: data.phone,
            name: data.name,
            gender: data.gender || "",
            address: data.address || "",
            birthday: data.birthday || "",
            birthplace: data.birthplace || "",
            guardian: data.guardian || "",
            lastSchool: data.lastSchool || "",
            lastSchoolAddress: data.lastSchoolAddress || "",
            course1st: data.course1st || "",
            course2nd: data.course2nd || "",
            transfereeCourse: data.transfereeCourse || "",
            examDate: Date.now(),
            examScores: {
            },
            status: "Registered",
          });
        } else {
          setErrorMessage("Error fetching student data");
          localStorage.removeItem("authUser"); // Remove authentication data
          navigate("/entrance", { replace: true }); // Redirect to login page
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        setErrorMessage("An error occurred while fetching the data");
      }
    };
    fetchStudentData();
    fetchCourse();
  }, [id, setStudent, navigate,]);

  const handleChange = (eOrName, maybeValue) => {
    if (typeof eOrName === "string") {
      // Called like handleChange("gender", "MALE")
      const name = eOrName
      const value = maybeValue
      setStudent((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    } else {
      // Native input event
      const { name, value } = eOrName.target
      setStudent((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }

    console.log(student)
  }


  const handleNavigate = async (e) => {
    e.preventDefault();
    await submitStudentData();
    navigate(`/student/${id}/exam`, { state: { student, key } });
  };

  if (!student) {
    return <div>Loading...</div>; // Show loading message until student data is fetched
  }



  return (
    <div className="grid h-screen w-screen place-items-center">
      <div className="pattern rounded-md border border-zinc-200 shadow-md">
        <div className="w-full max-w-5xl rounded-md flex flex-col items-center gap-2 bg-white p-8 shadow-2xs">
          <BookOpenText size={45} className="text-center p-2 border border-zinc-200 rounded-lg shadow bg-zinc-800 text-white" />
          <h1 className="mb-2 text-center text-xl font-semibold">
            Student Details
          </h1>
          <form onSubmit={handleNavigate} className="">
            <div className="grid w-full grid-cols-6 gap-x-2.5 gap-y-4">
              <label className="flex flex-col gap-1 text-sm font-medium">
                Registration No.
                <Input
                  type="text"
                  name="regNo"
                  placeholder="e.g. 20-4567"
                  value={student?.regNo || ""}
                  onChange={handleChange}
                  required
                  disabled
                />

              </label>
              <label className="col-span-5 flex flex-col gap-1 text-sm font-medium">
                Name
                <Input
                  type="text"
                  name="name"
                  placeholder="e.g. Dela Cruz, Juan, M."
                  value={student?.name || ""}
                  onChange={handleChange}
                  required
                  disabled
                />

              </label>
              <label className="col-span-2 flex flex-col gap-1 text-sm font-medium">
                Phone
                <Input
                  type="number"
                  name="phone"
                  placeholder="e.g. 09123456789"
                  value={student?.phone || ""}
                  onChange={handleChange}
                  required
                  disabled
                />
              </label>
              <label className="col-span-2 flex flex-col gap-1 text-sm font-medium">
                Email
                <Input
                  type="email"
                  name="email"
                  placeholder="e.g. 09123456789"
                  value={student?.email || ""}
                  onChange={handleChange}
                  disabled
                />
              </label>

              <label className="col-span-2 flex flex-col gap-1 text-sm font-medium">
                Sex
                <Select
                  value={student?.gender || ""}
                  onValueChange={(val) => handleChange("gender", val)}

                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">MALE</SelectItem>
                    <SelectItem value="FEMALE">FEMALE</SelectItem>
                  </SelectContent>
                </Select>


              </label>
              <label className="col-span-6 flex flex-col gap-1 text-sm font-medium">
                Address
                {/* <Input
                  type="text"
                  name="address"
                  placeholder="e.g. 0123 Rizal St. Matain, Subic, Zambales"
                  value={student?.address || ""}
                  onChange={handleChange}
                  required
                /> */}
                <SearchableSelect onChange={(loc) => setStudent(prev => ({
                  ...prev,
                  address: `${loc?.brgy}, ${loc?.municipality}, ${loc?.province}`,
                }))} />
              </label>
              <label className="col-span-2 flex flex-col gap-1 text-sm font-medium">
                Birthday
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="birthday"
                      className=" justify-between font-normal w-full"
                    >
                      {date ? format(date, "MMMM d, yyyy") : "Select date"}
                      <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      fromYear={1950}
                      toYear={new Date().getFullYear()}
                      selected={date}
                      onSelect={(d) => {
                        if (!d) return
                        setDate(d)
                        setOpen(false)
                        // Save ISO yyyy-mm-dd to your student state
                        handleChange("birthday", d.toISOString().split("T")[0])
                      }}
                      disabled={(d) => d > new Date()} // block future dates
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </label>
              <label className="col-span-2 flex flex-col gap-1 text-sm font-medium">
                Birthplace
                <Input
                  type="text"
                  name="birthplace"
                  placeholder="Matain, Subic, Zambales"
                  value={student?.birthplace || ""}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="col-span-2 flex flex-col gap-1 text-sm font-medium">
                Guardian/Parent Name
                <Input

                  type="text"
                  name="guardian"
                  placeholder="e.g. Juan Dela Cruz"
                  value={student?.guardian || ""}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="col-span-3 flex flex-col gap-1 text-sm font-medium">
                Last School Attended
                {/* <Input
                  type="text"
                  name="lastSchool"
                  value={student?.lastSchool || ""}
                  onChange={handleChange}
                  placeholder="Name of Previous School"
                  required
                /> */}
                <SchoolSelect
                  selectedSchool={student.lastSchool}
                  onSelect={(school) =>
                    setStudent(prev => ({
                      ...prev,
                      lastSchool: school.institutionName,
                      lastSchoolAddress: `${school.municipality}, ${school.province}`
                    }))
                  }
                />
              </label>
              <label className="col-span-3 flex flex-col gap-1 text-sm font-medium">
                Last School Address
                <Input
                  type="text"
                  name="lastSchoolAddress"
                  value={student?.lastSchoolAddress || ""}
                  onChange={handleChange}
                  placeholder="Address of Previous School"
                  required
                />
              </label>
              <label className="col-span-3 flex flex-col gap-1 text-sm font-medium">
                1st Choice Course
                <Select
                  value={student?.course1st || ""}
                  onValueChange={(val) => handleChange("course1st", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem
                        key={course._id}
                        value={course.name}
                        disabled={student?.course1st === course.name} // prevent selecting same as 1st
                      >
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

              </label>

              <label className="col-span-3 flex flex-col gap-1 text-sm font-medium">
                2nd Choice Course
                <Select
                  value={student?.course2nd || ""}
                  onValueChange={(val) => handleChange("course2nd", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem
                        key={course._id}
                        value={course.name}
                        disabled={student?.course1st === course.name} // prevent selecting same as 1st
                      >
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              <label className="col-span-6 flex flex-col gap-1 text-sm font-medium">
                Course Taken (Transferee Only)
                <Input
                  type="text"
                  name="transfereeCourse"
                  placeholder="Course Taken from Previous School"
                  value={student?.transfereeCourse || ""}
                  onChange={handleChange}
                />
              </label>
            </div>

            <Button
              type="submit"
              className="mt-6 w-full"
            >
              Proceed
            </Button>
          </form>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default UpdateDetails;
