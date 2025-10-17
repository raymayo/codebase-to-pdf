import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { ShieldUser } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prevAdmin) => {
      const updatedAdmin = { ...prevAdmin, [name]: value };
      console.log(updatedAdmin); // This logs updated state
      return updatedAdmin;
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        admin,
      );
      console.log(response.data);
      toast.success("Login successful");

      // Store user info in sessionStorage
      sessionStorage.setItem(
        "authUser",
        JSON.stringify({
          username: response.data.username,
          role: response.data.role,
        }),
      );

      // Reset the form
      setAdmin({
        username: "",
        password: "",
      });
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);

    } catch (error) {
      console.error("Error logging in:", error);
      alert("Error logging in");
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center p-8 lg:justify-center">
      <div className="pattern flex h-full max-h-fit w-full max-w-xl flex-col gap-8 rounded-xl bg-zinc-800 border border-zinc-200 p-1   text-center shadow-md">
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-6"
        >
          <ShieldUser size={45} className="self-center p-2 border border-zinc-200 rounded-lg shadow bg-zinc-800 text-zinc-100" />
          <h1 className="text-2xl font-semibold">Admininstrator</h1>
          <label className="flex flex-col gap-1.5 text-left">
            Username
            <input
              type="text"
              name="username"
              value={admin.username}
              onChange={handleChange}
              className="rounded-md border border-zinc-200 p-2 text-base shadow-2xs"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-left">
            Password
            <input
              type="password"
              name="password"
              value={admin.password}
              onChange={handleChange}
              className="rounded-md border border-zinc-200 p-2 text-base shadow-2xs"
            />
          </label>
          <button
            className="mt-6 cursor-pointer rounded-md border bg-zinc-900 p-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800 active:bg-zinc-700"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
