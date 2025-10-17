import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import toast from "react-hot-toast";


const CreateAdminModal = ({isOpen, onClose}) => {

    // State to hold admin data
    const [admin, setAdmin] = useState({
        username: "",
        password: "",
        email: "",
        phone: "",
        role: "admin",
    });

    if(!isOpen) return null;

    ;





    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:5000/api/admin/create",
                admin,
            );
            console.log(response.data);
            toast.success("Admin created successfully");

            // Reset the form
            setAdmin({
                username: "",
                password: "",
                email: "",
                phone: "",
                role: "admin",
            });

        } catch (error) {
            console.error("Error creating admin:", error);
            alert("Error creating admin");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdmin((prevAdmin) => ({
            ...prevAdmin,
            [name]: value,
        }));

        console.log(admin);
    };


  return (
    <div className="w-screen h-screen fixed top-0 left-0 z-50 flex items-center justify-center bg-black/75">
          <div className="flex h-screen w-full flex-col items-center justify-center p-8 lg:justify-center ">
              <div className="bg-white flex h-full max-h-fit w-full max-w-xl flex-col gap-8 rounded-xl  p-1.5 text-center ">
                  <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-4 rounded-lg bg-white p-6 relative"
                  >
                      <button onClick={onClose} className="top-0 right-0 p-2 text-zinc-500 absolute cursor-pointer"><X/></button>
                      <h1 className="text-2xl font-semibold">Create Admin</h1>
                      <label className="flex flex-col gap-1.5 text-left">
                          Username
                          <input
                              className="rounded-md border border-zinc-200 p-2 text-base shadow-2xs"
                              name="username"
                              type="text"
                              onChange={handleChange}
                          />
                      </label>
                      <label className="flex flex-col gap-1.5 text-left">
                          Password
                          <input
                              className="rounded-md border border-zinc-200 p-2 text-base shadow-2xs"
                              type="password"
                              name="password"
                              onChange={handleChange}
                          />
                      </label>
                      <label className="flex flex-col gap-1.5 text-left">
                          Email
                          <input
                              className="rounded-md border border-zinc-200 p-2 text-base shadow-2xs"
                              type="email"
                              name="email"
                              onChange={handleChange}
                          />
                      </label>
                      <label className="flex flex-col gap-1.5 text-left">
                          Phone Number
                          <input
                              className="rounded-md border border-zinc-200 p-2 text-base shadow-2xs"
                              type="text"
                              name="phone"
                              onChange={handleChange}
                          />
                      </label>
                      {/* <label className="flex flex-col gap-1.5 text-left">
                          Role
                          <input
                              className="rounded-md border border-zinc-200 p-2 text-base shadow-2xs"
                              value={"admin"}
                              type="text"
                              role={admin.role}
                              name="role"
                              disabled
                          />
                      </label> */}
                      <button className="mt-6 cursor-pointer rounded-md border bg-zinc-900 p-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800">
                          Create Admin
                      </button>
                  </form>
              </div>
          </div>
    </div>
  )
}

export default CreateAdminModal