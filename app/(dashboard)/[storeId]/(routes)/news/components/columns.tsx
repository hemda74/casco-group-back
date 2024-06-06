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
	paragraph: string[];

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
		id: 'paragraphs',
		header: 'Paragraphs___________________________________',
		cell: ({ row }) => row.original.paragraph.join(', '),
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
