'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
// Define the CategoryColumn type with all required properties
export interface CaseColumn {
	id: string;
	industry: string;
	title: string;
	title_ar: string;
	sub_title: string;
	sub_title_ar: string;
	paragraph_1: string;
	paragraph_1_ar: string;
	paragraph_2: string;
	paragraph_2_ar: string;
	caseStudyPoint: string[];
	caseStudyPointAr: string[];
}

export const columns: ColumnDef<CaseColumn>[] = [
	{
		accessorKey: 'title',
		header: 'Title_in_English',
	},
	{
		accessorKey: 'title_ar',
		header: 'Title_Arabic_Name',
	},

	{
		header: 'Actions',
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];