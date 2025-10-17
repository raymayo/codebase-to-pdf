import React, { useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { MoreVertical, Eye, SquarePen, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const API = "http://localhost:5000/api/course" // <-- plural

const emptyCourse = {
    _id: "",
    name: "",
    description: "",
    department: "",
    passingScore: 0,
    durationYears: "4",
}

const CoursesTable = () => {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)

    const [selectedCourse, setSelectedCourse] = useState(null)
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editForm, setEditForm] = useState(emptyCourse)

    // --- Fetch courses ---
    const fetchCourses = async () => {
        try {
            setLoading(true)
            const res = await axios.get(API)
            setCourses(res.data || [])
        } catch (error) {
            console.error("Error fetching courses:", error)
            toast.error("Failed to load courses")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCourses()
    }, [])

    // --- Actions ---
    const openView = (course) => {
        setSelectedCourse(course)
        setIsViewOpen(true)
    }

    const openEdit = (course) => {
        setSelectedCourse(course)
        setEditForm({
            _id: course?._id || "",
            name: course?.name || "",
            description: course?.description || "",
            department: course?.department || "",
            passingScore: course?.passingScore ?? 0,
            durationYears: course?.durationYears || "4",
        })
        setIsEditOpen(true)
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditForm((prev) => ({
            ...prev,
            [name]:
                name === "passingScore"
                    ? Number(value)
                    : value,
        }))
    }

    const saveEdit = async () => {
        try {
            if (!editForm._id) return
            await axios.put(`${API}/${editForm._id}`, {
                name: editForm.name,
                description: editForm.description,
                department: editForm.department,
                passingScore: editForm.passingScore,
                durationYears: editForm.durationYears,
            })
            toast.success("Course updated")
            setIsEditOpen(false)
            fetchCourses()
        } catch (error) {
            console.error("Edit course error:", error)
            const msg = error?.response?.data?.message || "Failed to update course"
            toast.error(msg)
        }
    }

    const deleteCourse = async (id) => {
        const ok = window.confirm("Delete this course? This cannot be undone.")
        if (!ok) return
        try {
            await axios.delete(`${API}/${id}`)
            toast.success("Course deleted")
            // Optimistic update
            setCourses((prev) => prev.filter((c) => c._id !== id))
        } catch (error) {
            console.error("Delete course error:", error)
            const msg = error?.response?.data?.message || "Failed to delete course"
            toast.error(msg)
        }
    }

    return (
        <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold">Courses</h1>
                <Button
                    onClick={() =>
                        openEdit(emptyCourse) // reuse edit dialog as "create" by passing empty
                    }
                >
                    + New Course
                </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-zinc-200 shadow">
                <table className="w-full text-left text-sm text-zinc-600">
                    <thead className="bg-zinc-100 text-sm uppercase text-zinc-800">
                        <tr>
                            <th className="px-4 py-2">Course Name</th>
                            <th className="px-4 py-2">Description</th>
                            <th className="px-4 py-2">Department</th>
                            <th className="px-4 py-2">Passing Score</th>
                            <th className="px-4 py-2">Duration (Years)</th>
                            <th className="px-2 py-2 w-12 text-right"> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-4 py-6 text-center text-zinc-500">
                                    Loading…
                                </td>
                            </tr>
                        ) : courses.length > 0 ? (
                            courses.map((course) => (
                                <tr key={course._id} className="border-t hover:bg-zinc-50">
                                    <td className="px-4 py-2">{course.name}</td>
                                    <td className="px-4 py-2">{course.description}</td>
                                    <td className="px-4 py-2">{course.department}</td>
                                    <td className="px-4 py-2">{course.passingScore}</td>
                                    <td className="px-4 py-2">{course.durationYears}</td>
                                    <td className="px-2 py-2">
                                        <div className="flex justify-end">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="icon">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => openView(course)}>
                                                        <Eye size={14} className="mr-2" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openEdit(course)}>
                                                        <SquarePen size={14} className="mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => deleteCourse(course._id)}
                                                        className="text-red-600 focus:text-red-700"
                                                    >
                                                        <Trash size={14} className="mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-4 py-6 text-center text-zinc-500">
                                    No courses available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Course Details</DialogTitle>
                    </DialogHeader>
                    {selectedCourse ? (
                        <div className="space-y-2">
                            <div><span className="font-medium">Name:</span> {selectedCourse.name}</div>
                            <div><span className="font-medium">Department:</span> {selectedCourse.department}</div>
                            <div><span className="font-medium">Passing Score:</span> {selectedCourse.passingScore}</div>
                            <div><span className="font-medium">Duration:</span> {selectedCourse.durationYears} years</div>
                            <div><span className="font-medium">Description:</span> {selectedCourse.description}</div>
                        </div>
                    ) : (
                        <div className="text-sm text-zinc-500">No course selected.</div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit / Create Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editForm._id ? "Edit Course" : "Create Course"}</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 gap-3">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={editForm.name}
                                onChange={handleEditChange}
                                placeholder="e.g. BSCS"
                            />
                        </div>

                        <div>
                            <Label htmlFor="department">Department</Label>
                            <Input
                                id="department"
                                name="department"
                                value={editForm.department}
                                onChange={handleEditChange}
                                placeholder="e.g. COMPUTER STUDIES"
                            />
                        </div>

                        <div>
                            <Label htmlFor="passingScore">Passing Score</Label>
                            <Input
                                id="passingScore"
                                name="passingScore"
                                type="number"
                                min="0"
                                value={editForm.passingScore}
                                onChange={handleEditChange}
                            />
                        </div>

                        <div>
                            <Label htmlFor="durationYears">Duration (Years)</Label>
                            <Input
                                id="durationYears"
                                name="durationYears"
                                value={editForm.durationYears}
                                onChange={handleEditChange}
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                name="description"
                                value={editForm.description}
                                onChange={handleEditChange}
                                placeholder="Short description"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            onClick={async () => {
                                if (editForm._id) {
                                    await saveEdit()
                                } else {
                                    // create
                                    try {
                                        await axios.post(API, {
                                            name: editForm.name,
                                            description: editForm.description,
                                            department: editForm.department,
                                            passingScore: editForm.passingScore,
                                            durationYears: editForm.durationYears,
                                        })
                                        toast.success("Course created")
                                        setIsEditOpen(false)
                                        fetchCourses()
                                    } catch (error) {
                                        console.error("Create course error:", error)
                                        const msg = error?.response?.data?.message || "Failed to create course"
                                        toast.error(msg)
                                    }
                                }
                            }}
                        >
                            {editForm._id ? "Save Changes" : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CoursesTable
