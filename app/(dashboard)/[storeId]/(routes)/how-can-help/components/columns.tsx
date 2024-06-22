import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type ServiceColumn = {
	id: string;
	title: string;
	title_ar: string;
	industry: string;
	text_en: string[];
	text_ar: string[];
};

export const columns: ColumnDef<ServiceColumn>[] = [
	{
		accessorKey: 'title',
		header: 'Block_title',
	},
	{
		accessorKey: 'title_ar',
		header: 'Block_Arabic_title',
	},
	{
		accessorKey: 'industry',
		header: 'The_Connected_Industry',
	},
	{
		id: 'text_en',
		header: 'Points_in_English',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.text_en.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'text_ar',
		header: 'Points_in_Arabic',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.text_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		accessorKey: 'Actions',
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
