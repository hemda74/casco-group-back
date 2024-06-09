'use client';
import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';
import { Decimal } from '@prisma/client/runtime';

// Define the CategoryColumn type with all required properties
export interface CategoryColumn {
	id: string;
	name: string;
	name_ar: string;
	billboardLabel: string;

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
		accessorKey: 'billboardLabel',
		header: 'Billboard',
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
