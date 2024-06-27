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
	paragraph_title: string[];
	paragraph_title_ar: string[];
	paragraph_points: string[];
	paragraph_points_ar: string[];
	how_can_help_title: string[];
	how_can_help_title_ar: string[];
	how_can_help_points: string[];
	how_can_help_points_ar: string[];
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
		id: 'expert_name_ar',
		header: 'Experts_Names_in_Arabic',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.expert_name_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'expert_mail',
		header: 'Experts_Mails',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.expert_mail.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'expert_phone',
		header: 'Experts_Phones',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.expert_phone.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'paragraph_title',
		header: 'paragraph_Title_in_(English)',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.paragraph_title.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'paragraph_title_ar',
		header: 'paragraph_title_in_(Arabic)',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.paragraph_title_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'paragraph_points',
		header: 'Paragraph_Points_in_(English)',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.paragraph_points.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'paragraph_points_ar',
		header: 'Paragraph_Points_in_(Arabic)',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.paragraph_points_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'how_can_help_title',
		header: 'how_can_help_Title_in_(English)',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.how_can_help_title.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'how_can_help_title_ar',
		header: 'how_can_help_title_in_(Arabic)',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.how_can_help_title_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'how_can_help_points',
		header: 'how_can_help_Points_in_(English)',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.how_can_help_points.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'how_can_help_points_ar',
		header: 'how_can_help_Points_in_(Arabic)',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.how_can_help_points_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		accessorKey: 'Actions',
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
