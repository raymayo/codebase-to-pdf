import React from "react";
import { useNavigate } from "react-router-dom";
import { useStudent } from "../../context/StudentContext.jsx";

const Success = () => {
  const navigate = useNavigate();
  const { logout } = useStudent();

  const handleHome = () => {
    logout();
    console.log("logout");
    navigate("/entrance", { replace: true });
  };

  const handleResultScanner = () => {
    logout();
    console.log("logout");
    navigate(`/scan`, { replace: true });
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8 border p-8 lg:justify-center">
      <div className="success-animation">
        <svg
          className="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          <circle
            className="checkmark__circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path
            className="checkmark__check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
      </div>
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-4xl font-semibold">
          Success! The result has been added to the system.
        </h1>
        <p className="text-lg text-gray-500">
          All set! You can now view your results in the results section using
          your QR code.
        </p>
      </div>
      <div className="flex w-full justify-center gap-4">
        <button
          onClick={handleHome}
          className="w-fit cursor-pointer rounded-md border border-zinc-200 bg-white px-4 py-2 text-base font-medium text-zinc-900 shadow-2xs hover:bg-zinc-100 disabled:bg-zinc-300 disabled:text-zinc-500"
        >
          Home
        </button>
        <button
          onClick={handleResultScanner}
          className="bg-lima border-lima-500 hover:bg-lima-600 w-fit cursor-pointer rounded-md border px-4 py-2 text-base font-medium bg-green-500 text-zinc-900 shadow-2xs disabled:bg-zinc-300 disabled:text-zinc-500"
        >
          Result Scanner
        </button>
      </div>
    </div>
  );
};

export default Success;
