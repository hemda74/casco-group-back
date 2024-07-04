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
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.title.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'desc_1',
		header: 'First_Description_in_English',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.desc_1.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'desc_2',
		header: 'Second_Description_in_English',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.desc_2.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'title_ar',
		header: 'Title_in_Arabic',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.title_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'desc_1_ar',
		header: 'First_Description_in_Arabic',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.desc_1_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'desc_2_ar',
		header: 'Second_Description_in_Arabic',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.desc_2_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'expert_name',
		header: 'Expert_Name',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.expert_name.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'expert_name_ar',
		header: 'Expert_Name_in_Arabic',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.expert_name_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'expert_title',
		header: 'Expert_Title',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.expert_title.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'expert_title_ar',
		header: 'Expert_Title_in_Arabic',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.expert_title_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'expert_phone',
		header: 'Expert_Phone',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.expert_phone.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'expert_mail',
		header: 'Expert_Mail',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.expert_mail.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		accessorKey: 'createdAt',
		header: 'Created_At',
	},
	{
		header: 'Actions',
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
