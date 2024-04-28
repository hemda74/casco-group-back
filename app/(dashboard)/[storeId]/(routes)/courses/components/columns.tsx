'use client';
import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';

export type ProductColumn = {
	id: string;
	name: string;
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
	price: string;
	category: string;
};

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
		accessorKey: 'c_content',
		header: 'course_Content___________________________________',
	},
	{
		accessorKey: 'c_content_ar',
		header: 'course_Content_in_Arabic___________________________________',
	},
	{
		accessorKey: 'wh_we_bnfi',
		header: 'what_we_benefit___________________________________',
	},
	{
		accessorKey: 'wh_we_bnfi_ar',
		header: 'what_we_benefit_in_Arabic___________________________________',
	},
	{
		accessorKey: 'c_in_house',
		header: 'Course_in_house___________________________________',
	},
	{
		accessorKey: 'c_in_house_ar',
		header: 'Course_in_house_in_Arabic___________________________________',
	},
	{
		accessorKey: 'delv_and_leaders',
		header: 'Style_of_Delivery_and_Course_Leaders___________________________________',
	},
	{
		accessorKey: 'delv_and_leaders_ar',
		header: 'Style_of_Delivery_and_Course_Leaders_in_Arabic___________________________________',
	},
	{
		accessorKey: 'certification',
		header: 'Course_Certification___________________________________',
	},
	{
		accessorKey: 'price',
		header: 'Course_Price___________________________________',
	},
	{
		accessorKey: 'category',
		header: 'Course_Category___________________________________',
	},

	{
		accessorKey: 'date_and_rev_1',
		header: 'Course_Date_1___________________________________',
	},
	{
		accessorKey: 'date_and_rev_2',
		header: 'Course_Date_2___________________________________',
	},
	{
		accessorKey: 'date_and_rev_3',
		header: 'Course_Date_3___________________________________',
	},
	{
		accessorKey: 'date_and_rev_4',
		header: 'Course_Date_4___________________________________',
	},
	{
		accessorKey: 'date_and_rev_5',
		header: 'Course_Date_5___________________________________',
	},
	{
		accessorKey: 'date_and_rev_6',
		header: 'Course_Date_6___________________________________',
	},

	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
