import React from "react";
import AdminSidebar from "../components/admin-components/AdminSidebar.jsx";
import AdminRoutes from "../components/admin-components/AdminRoutes.jsx";
const AdminPanel = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex w-full items-start justify-center bg-white p-6">
        <AdminRoutes />
      </div>
    </div>
  );
};

export default AdminPanel;
