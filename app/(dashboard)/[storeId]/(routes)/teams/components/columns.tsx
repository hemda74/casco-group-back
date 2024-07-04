'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
// Define the CategoryColumn type with all required properties
export interface CategoryColumn {
	id: string;
	name: string;
	name_ar: string;
	billboardLabel: string;
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
		accessorKey: 'linkedin',
		header: 'Team_linkedin',
	},
	{
		accessorKey: 'phone',
		header: 'Team_Phone',
	},
	{
		accessorKey: 'address',
		header: 'Team_Address',
	}, {
		accessorKey: 'address_ar',
		header: 'Team_Address_in_arabic',
	},
	{
		accessorKey: 'billboardLabel',
		header: 'Billboard',
	},
	{
		header: 'Actions',
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
