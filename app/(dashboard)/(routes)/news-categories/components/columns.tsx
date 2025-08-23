'use client';

import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';

export type CategoryColumn = {
	id: string;
	name: string;
	name_ar: string;
	createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'name_ar',
		header: ' Arabic Name',
	},

	{
		accessorKey: 'createdAt',
		header: 'Date',
	},
	{
		header: 'Actions',
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
