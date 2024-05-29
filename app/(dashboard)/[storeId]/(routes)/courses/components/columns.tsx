'use client';
import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';
import { Decimal } from '@prisma/client/runtime';

// Define the ProductColumn type with all required properties
export interface ProductColumn {
	id: string;
	name: string;
	name_ar: string;
	intro: string;
	intro_ar: string;
	short_intro: string;
	short_intro_ar: string;
	duaration: string;
	duration_ar: string;
	who_sh_att: string;
	who_sh_att_ar: string;
	c_obje: string;
	c_obje_ar: string;
	c_obje_list: string;
	c_obje_list_ar: string;
	c_content: string;
	c_content_ar: string;
	wh_we_bnfi: string;
	wh_we_bnfi_ar: string;
	c_in_house: string;
	c_in_house_ar: string;
	delv_and_leaders: string;
	delv_and_leaders_ar: string;
	category: string;
	course_type: string;
	course_type_ar: string;
	course_date: string;
	course_date_ar: string;
	certification: string;
	certification_ar: string;
	price_egp: Decimal;
	price_ksa: Decimal;
	price_uae: Decimal;
	price_usd: Decimal;
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
		accessorKey: 'c_obje_list_ar',
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
		accessorKey: 'course_type',
		header: 'Course_Type_____________________________________________________________________',
	},
	{
		accessorKey: 'course_type_ar',
		header: 'Course_Type_in_Arabic_____________________________________________________________________',
	},
	{
		accessorKey: 'course_date',
		header: 'Course_Date_____________________________________________________________________',
	},
	{
		accessorKey: 'course_date_ar',
		header: 'Course_Date_in_Arabic_____________________________________________________________________',
	},
	{
		accessorKey: 'certification',
		header: 'Course_Certification___________________________________',
	},
	{
		accessorKey: 'price_egp',
		header: 'Course_Price in Egypt___________________________________',
	},
	{
		accessorKey: 'price_ksa',
		header: 'Course_Price in KSA___________________________________',
	},
	{
		accessorKey: 'price_uae',
		header: 'Course_Price in UAE___________________________________',
	},
	{
		accessorKey: 'price_usd',
		header: 'Course_Price in USD___________________________________',
	},
	{
		accessorKey: 'category',
		header: 'Course_Category___________________________________',
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
