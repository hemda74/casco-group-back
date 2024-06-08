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
	paragraph_news: string[];
	paragraph_news_ar: string[];
	createdAt: string;
	date_of_news: string;
	date_of_news_ar: string;
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
		accessorKey: 'date_of_news',
		header: 'English_Date___________________________________',
	},
	{
		accessorKey: 'date_of_news_ar',
		header: 'Arabic_Date___________________________________',
	},
	{
		id: 'paragraphs',
		header: 'Paragraphs___________________________________',
		cell: ({ row }) => row.original.paragraph_news.join('___________________________________'),
	},
	{
		id: 'paragraphs',
		header: 'Paragraphs___________________________________',
		cell: ({ row }) => row.original.paragraph_news_ar.join('___________________________________'),
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
