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
	paragraph_event: string[];
	paragraph_event_ar: string[];
	createdAt: string;

}

export const columns: ColumnDef<ProductColumn>[] = [
	{
		accessorKey: 'title',
		header: 'event_title___________________________________',
	},
	{
		accessorKey: 'title_ar',
		header: 'event_Arabic_title___________________________________',
	},
	{
		id: 'paragraphs',
		header: 'Paragraphs___________________________________',
		cell: ({ row }) => row.original.paragraph_event.join('___________________________________ '),
	},
	{
		id: 'paragraphs',
		header: 'Paragraphs___________________________________',
		cell: ({ row }) => row.original.paragraph_event_ar.join('___________________________________'),
	},

	{
		accessorKey: 'category',
		header: 'Category___________________________________',
	},
	{
		accessorKey: 'createdAt',
		header: 'Created_Date___________________________________',
	},

	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
