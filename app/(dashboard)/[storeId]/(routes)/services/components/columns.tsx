import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type ServiceColumn = {
	id: string;
	name: string;
	name_ar: string;
	category: string;
	expert_name: string[];
	expert_name_ar: string[];
	expert_phone: string[];
	expert_mail: string[];
	expert_title: string[];
	expert_title_ar: string[];
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
		header: 'Service_Name',
	},
	{
		accessorKey: 'name_ar',
		header: 'Service_Arabic_Name',
	},
	{
		accessorKey: 'category',
		header: 'Service_Category',
	},
	{
		id: 'title',
		header: 'Title_in_English',
		cell: ({ row }) => row.original.title.join('_________'),
	},
	{
		id: 'desc_1',
		header: 'First_Description_in_English',
		cell: ({ row }) => row.original.desc_1.join('_________'),
	},
	{
		id: 'desc_2',
		header: 'Second_Description_in_English',
		cell: ({ row }) => row.original.desc_2.join('_________'),
	},
	{
		id: 'title_ar',
		header: 'Title_in_Arabic',
		cell: ({ row }) => row.original.title_ar.join('_________'),
	},
	{
		id: 'desc_1_ar',
		header: 'First_Description_in_Arabic',
		cell: ({ row }) => row.original.desc_1_ar.join('_________'),
	},
	{
		id: 'desc_2_ar',
		header: 'Second_Description_in_Arabic',
		cell: ({ row }) => row.original.desc_2_ar.join('_________'),
	},
	{
		id: 'expert_name',
		header: 'Expert_Name',
		cell: ({ row }) => row.original.expert_name.join('_________'),
	},
	{
		id: 'expert_name_ar',
		header: 'Expert_Name_in_Arabic',
		cell: ({ row }) => row.original.expert_name_ar.join('_________'),
	},
	{
		id: 'expert_title',
		header: 'Expert_Title',
		cell: ({ row }) => row.original.expert_title.join('_________'),
	},
	{
		id: 'expert_title_ar',
		header: 'Expert_Title_in_Arabic',
		cell: ({ row }) => row.original.expert_title_ar.join('_________'),
	},
	{
		id: 'expert_phone',
		header: 'Expert_Phone',
		cell: ({ row }) => row.original.expert_phone.join('_________'),
	},
	{
		id: 'expert_mail',
		header: 'Expert_Mail',
		cell: ({ row }) => row.original.expert_mail.join('_________'),
	},
	{
		accessorKey: 'createdAt',
		header: 'Created_At',
	},
	{
		accessorKey: 'Actions',
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
