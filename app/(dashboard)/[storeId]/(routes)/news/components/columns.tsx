'use client';
import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';
import { Decimal } from '@prisma/client/runtime';

// Define the ProductColumn type with all required properties
export interface ProductColumn {
	id: string;
	title: string;
	title_ar: string;
	category: string;
	paragraph_1: string;
	paragraph_1_ar: string;
	paragraph_2: string;
	paragraph_2_ar: string;
	paragraph_3: string;
	paragraph_3_ar: string;
	paragraph_4: string;
	paragraph_4_ar: string;
	paragraph_5: string;
	paragraph_5_ar: string;
}

export const columns: ColumnDef<ProductColumn>[] = [
	{
		accessorKey: 'title',
		header: 'News_title___________________________________',
	},
	{
		accessorKey: 'title_ar',
		header: 'News_Arabic_title___________________________________',
	},
	{
		accessorKey: 'paragraph_1',
		header: 'paragraph_1___________________________________',
	},
	{
		accessorKey: 'paragraph_1_ar',
		header: 'paragraph_1_in_Arabic___________________________________',
	},
	{
		accessorKey: 'paragraph_1',
		header: 'paragraph_1___________________________________',
	},
	{
		accessorKey: 'paragraph_1_ar',
		header: 'paragraph_1_in_Arabic___________________________________',
	}, {
		accessorKey: 'paragraph_1',
		header: 'paragraph_1___________________________________',
	},
	{
		accessorKey: 'paragraph_1_ar',
		header: 'paragraph_1_in_Arabic___________________________________',
	}, {
		accessorKey: 'paragraph_2',
		header: 'paragraph_2___________________________________',
	},
	{
		accessorKey: 'paragraph_3_ar',
		header: 'paragraph_3_in_Arabic___________________________________',
	}, {
		accessorKey: 'paragraph_4',
		header: 'paragraph_4___________________________________',
	},
	{
		accessorKey: 'paragraph_5_ar',
		header: 'paragraph_5_in_Arabic___________________________________',
	},
	{
		accessorKey: 'category',
		header: 'Category___________________________________',
	},

	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
