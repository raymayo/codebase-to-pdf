import React, { useEffect, useState, useMemo } from "react"
import axios from "axios"
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table"
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const QuestionStats = () => {
    const [data, setData] = useState([])
    const [subjectFilter, setSubjectFilter] = useState("all")
    const [subjects, setSubjects] = useState([])

    // pagination state
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10, // default rows per page
    })

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/report/question-stats")
            .then((res) => {
                setData(res.data)
                const uniqueSubjects = [...new Set(res.data.map((d) => d.subject))]
                setSubjects(uniqueSubjects)
            })
            .catch((err) => console.error(err))
    }, [])

    // reset to first page when filter changes
    useEffect(() => {
        setPagination((p) => ({ ...p, pageIndex: 0 }))
    }, [subjectFilter])

    const filteredData = useMemo(() => {
        return subjectFilter === "all"
            ? data
            : data.filter((row) => row.subject === subjectFilter)
    }, [data, subjectFilter])

    const columns = useMemo(
        () => [
            {
                header: "Question #",
                id: "number",
                cell: ({ row, table }) => {
                    const { pageIndex, pageSize } = table.getState().pagination
                    return pageIndex * pageSize + row.index + 1
                },
            },
            {
                header: "Subject",
                accessorKey: "subject",
            },
            {
                header: "Question",
                accessorKey: "questionText",
            },
            {
                header: "Correct Responses",
                accessorKey: "correctResponses",
            },
            {
                header: "Total Responses",
                accessorKey: "totalResponses",
            },
            {
                header: "Difficulty Index (%)",
                accessorKey: "difficultyIndex",
                cell: ({ getValue }) => `${getValue()}%`,
            },
        ],
        []
    )

    const table = useReactTable({
        data: filteredData,
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    const totalRows = filteredData.length
    const { pageIndex, pageSize } = table.getState().pagination
    const pageCount = table.getPageCount()

    return (
        <div className="p-8">
            <Card className="w-full max-w-5xl mx-auto">
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle>Question Statistics</CardTitle>

                    <div className="flex items-center gap-3">
                        {/* Subject filter */}
                        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subjects</SelectItem>
                                {subjects.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Page size */}
                        <Select
                            value={String(pageSize)}
                            onValueChange={(val) =>
                                table.setPageSize(Number(val))
                            }
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Rows per page" />
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 20, 50].map((n) => (
                                    <SelectItem key={n} value={String(n)}>
                                        {n} / page
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
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
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center">
                                        No data available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination controls */}
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing{" "}
                            {totalRows === 0
                                ? 0
                                : pageIndex * pageSize + 1}{" "}
                            to{" "}
                            {Math.min((pageIndex + 1) * pageSize, totalRows)} of {totalRows} rows
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                « First
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                ‹ Prev
                            </Button>
                            <span className="text-sm px-2">
                                Page {pageIndex + 1} of {Math.max(pageCount, 1)}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next ›
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.setPageIndex(pageCount - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                Last »
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default QuestionStats
