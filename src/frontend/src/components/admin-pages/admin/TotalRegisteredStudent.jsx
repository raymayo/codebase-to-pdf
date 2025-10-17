import { useState, useEffect } from "react";

import { UsersRound, UserCheck, ChartLine, ChartPie } from "lucide-react";
const TotalRegisteredStudent = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [registeredStudent, setRegisteredStudents] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/student/all");
        const data = await response.json();
        console.log(data.count);
        setTotalStudents(data.count);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchRegistered = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/student/registered",
        );
        const data = await response.json();
        console.log(data.count);
        setRegisteredStudents(data.count);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetchRegistered();
  }, []);

  return (
    <div className="grid grid-cols-2 w-full gap-4 rounded-lg bg-white">
      <div className="w-full rounded-md border border-zinc-200 p-4 shadow-2xs">
        <div className="flex gap-8">
          <h2 className="mb-4 text-base font-medium">Total Exam Takers</h2>
          <UsersRound size={25} />
        </div>

        <p className="text-4xl font-bold">{totalStudents}</p>
      </div>
      <div className="w-full rounded-md border border-zinc-200 p-4 shadow-2xs">
        <div className="flex gap-8">
          <h2 className="mb-4 text-base font-medium">
            Total Registered Examiners
          </h2>

          <UserCheck size={25} />
        </div>
        <p className="text-4xl font-bold">{registeredStudent}</p>
      </div>
      <div className="w-full rounded-md border border-zinc-200 p-4 shadow-2xs">
        <div className="flex gap-8">
          <h2 className="mb-4 text-base font-medium">Dashboard Data 2</h2>
          <ChartLine size={25} />
        </div>
        <p className="text-4xl font-bold">18</p>
      </div>
      <div className="w-full rounded-md border border-zinc-200 p-4 shadow-2xs">
        <div className="flex gap-8">
          <h2 className="mb-4 text-base font-medium">Dashboard Data 3</h2>
          <ChartPie size={25} />
        </div>
        <p className="text-4xl font-bold">30</p>
      </div>
    </div>
  );
};

export default TotalRegisteredStudent;
