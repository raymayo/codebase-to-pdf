"use client";

import React, { useEffect, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Summary() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState([]);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/report/summary");
                const result = await res.json();
                setData(result);
            } catch (err) {
                console.error("Error fetching summary:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    const columns = [
        { accessorKey: "strand", header: "Course" },
        { accessorKey: "male", header: "Male" },
        { accessorKey: "female", header: "Female" },
        { accessorKey: "total", header: "Total" },
        { accessorKey: "percentage", header: "Percentage" },
    ];

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    if (loading) return <p className="p-4">Loading...</p>;
    if (!data || data.length === 0) return <p className="p-4">No data available.</p>;

    return (
        <div className="p-6 w-full">
            <h1 className="text-2xl font-semibold mb-4">Summary Report</h1>
            <div className="overflow-x-auto rounded-md border">
                <Table className="w-full table-fixed border-collapse">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const sorted = header.column.getIsSorted();
                                    return (
                                        <TableHead
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="px-4 py-2 font-semibold cursor-pointer select-none border-b text-left"
                                            style={{ width: "20%" }}
                                        >
                                            <div className="flex items-center justify-between">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {sorted === "asc" && <ChevronUp className="inline h-4 w-4 ml-1" />}
                                                {sorted === "desc" && <ChevronDown className="inline h-4 w-4 ml-1" />}
                                            </div>
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="hover:bg-muted/50">
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className="px-4 py-2 border-b text-left"
                                        style={{ width: "20%" }}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
