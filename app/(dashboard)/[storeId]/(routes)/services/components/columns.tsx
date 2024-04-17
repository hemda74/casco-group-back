'use client';
import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';

export type ProductColumn = {
	id: string;
	name: string;
	name_ar: string;
	title: string;
	title_ar: string;
	explanation: string;
	explanation_2: string;
	explanation_2_ar: string;
	explanation_ar: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Course_Name___________________________________',
	},
	{
		accessorKey: 'name_ar',
		header: 'Course_Arabic_Name___________________________________',
	},
	{
		accessorKey: 'title',
		header: 'Service_title___________________________________',
	},
	{
		accessorKey: 'title_ar',
		header: 'Service_title_in_Arabic___________________________________',
	},
	{
		accessorKey: 'explanation',
		header: 'explanation_1___________________________________',
	},
	{
		accessorKey: 'explanation_ar',
		header: 'explanation_1_in_Arabic___________________________________',
	},
	{
		accessorKey: 'explanation',
		header: 'explanation_2___________________________________',
	},
	{
		accessorKey: 'explanation_ar',
		header: 'explanation_2_in_Arabic___________________________________',
	},

	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
