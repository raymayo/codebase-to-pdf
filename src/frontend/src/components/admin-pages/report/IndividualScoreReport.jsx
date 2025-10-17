import React, { useState, useEffect } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
} from "@tanstack/react-table";

import { ChevronDown, ChevronUp } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

const IndividualScoreReport = () => {
    const [students, setStudents] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [examSubjects, setExamSubjects] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/student");
            if (!response.ok) throw new Error("Failed to fetch students");
            const data = await response.json();
            setStudents(data);
            console.log(data);
            // dynamically extract examScore subjects for headers
            if (data.length > 0 && data[0].examScores) {
                setExamSubjects(Object.keys(data[0].examScores));

            }
        } catch (error) {
            console.error(error);
        }
    };

    // --- Define columns for TanStack Table ---
    const columns = [
        {
            accessorKey: "regNo",
            header: "Reg No",
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        // dynamic exam score columns
        ...examSubjects.map((subject) => ({
            accessorKey: `examScores.${subject}`,
            header: subject,
            cell: ({ row }) => row.original.examScores?.[subject] ?? "-",
        })),
        {
            accessorKey: "totalScore",
            header: "Total Score",
        },
    ];

    // --- Create table instance ---
    const table = useReactTable({
        data: students,
        columns,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="flex h-full w-full flex-col gap-4">
            <h1 className="w-full text-2xl font-semibold">Individual Score Report</h1>

            {/* Search box */}
            <div className="flex items-center">
                <Input
                    placeholder="Search students..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="h-full rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="cursor-pointer select-none"
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: (
                                                <ChevronUp className="inline-block ml-1" size={20} />
                                            ),
                                            desc: (
                                                <ChevronDown className="inline-block ml-1" size={20} />
                                            ),
                                        }[header.column.getIsSorted()] ?? null}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default IndividualScoreReport;
