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
	date_of_event: string;
	date_of_event_ar: string;
	paragraph_event: string[];
	paragraph_event_ar: string[];
	createdAt: string;
}

export const columns: ColumnDef<ProductColumn>[] = [
	{
		accessorKey: 'title',
		header: 'event_title',
	},
	{
		accessorKey: 'title_ar',
		header: 'event_Arabic_title',
	},
	{
		id: 'paragraphs',
		header: 'Paragraphs',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.paragraph_event.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'paragraphs',
		header: 'Paragraphs',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.paragraph_event_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
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
		accessorKey: 'date_of_event',
		header: 'Event_Date_in_English',
	},
	{
		accessorKey: 'date_of_event_ar',
		header: 'Event_Date_in_Arabic',
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
