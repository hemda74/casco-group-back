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
		accessorKey: 'date_of_news',
		header: 'English_Date',
	},
	{
		accessorKey: 'date_of_news_ar',
		header: 'Arabic_Date',
	},
	{
		id: 'paragraphs',
		header: 'Paragraphs',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.paragraph_news.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'paragraphs',
		header: 'Paragraphs',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.paragraph_news_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},

	{
		accessorKey: 'category',
		header: 'Category',
	},
	{
		accessorKey: 'createdAt',
		header: 'Created_Date',
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
