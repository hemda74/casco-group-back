'use strict';
import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';

export type ServiceColumn = {
	id: string;
	name: string;
	name_ar: string;
	category: string;
	experts: string[];
	title: string[];
	title_ar: string[];
	desc_1: string[];
	desc_2: string[];
	desc_1_ar: string[];
	desc_2_ar: string[];
	createdAt: string;
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
		id: 'experts',
		header: 'experts___________________________________',
		cell: ({ row }) => row.original.experts.join('___________________________________'),
	},
	{
		id: 'title',
		header: 'Title_in_English___________________________________',
		cell: ({ row }) => row.original.title.join('___________________________________'),
	}, {
		id: 'desc_1',
		header: 'First_Description_in_English___________________________________',
		cell: ({ row }) => row.original.desc_1.join('___________________________________'),
	}, {
		id: 'desc_2',
		header: 'Second_Description_in_English___________________________________',
		cell: ({ row }) => row.original.desc_2.join('___________________________________'),
	},
	{
		id: 'title_ar',
		header: 'Title_in_Arabic___________________________________',
		cell: ({ row }) => row.original.title_ar.join('___________________________________'),
	}, {
		id: 'desc_1_ar',
		header: 'First_Description_in_Arabic___________________________________',
		cell: ({ row }) => row.original.desc_1_ar.join('___________________________________'),
	}, {
		id: 'desc_2_ar',
		header: 'Second_Description_in_Arabic___________________________________',
		cell: ({ row }) => row.original.desc_2_ar.join('___________________________________'),
	},
	{
		accessorKey: 'createdAt',
		header: 'Date',
	},
	{
		accessorKey: 'Actions',
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];