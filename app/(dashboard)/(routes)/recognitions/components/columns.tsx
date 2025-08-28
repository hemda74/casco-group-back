"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type InsidersViewColumn = {
  id: number
  title: string;
  title_ar: string;
}

export const columns: ColumnDef<InsidersViewColumn>[] = [
  {
    accessorKey: "title",
    header: "title",
  },
  {
    accessorKey: "title_ar",
    header: "title_ar",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
