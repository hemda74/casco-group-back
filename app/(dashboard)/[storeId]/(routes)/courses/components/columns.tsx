'use client';
import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';

export type ProductColumn = {
	id: string;
	name: string;
	price: string;
	category: string;
	name_ar: string;
	intro: string;
	intro_ar: string;
	duaration: string;
	duration_ar: string;
	who_sh_att: string;
	who_sh_att_ar: string;
	c_obje: string;
	c_obje_ar: string;
	c_content: string;
	c_content_ar: string;
	wh_we_bnfi: string;
	wh_we_bnfi_ar: string;
	c_in_house: string;
	c_in_house_ar: string;
	delv_and_leaders: string;
	delv_and_leaders_ar: string;
	date_and_rev: string;
	date_and_rev_ar: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Course_Name',
	},
	{
		accessorKey: 'name_ar',
		header: 'Course_Arabic_Name',
	},
	{
		accessorKey: 'intro',
		header: 'Course_Introduction',
	},
	{
		accessorKey: 'intro_ar',
		header: 'Introduction_in_Arabic',
	},
	{
		accessorKey: 'duaration',
		header: 'Course_duration',
	},
	{
		accessorKey: 'duration_ar',
		header: 'Course_duration_in_Arabic',
	},
	{
		accessorKey: 'who_sh_att',
		header: 'who_should_attend_this_course',
	},
	{
		accessorKey: 'who_sh_att_ar',
		header: 'who_should_attend_this_course_in_Arabic',
	},
	{
		accessorKey: 'c_obje',
		header: 'course_objective',
	},
	{
		accessorKey: 'c_obje_ar',
		header: 'course_objective_in_Arabic',
	},
	{
		accessorKey: 'c_content',
		header: 'course_Content',
	},
	{
		accessorKey: 'c_content_ar',
		header: 'course_Content_in_Arabic',
	},
	{
		accessorKey: 'wh_we_bnfi',
		header: 'what_we_benefit',
	},
	{
		accessorKey: 'wh_we_bnfi_ar',
		header: 'what_we_benefit_in_Arabic',
	},
	{
		accessorKey: 'c_in_house',
		header: 'Course_in_house',
	},
	{
		accessorKey: 'c_in_house_ar',
		header: 'Course_in_house_in_Arabic',
	},
	{
		accessorKey: 'delv_and_leaders',
		header: 'Style_of_Delivery_and_Course_Leaders',
	},
	{
		accessorKey: 'delv_and_leaders_ar',
		header: 'Style_of_Delivery_and_Course_Leaders_in_Arabic',
	},
	{
		accessorKey: 'price',
		header: 'Course_Price',
	},
	{
		accessorKey: 'category',
		header: 'Course_Category',
	},

	{
		accessorKey: 'date_and_rev',
		header: 'Course_Date_1',
	},
	{
		accessorKey: 'date_and_rev_ar',
		header: 'Course_Date_2',
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
