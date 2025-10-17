// /* eslint-disable no-unused-vars */
// import { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Users,
//   SquareUser,
//   GraduationCap,
//   ChevronDown,
//   CalendarDays,
//   BookMarked,
//   FileUser,
//   Layers,
//   FilePlus2,
//   FileSpreadsheet,
// } from "lucide-react";

// const DropdownMenu = ({ title, icon: Icon, children }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-all hover:bg-zinc-200/50"
//       >
//         <span className="flex items-center gap-2">
//           <Icon size={22} />
//           {title}
//         </span>
//         <ChevronDown
//           size={16}
//           className={`transition-transform duration-300 ${
//             isOpen ? "rotate-180" : ""
//           }`}
//         />
//       </button>

//       {/* Animated Dropdown */}
//       <div
//         className={`ml-6 cursor-pointer overflow-hidden transition-all duration-300 ease-in-out ${
//           isOpen
//             ? "max-h-40 scale-y-100 opacity-100"
//             : "max-h-0 scale-y-90 opacity-0"
//         }`}
//       >
//         <div className="mt-1 flex flex-col gap-1">{children}</div>
//       </div>
//     </div>
//   );
// };

// const AdminAdminSidebar = () => {
//   return (
//     <div className="h-screen w-72 border-r border-zinc-300 bg-white text-zinc-950">
//       <h2 className="flex items-center gap-2 border-b border-zinc-200 px-4 py-4 text-lg font-semibold">
//         <span className="bg-primary rounded-lg p-1.5">
//           <GraduationCap className="text-zinc-950" size={25} />
//         </span>
//         Entrance Exam
//       </h2>

//       <nav className="flex flex-col gap-2 p-4">
//         <NavLink
//           to="/admin/dashboard"
//           className={({ isActive }) =>
//             `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all ${
//               isActive ? "bg-zinc-200/50" : "hover:bg-zinc-200/50"
//             }`
//           }
//         >
//           <LayoutDashboard size={20} /> Dashboard
//         </NavLink>

//         <NavLink
//           to="/admin/students"
//           className={({ isActive }) =>
//             `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all ${
//               isActive ? "bg-zinc-200/50" : "hover:bg-zinc-200/50"
//             }`
//           }
//         >
//           <Users size={20} /> Student List
//         </NavLink>

//         <NavLink
//           to="/admin/admin-list"
//           className={({ isActive }) =>
//             `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all ${
//               isActive ? "bg-zinc-200/50" : "hover:bg-zinc-200/50"
//             }`
//           }
//         >
//           <FileUser size={20} /> Admin List
//         </NavLink>

//         <NavLink
//           to="/admin/exam-list"
//           className={({ isActive }) =>
//             `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all ${
//               isActive ? "bg-zinc-200/50" : "hover:bg-zinc-200/50"
//             }`
//           }
//         >
//           <FileSpreadsheet size={20} /> Manage Exam
//         </NavLink>

//         <NavLink
//           to="/admin/create-exam"
//           className={({ isActive }) =>
//             `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all ${
//               isActive ? "bg-zinc-200/50" : "hover:bg-zinc-200/50"
//             }`
//           }
//         >
//           <FilePlus2 size={20} /> Create Exam
//         </NavLink>
//       </nav>
//     </div>
//   );
// };

// export default AdminAdminSidebar;

// src/components/AdminSidebar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Waypoints,
  Users,
  SquareUser,
  LibraryBig,
  ChevronDown,
  CalendarDays,
  BookMarked,
  FileUser,
  Layers,
} from "lucide-react";

const DropdownMenu = ({ title, icon: Icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-all hover:bg-zinc-200/50"
      >
        <span className="flex items-center gap-2">
          <Icon size={22} /> {title}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* Animated Dropdown */}
      <div
        className={`ml-6 cursor-pointer overflow-hidden transition-all duration-300 ease-in-out ${isOpen
          ? "max-h-40 scale-y-100 opacity-100"
          : "max-h-0 scale-y-90 opacity-0"
          }`}
      >
        <div className="mt-1 flex flex-col gap-1">{children}</div>
      </div>
    </div>
  );
};

const AdminSidebar = () => {
  return (
    <div className="h-screen w-72 border-r border-zinc-300 bg-zinc-100 text-zinc-950">
      <h2 className="flex items-center gap-1 border-b border-zinc-200 px-4 py-4 text-lg font-semibold">
        <span className="bg-primary rounded-lg">
          {/* <LibraryBig className="text-zinc-950" size={24} /> */}
        </span>
        Entrance Exam
      </h2>

      <nav className="flex flex-col gap-2 p-4">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all ${isActive ? "bg-zinc-200/50" : "hover:bg-zinc-200/50"
            }`
          }
        >
          <Waypoints size={20} /> Dashboard
        </NavLink>

        {/* Teachers Dropdown */}
        <DropdownMenu title="Student Management" icon={Users}>
          <NavLink
            to="/admin/students"
            className="block rounded-md px-3 py-1 text-sm hover:bg-zinc-200/50"
          >
            Examinee List
          </NavLink>
          <NavLink
            to="/admin/admin-list"
            className="block rounded-md px-3 py-1 text-sm hover:bg-zinc-200/50"
          >
            Administrator Table
          </NavLink>

        </DropdownMenu>

        {/* Students Dropdown */}
        <DropdownMenu title="Exam Management" icon={SquareUser}>
          <NavLink
            to="/admin/exam-list"
            className="block rounded-md px-3 py-1 text-sm hover:bg-zinc-200/50"
          >
            Examination Management
          </NavLink>

          <NavLink
            to="/admin/course-table"
            className="block rounded-md px-3 py-1 text-sm hover:bg-zinc-200/50"
          >
            Course Table
          </NavLink>

          <NavLink
            to="/admin/create-exam"
            className="block rounded-md px-3 py-1 text-sm hover:bg-zinc-200/50"
          >
            Create Exam
          </NavLink>

          <NavLink
            to="/admin/create-course"
            className="block rounded-md px-3 py-1 text-sm hover:bg-zinc-200/50"
          >
            Create Course
          </NavLink>

        </DropdownMenu>
        <DropdownMenu title="Reports" icon={SquareUser}>
          <NavLink
            to="/admin/students"
            className="block rounded-md px-3 py-1 text-sm hover:bg-zinc-200/50"
          >
            Examinee Masterlist
          </NavLink>

          <NavLink
            to="/admin/create-exam"
            className="block rounded-md px-3 py-1 text-sm hover:bg-zinc-200/50"
          >
            Exam Report
          </NavLink>
        </DropdownMenu>

        <DropdownMenu title="Utilities" icon={SquareUser}>
          <NavLink
            to="/admin/admin-list"
            className="block rounded-md px-3 py-1 text-sm hover:bg-zinc-200/50"
          >
            Administrator Table
          </NavLink>

          {/* <NavLink
            to="/admin/create-exam"
            className="block rounded-md px-3 py-1 text-sm hover:bg-zinc-200/50"
          >
            Create Exam
          </NavLink> */}
        </DropdownMenu>
      </nav>
    </div>
  );
};

export default AdminSidebar;
