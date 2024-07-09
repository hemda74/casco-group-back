'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
// Define the CategoryColumn type with all required properties
export interface CategoryColumn {
	id: string;
	name: string;
	name_ar: string;
	linkedin: string;
	phone: string;
	address: string;
	address_ar: string;
}
export const columns: ColumnDef<CategoryColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Team_Name',
	},
	{
		accessorKey: 'name_ar',
		header: 'Team_Arabic_Name',
	},
	{
		header: 'Actions',
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
