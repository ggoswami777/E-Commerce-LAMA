"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/TablePagination";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { User } from "@clerk/nextjs/server";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange:setRowSelection,
    state: {
      sorting,
      rowSelection
    },
  });

  console.log(rowSelection);
  const {getToken}=useAuth();
  const router=useRouter();
  const mutation=useMutation({
    mutationFn:async()=>{
      const token=await getToken();
      const selectedRows=table.getSelectedRowModel().rows;
      const userIds=selectedRows.map((row)=>{
        return (row.original as User).id;
      });

     
      const deletePromises = userIds.map(async (id) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error(`Failed to delete user with ID ${id}`);
        }
      });

      await Promise.all(deletePromises);
    },
    onSuccess:()=>{
      toast.success("User deleted successfully")
      table.resetRowSelection();
      router.refresh();
    },
    onError:(err)=>{
      toast.error("Failed to delete user")
    }
  })
  return (
    <div className="rounded-md border">
      {
        Object.keys(rowSelection).length>0 && <div className="flex justify-end">
          <button disabled={mutation.isPending} onClick={()=>mutation.mutate()} className="flex items-center bg-red-500 text-white px-2 py-1 text-sm rounded-md m-4 cursor-pointer"><Trash2 className="w-4 h04 
          "/>{mutation.isPending?"Deleting":"Delete User(s)"}</button>
        </div>
      }
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
      
      <DataTablePagination table={table} />
    </div>
  );
}
