'use client';
import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';
import { Decimal } from '@prisma/client/runtime';

// Define the ProductColumn type with all required properties
export interface ProductColumn {
	id: string;
	title: string;
	title_ar: string;

}

export const columns: ColumnDef<ProductColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Course_Name___________________________________',
	},
	{
		accessorKey: 'name_ar',
		header: 'Course_Arabic_Name___________________________________',
	},
	{
		accessorKey: 'short_intro',
		header: 'Course_Short_Description___________________________________',
	},
	{
		accessorKey: 'short_intro_ar',
		header: 'Course_Short_Description_in_Arabic___________________________________',
	},
	{
		accessorKey: 'intro',
		header: 'Course_Introduction___________________________________',
	},
	{
		accessorKey: 'intro_ar',
		header: 'Introduction_in_Arabic___________________________________',
	},
	{
		accessorKey: 'duaration',
		header: 'Course_duration___________________________________',
	},
	{
		accessorKey: 'duration_ar',
		header: 'Course_duration_in_Arabic___________________________________',
	},
	{
		accessorKey: 'who_sh_att',
		header: 'who_should_attend_this_course___________________________________',
	},
	{
		accessorKey: 'who_sh_att_ar',
		header: 'who_should_attend_this_course_in_Arabic___________________________________',
	},
	{
		accessorKey: 'c_obje',
		header: 'course_objective___________________________________',
	},
	{
		accessorKey: 'c_obje_ar',
		header: 'course_objective_in_Arabic___________________________________',
	},
	{
		accessorKey: 'c_obje_list',
		header: 'course_objective___________________________________',
	},

	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
