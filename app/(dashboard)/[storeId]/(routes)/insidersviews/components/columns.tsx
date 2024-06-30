"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type InsidersViewColumn = {
  id: string
  name: string;
  name_ar: string;
  title: string;
  title_ar: string;
  text: string;
  text_ar: string;
}

export const columns: ColumnDef<InsidersViewColumn>[] = [
  {
    accessorKey: "name",
    header: "name",
  },
  {
    accessorKey: "name_ar",
    header: "name_ar",
  },
  {
    accessorKey: "title",
    header: "title",
  },
  {
    accessorKey: "title_ar",
    header: "title_ar",
  },
  {
    accessorKey: "text",
    header: "text",
  },
  {
    accessorKey: "text_ar",
    header: "text_ar",
  },

  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
