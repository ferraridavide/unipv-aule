import { Plug, Projector, Star, Sun, Tv2 } from 'lucide-react'



import {
    ColumnDef,
    ColumnFiltersState,
    Row,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { useEffect, useState } from 'react'


import './List.css'

import { Badge } from '@/components/ui/badge'
import { DataTableFacetedFilter } from '@/components/table/table-filter'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { useBackend } from '@/services/backendService'

const FAV_AULE_STORAGE_KEY = 'favoritedAulas'


const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
]



type Aula = {

    id: number
    building: string
    name: string
    availability: string[]
    services: string[]

}

function toChiusura(chiusura: number) {
    switch (chiusura) {
        case -1:
            return "Fino a chiusura";
        default:
            return "Indefinito";
    }
}

const servizi = [{label: "Proiettore", value:"projector", icon: Projector}, {label: "LIM", value: "lim", icon: Tv2}, {label: "Prese", value: "plugs", icon: Plug}]



function DataTableDemo() {
    const navigate = useNavigate();
    const backend = useBackend();
    const {toast} = useToast();
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const data: Aula[] = backend;

    function loadAule(): number[] {
        const storedAulas = localStorage.getItem(FAV_AULE_STORAGE_KEY);
        if (storedAulas) {
            return JSON.parse(storedAulas);
        }
        return [];
    }

    function reportUnavailable(aula: Aula): void {
        toast({
            title: "Thank you for your feedback! ☺️",
            description: `${aula.name} has been reported as unavailable.`,
          })
    };
    
  

    const [favoritedAulas, setFavoritedAulas] = useState<number[]>(() => loadAule());
    useEffect(() => {
        localStorage.setItem(FAV_AULE_STORAGE_KEY, JSON.stringify(favoritedAulas));
        console.log("Load");
    }, [favoritedAulas]);

    

    function toggleAula(aula_id: number) {
        if (favoritedAulas.includes(aula_id)) {
            const newAulas = favoritedAulas.filter((aulaFav) => aulaFav !== aula_id);
            setFavoritedAulas(newAulas);
        } else {
            setFavoritedAulas([...favoritedAulas, aula_id]);
        }
    }

    function ActionsComponent(row: Row<Aula>): any {
        return <div className="flex flex-cols">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => reportUnavailable(row.original)}>Report as unavailable</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/report")}>Report issue</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" className="w-8 h-8 p-0" onClick={() => toggleAula(row.original.id)}>
                <Star size={16} style={favoritedAulas.includes(row.original.id) ? { fill: "#ffe57e", stroke: "#aca100" } : {}} /> </Button>
        </div>
    }

    function ServiziComponent(row: Row<Aula>): any {
        return <div className='justify-end flex gap-1 flex-wrap' key={row.id}>
                    {
                        row.getValue<string[]>("services") &&
                    row.getValue<string[]>("services").map((servizio: string) => 
                    <Badge variant="outline" key={servizio}>{servizi.find(x => x.value == servizio)?.label}</Badge>)
                    }
                </div>
    }

    const columns: ColumnDef<Aula>[] = [
        {
            id: "name",
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div>{row.getValue("name")}</div>
            ),
        },
        {
            id: "availability",
            accessorKey: "availability",
            header: "Libera per",
            cell: ({ row }) => {
                return <div>{toChiusura(row.getValue("availability"))}</div>
            },
        },
        {
            id: "services",
            accessorKey: "services",
            header: () => <div className="text-right">Servizi</div>,
            cell: ({ row }) => {
                return ServiziComponent(row)
            },
            filterFn: (row, col, filterValue: string[]) => {
                return filterValue.every(x => row.getValue<string[]>(col) && row.getValue<string[]>(col).includes(x))
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    ActionsComponent(row)
                )
            }
        }
    ]

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        
        <div className="h-full flex flex-col" >
            <div className="flex flex-1 items-center py-4 space-x-2">
                <Input
                    placeholder="Filter..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="h-8 max-w-sm"
                />
                <DataTableFacetedFilter column={table.getColumn("services")}
            title="Servizi"
            options={servizi} />
            </div>
            <div className="rounded-md border card-container sm:hidden">
            {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <div className="sm:hidden small-card"
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    <div className="flex justify-between align-center">
                                        <div className="flex flex-col">
                                            <span className="font-bold">{row.getValue("name")}</span>
                                            <span>{toChiusura(row.getValue("availability"))}</span>
                                        </div>
                                        {ActionsComponent(row)}
                                    </div>
                                    {ServiziComponent(row)}
                                </div>
                            ))
                        ) : (
                            <div className="sm:hidden">
                    Nothing to show!
                    </div>
                        )}
            </div>
            <div className="rounded-md border grid-container hidden sm:block">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className={cn(header.id == "actions" ? "w-1" : undefined)}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
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
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )

    
}


function List() {

    function loadAule(): string[] {
        const storedAulas = localStorage.getItem(FAV_AULE_STORAGE_KEY);
        if (storedAulas) {
            return JSON.parse(storedAulas);
        }
        return [];
    }
    
    const [favoritedAulas, setFavoritedAulas] = useState<string[]>(() => loadAule());
    useEffect(() => {
        localStorage.setItem(FAV_AULE_STORAGE_KEY, JSON.stringify(favoritedAulas));
    }, [favoritedAulas]);



    function toggleAula(aula: string) {
        if (favoritedAulas.includes(aula)) {
            const newAulas = favoritedAulas.filter((aulaFav) => aulaFav !== aula);
            setFavoritedAulas(newAulas);
        } else {
            setFavoritedAulas([...favoritedAulas, aula]);
        }
    }



    return <DataTableDemo/>;
}

export default List;