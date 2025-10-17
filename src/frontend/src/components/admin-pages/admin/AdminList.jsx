import React, { useState, useEffect } from "react";
import { Plus, SquarePen } from "lucide-react";
import Tooltip from "../../admin-components/Tooltip.jsx";
import CreateAdminModal from "./CreateAdminModal.jsx";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);


  const openCreateModal = () => {
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);

  };


  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/all");
        if (!response.ok) {
          throw new Error("Failed to fetch admins");
        }
        const data = await response.json();
        console.log(data);
        setAdmins(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  }, []);

  const openModal = (admin) => {
    setCurrentAdmin(admin);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAdmin(null);
  };

  return (
    <div className="flex h-full w-full flex-col gap-4">
      {/* <button
        className="flex cursor-pointer items-center gap-2 self-end rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-medium"
        // onClick={() => setRegisterModalOpen(true)}
      >
        <Plus size={16} />
        Register
      </button> */}
      <div className="flex items-center justify-center">

        <h1 className="w-full text-2xl font-semibold">Manage Administrators</h1>
        <button onClick={() => openCreateModal()} className="w-35 text-sm border-zinc-300 cursor-pointer shadow-2xs p-2 rounded border">Create Admin</button>
      </div>
      <div className="h-fit rounded-md border border-zinc-300 bg-white">
        <table className="h-full w-full">
          <thead>
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                #
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Username
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Password
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Email
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Phone
              </th>
              {/* <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Year Level
              </th> */}
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, index) => (
              <tr key={index}>
                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                  {index + 1}
                </td>
                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                  {admin.username}
                </td>
                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                  {admin.password}
                </td>
                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                  {admin.email}
                </td>
                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                  {admin.phone}
                </td>
                {/* <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                  {admin.yearLevel}
                </td> */}
                <td className="w-fit border-t border-zinc-300 px-4 py-3 text-left text-sm">
                  <div className="flex gap-2">
                    <Tooltip text="Edit Admin" position="top">
                      <button
                        onClick={() => openModal(admin)}
                        className="cursor-pointer rounded-md border border-zinc-300 p-2 shadow-2xs transition-all duration-200 hover:bg-zinc-100"
                      >
                        <SquarePen size={16} className="text-zinc-900" />
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-zinc-900/75">
          <div className="w-1/3 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Edit Admin</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  defaultValue={currentAdmin?.username}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="text"
                  id="password"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  defaultValue={currentAdmin?.password}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  defaultValue={currentAdmin?.email}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  defaultValue={currentAdmin?.phone}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="cursor-pointer rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CreateAdminModal
        isOpen={createModalOpen}
        onClose={closeCreateModal}
      />
    </div>
  );
};

export default AdminList;

// {
