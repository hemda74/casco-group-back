'use client';
import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';
import { Decimal } from '@prisma/client/runtime';

// Define the CategoryColumn type with all required properties
export interface CategoryColumn {
	id: string;
	name: string;
	name_ar: string;
	team: string;
	title: string;
	title_ar: string;
	brief_1: string;
	brief_1_ar: string;
	brief_2: string;
	brief_2_ar: string;
	brief_3: string;
	brief_3_ar: string;
}

export const columns: ColumnDef<CategoryColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Member_Name',
	},
	{
		accessorKey: 'name_ar',
		header: 'Member_Arabic_Name',
	},

	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];