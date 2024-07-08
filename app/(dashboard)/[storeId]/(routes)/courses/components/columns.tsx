"use client"
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Decimal } from '@prisma/client/runtime';

export type CourseColumn = {
	id: string;
	c_title: string;
	c_title_ar: string;
	category: string;
	CourseType: string;
	price_egp: Decimal;
	price_ksa: Decimal;
	price_uae: Decimal;
	price_usd: Decimal;
	c_short_intro_en: string;
	c_short_intro_ar: string;
	c_duration_en: string;
	c_duration_ar: string;
	c_in_house_en: string;
	c_in_house_ar: string;
	c_delv_and_leaders_en: string;
	c_delv_and_leaders_ar: string;
	c_intro_en: string[];
	c_intro_ar: string[];
	c_who_should_en: string[];
	c_who_should_ar: string[];
	c_objective_en: string[];
	c_objective_ar: string[];
	c_content_en: string[];
	c_content_ar: string[];
	c_benefit_en: string[];
	c_benefit_ar: string[];
	c_content2_en: string[];
	c_content2_ar: string[];
	c_date_en: string[];
	c_date_ar: string[];
};

export const columns: ColumnDef<CourseColumn>[] = [
	{
		accessorKey: 'c_title',
		header: 'Course_English_Title',
	},
	{
		accessorKey: 'c_title_ar',
		header: 'Course_Arabic_Title',
	},
	{
		header: 'Actions',
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
