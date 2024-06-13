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
		header: 'Service Name',
	},
	{
		accessorKey: 'name_ar',
		header: 'Service Arabic Name',
	},
	{
		accessorKey: 'category',
		header: 'Category',
	},
	{
		id: 'experts',
		header: 'Experts',
		cell: ({ row }) => row.original.experts.join(', '),
	},
	{
		id: 'title',
		header: 'Title in English',
		cell: ({ row }) => row.original.title.join(', '),
	},
	{
		id: 'desc_1',
		header: 'First Description in English',
		cell: ({ row }) => row.original.desc_1.join(', '),
	},
	{
		id: 'desc_2',
		header: 'Second Description in English',
		cell: ({ row }) => row.original.desc_2.join(', '),
	},
	{
		id: 'title_ar',
		header: 'Title in Arabic',
		cell: ({ row }) => row.original.title_ar.join(', '),
	},
	{
		id: 'desc_1_ar',
		header: 'First Description in Arabic',
		cell: ({ row }) => row.original.desc_1_ar.join(', '),
	},
	{
		id: 'desc_2_ar',
		header: 'Second Description in Arabic',
		cell: ({ row }) => row.original.desc_2_ar.join(', '),
	},
	{
		accessorKey: 'createdAt',
		header: 'Created At',
	},
	{
		accessorKey: 'Actions',
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
