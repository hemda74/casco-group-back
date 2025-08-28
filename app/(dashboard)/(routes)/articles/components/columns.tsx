'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
// Define the ProductColumn type with all required properties
export interface ProductColumn {
	id: number;
	title: string;
	title_ar: string;
	category: string;
	date_of_event: string;
	date_of_event_ar: string;
	paragraph_event: string[];
	paragraph_event_ar: string[];
	createdAt: string;
}
export const columns: ColumnDef<ProductColumn>[] = [
	{
		accessorKey: 'title',
		header: 'Article_title',
	},
	{
		accessorKey: 'title_ar',
		header: 'Article_Arabic_title',
	},

	{
		header: 'Actions',
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
