'use strict';
import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';

export type ServiceColumn = {
	id: string;
	name: string;
	name_ar: string;
	category: string;
	experts: string;

};

export const columns: ColumnDef<ServiceColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Service_Name___________________________________',
	},
	{
		accessorKey: 'name_ar',
		header: 'Service_Arabic_Name___________________________________',
	},
	{
		accessorKey: 'category',
		header: 'Category___________________________________',
	},
	{
		accessorKey: 'experts',
		header: 'Experts___________________________________',
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];