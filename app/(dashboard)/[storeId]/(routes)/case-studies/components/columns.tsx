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
		accessorKey: 'sub_title',
		header: 'sub_Title_in_English',
	},
	{
		accessorKey: 'sub_title_ar',
		header: 'sub_Title_Arabic_Name',
	},
	{
		accessorKey: 'paragraph_1',
		header: 'First_paragraph',
	},
	{
		accessorKey: 'paragraph_1_ar',
		header: 'First_paragraph_in_Arabic',
	},
	{
		accessorKey: 'paragraph_2',
		header: 'Second_paragraph',
	},
	{
		accessorKey: 'paragraph_2_ar',
		header: 'Second_paragraph_in_Arabic',
	},
	{
		accessorKey: 'industry',
		header: 'Industry',
	},
	{
		id: 'caseStudyPoint',
		header: 'Case_Study_Point',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.caseStudyPoint.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'caseStudyPointAr',
		header: 'Case_Study_Point',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.caseStudyPointAr.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		header: 'Actions',
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];