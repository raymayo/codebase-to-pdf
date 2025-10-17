import React, { useEffect, useMemo, useState } from "react"
import axios from "axios"
import {
    Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
    useReactTable, getCoreRowModel, getPaginationRowModel, flexRender,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select"

const SchoolStats = () => {
    const [data, setData] = useState([])
    const [pageSize, setPageSize] = useState(10)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
    const [schoolFilter, setSchoolFilter] = useState("all")
    const [schools, setSchools] = useState([])

    useEffect(() => {
        axios.get("http://localhost:5000/api/report/school-stats")
            .then(res => {
                // backend returns: [{ school, examinees, passed, failed, passingRate(0..1) }]
                setData(res.data)
                setSchools(res.data.map(r => r.school))
            })
            .catch(err => console.error(err))
    }, [])

    // Reset to first page when filter changes
    useEffect(() => {
        setPagination(p => ({ ...p, pageIndex: 0 }))
    }, [schoolFilter])

    const filteredData = useMemo(() => {
        return schoolFilter === "all" ? data : data.filter(r => r.school === schoolFilter)
    }, [data, schoolFilter])

    const columns = useMemo(() => [
        {
            header: "School of Origin",
            accessorKey: "school",
        },
        {
            header: "Examinees Registered",
            accessorKey: "examinees",
        },
        {
            header: "Passed",
            accessorKey: "passed",
        },
        {
            header: "Failed",
            accessorKey: "failed",
        },
        {
            header: "Passing Rate",
            accessorKey: "passingRate",
            cell: ({ getValue }) => `${Math.round(getValue() * 100)}%`,
        },
    ], [])

    const table = useReactTable({
        data: filteredData,
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    const totalRows = filteredData.length
    const { pageIndex } = table.getState().pagination

    return (
        <div className="p-8">
            <Card className="w-full max-w-5xl mx-auto">
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle>School Performance</CardTitle>

                    <div className="flex items-center gap-3">
                        {/* School filter */}
                        <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                            <SelectTrigger className="w-[260px]">
                                <SelectValue placeholder="Select school" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Schools</SelectItem>
                                {schools.map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Page size */}
                        <Select
                            value={String(pageSize)}
                            onValueChange={(val) => {
                                const n = Number(val)
                                setPageSize(n)
                                table.setPageSize(n)
                            }}
                        >
                            <SelectTrigger className="w-[140px]">
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
                            {table.getHeaderGroups().map((hg) => (
                                <TableRow key={hg.id}>
                                    {hg.headers.map((h) => (
                                        <TableHead key={h.id}>
                                            {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
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
                            Showing page {pageIndex + 1} of {Math.max(table.getPageCount(), 1)} — {totalRows} total rows
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
                                Page {pageIndex + 1}
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
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
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

export default SchoolStats
