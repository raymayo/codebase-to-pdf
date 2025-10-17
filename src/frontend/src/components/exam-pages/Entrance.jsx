import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BookOpenText } from 'lucide-react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Entrance = () => {
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [auth, setAuth] = useState(null);

  const navigate = useNavigate();

  // Fetch student data when regNo is valid (length >= 8)
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/student/${regNo}`,
        );
        if (!response.ok) throw new Error("Student not found");

        const data = await response.json();
        setAuth(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
        setErrorMessage("Invalid registration number");
      }
    };

    if (regNo.length >= 8) {
      fetchStudentData();
    }
  }, [regNo]);

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    try {
      const response = await fetch("http://localhost:5000/api/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regNo, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid credentials");

      if (!auth) return;

      // Store user session in sessionStorage
      sessionStorage.setItem("authUser", JSON.stringify(auth));

      toast.success("Login successful");

      setTimeout(() => {
        navigate(`/student/${auth._id}/details`, { replace: true });
      }, 1500);

    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center p-8 lg:justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className='grid place-items-center'>
          <BookOpenText size={45} className="self-center p-2 border border-zinc-200 rounded-lg shadow bg-zinc-800 text-white" />
          <CardTitle className="text-xl text-center ">Entrance Exam</CardTitle>
        </CardHeader>
        <CardContent>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 "
          >
            <label className="flex flex-col gap-1.5 text-left">
              Registration No.
              <Input
                type="text"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="reg-1023"
                required />

            </label>

            <label className="flex flex-col gap-1.5 text-left">
              Password
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <Button type="submit">
              Enter
            </Button>

          </form>
        </CardContent>
      </Card>

    </div>
  );
};

export default Entrance;
