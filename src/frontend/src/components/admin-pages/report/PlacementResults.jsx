import React, { useEffect, useMemo, useState } from "react"
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

const PlacementResults = () => {
    // table data from backend
    const [rows, setRows] = useState([])
    const [totalRows, setTotalRows] = useState(0)
    const [pageCount, setPageCount] = useState(1)

    // filters
    const [statusFilter, setStatusFilter] = useState("all")

    // server-side pagination state
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

    // fetch from backend whenever filters or pagination change
    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = {
                    page: pagination.pageIndex + 1,      // server is 1-based
                    limit: pagination.pageSize,
                }
                if (statusFilter !== "all") params.status = statusFilter

                const res = await axios.get("http://localhost:5000/api/report/students-with-scores", { params })
                const payload = res.data || {}
                const data = payload.data || []
                const meta = payload.meta || {}

                setRows(data)
                setTotalRows(meta.total || data.length)
                setPageCount(meta.pageCount || 1)
            } catch (e) {
                console.error("Failed to load placements:", e)
                setRows([])
                setTotalRows(0)
                setPageCount(1)
            }
        }

        fetchData()
    }, [statusFilter, pagination.pageIndex, pagination.pageSize])

    // when the filter changes, reset to first page
    useEffect(() => {
        setPagination((p) => ({ ...p, pageIndex: 0 }))
    }, [statusFilter])

    const columns = useMemo(
        () => [
            { header: "Examinee ID", accessorKey: "examineeId" },
            { header: "Name", accessorKey: "name" },
            {
                header: "Primary Choice",
                accessorKey: "primaryChoice", // e.g. "BSCS"
                cell: ({ getValue }) => getValue() ?? "—",
            },
            {
                header: "Secondary Choice",
                accessorKey: "secondaryChoice", // e.g. "BSED MATH & FIL"
                cell: ({ getValue }) => getValue() ?? "—",
            },
            { header: "Score", accessorKey: "score" },
            {
                header: "Primary Cutoff",
                accessorKey: "primaryCutoff", // from Course.passingScore
                cell: ({ getValue }) => (getValue() ?? "—"),
            },
            {
                header: "Secondary Cutoff",
                accessorKey: "secondaryCutoff",
                cell: ({ getValue }) => (getValue() ?? "—"),
            },
            { header: "Final Placement", accessorKey: "finalPlacement" },
        ],
        []
    )

    const table = useReactTable({
        data: rows,
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        // tell TanStack we paginate on the server
        manualPagination: true,
        pageCount,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    const { pageIndex, pageSize } = table.getState().pagination

    return (
        <div className="p-8">
            <Card className="w-full max-w-6xl mx-auto">
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle>Admission Placement Results</CardTitle>

                    <div className="flex items-center gap-3">
                        {/* Status filter (server-side) */}
                        <Select
                            value={statusFilter}
                            onValueChange={(v) => setStatusFilter(v)}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Exam Taken">Exam Taken</SelectItem>
                                <SelectItem value="Registered">Registered</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Page size (server-side) */}
                        <Select
                            value={String(pageSize)}
                            onValueChange={(val) => table.setPageSize(Number(val))}
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
                                    {hg.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
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

                    {/* Pagination controls (server-side) */}
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing{" "}
                            {totalRows === 0 ? 0 : pageIndex * pageSize + 1} to{" "}
                            {Math.min((pageIndex + 1) * pageSize, totalRows)} of {totalRows} rows
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.setPageIndex(0)}
                                disabled={pageIndex === 0}
                            >
                                « First
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={pageIndex === 0}
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
                                disabled={pageIndex + 1 >= pageCount}
                            >
                                Next ›
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.setPageIndex(pageCount - 1)}
                                disabled={pageIndex + 1 >= pageCount}
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

export default PlacementResults
