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
		header: 'Actions',
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
