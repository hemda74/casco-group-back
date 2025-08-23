"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type SizeColumn = {
  id: string
  name: string;
  name_ar: string;
}

export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "name_ar",
    header: "name_ar",
  },

  {
    header: 'Actions',
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
