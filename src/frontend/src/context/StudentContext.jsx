import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const StudentContext = createContext();

// Provide context
export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(() => {
    const storedStudent = sessionStorage.getItem("student");
    return storedStudent ? JSON.parse(storedStudent) : null;
  });

  useEffect(() => {
    if (student) {
      sessionStorage.setItem("student", JSON.stringify(student));
    }
  }, [student]);

  // Logout clears state and sessionStorage
  const logout = () => {
    setStudent(null);
    sessionStorage.removeItem("student");
  };

  return (
    <StudentContext.Provider value={{ student, setStudent, logout }}>
      {children}
    </StudentContext.Provider>
  );
};

// Custom hook to use the student context
export const useStudent = () => useContext(StudentContext);
