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
		header: 'Member_Name___________________________________',
	},
	{
		accessorKey: 'name_ar',
		header: 'Member_Arabic_Name___________________________________',
	},
	{
		accessorKey: 'title',
		header: 'Title_in_English___________________________________',
	},
	{
		accessorKey: 'title_ar',
		header: 'Title_Arabic_Name___________________________________',
	},
	{
		accessorKey: 'brief_1',
		header: 'First_Brief___________________________________',
	},
	{
		accessorKey: 'brief_1_ar',
		header: 'First_Brief_in_Arabic___________________________________',
	},
	{
		accessorKey: 'brief_2',
		header: 'Second_Brief___________________________________',
	},
	{
		accessorKey: 'brief_2_ar',
		header: 'Second_Brief_in_Arabic___________________________________',
	}, {
		accessorKey: 'brief_3',
		header: 'Third_Brief___________________________________',
	},
	{
		accessorKey: 'brief_3_ar',
		header: 'Third_Brief_in_Arabic___________________________________',
	},
	{
		accessorKey: 'team',
		header: 'Team___________________________________',
	},
	{
		id: 'actions___________________________________',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];