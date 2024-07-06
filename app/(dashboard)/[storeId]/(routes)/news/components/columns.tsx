'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
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
		header: 'News_title',
	},
	{
		accessorKey: 'title_ar',
		header: 'News_Arabic_title',
	},
	{
		header: 'Actions',
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
