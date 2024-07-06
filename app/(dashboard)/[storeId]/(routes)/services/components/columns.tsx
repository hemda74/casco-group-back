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
		header: 'Actions',
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
