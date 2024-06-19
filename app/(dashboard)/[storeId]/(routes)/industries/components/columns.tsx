import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export type IndustryColumn = {
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
};

export const columns: ColumnDef<IndustryColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Industry_Name',
	},
	{
		accessorKey: 'name_ar',
		header: 'Industry_Arabic_Name',
	},
	{
		accessorKey: 'category',
		header: 'Industry_Category',
	},
	{
		id: 'Experts_Names',
		header: 'expert_name',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.expert_name.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'Experts_Names_in_Arabic',
		header: 'expert_name_ar',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.expert_name_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'Experts_Mails',
		header: 'expert_mail',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.expert_mail.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'Experts_Phones',
		header: 'expert_phone',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.expert_phone.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		accessorKey: 'Actions',
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
