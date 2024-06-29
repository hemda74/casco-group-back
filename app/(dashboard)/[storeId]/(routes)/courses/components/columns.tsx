"use client"
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Decimal } from '@prisma/client/runtime';

export type CourseColumn = {
	id: string;
	c_title: string;
	c_title_ar: string;
	category: string;
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
	c_certification_en: string[];
	c_certification_ar: string[];
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
		accessorKey: 'category',
		header: 'Course_Category',
	},
	{
		accessorKey: 'c_short_intro_en',
		header: 'Course_English_short_intro',
	},
	{
		accessorKey: 'c_short_intro_ar',
		header: 'Course_Arabicshort_intro',
	},
	{
		accessorKey: 'c_duration_en',
		header: 'Course_English_duration',
	},
	{
		accessorKey: 'c_duration_ar',
		header: 'Course_Arabicshort_duration',
	},
	{
		accessorKey: 'c_in_house_en',
		header: 'Course_English_in_house',
	},
	{
		accessorKey: 'c_in_house_ar',
		header: 'Course_Arabicshort_in_house',
	},
	{
		accessorKey: 'c_delv_and_leaders_en',
		header: 'Course_English_delv_and_leaders',
	},
	{
		accessorKey: 'c_delv_and_leaders_ar',
		header: 'Course_Arabicshort_delv_and_leaders',
	},
	{
		id: 'c_intro_en',
		header: 'Course_intro_en',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.c_intro_en.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'c_intro_ar',
		header: 'Course_intro_ar',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.c_intro_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'c_content_en',
		header: 'Course_content_en',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.c_content_en.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'c_content_ar',
		header: 'Course_content_ar',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.c_content_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'c_who_should_en',
		header: 'Course_who_should_en',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.c_who_should_en.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'c_who_should_ar',
		header: 'Course_who_should_ar',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.c_who_should_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'c_objective_en',
		header: 'Course_objective_en',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.c_objective_en.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'c_objective_ar',
		header: 'Course_objective_ar',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.c_objective_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'c_benefit_en',
		header: 'Course_benefit_en',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.c_benefit_en.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'c_benefit_ar',
		header: 'Course_benefit_ar',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.c_benefit_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'c_date_en',
		header: 'Course_date_en',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.c_date_en.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'c_date_ar',
		header: 'Course_date_ar',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.c_date_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'c_certification_en',
		header: 'Course_certification_en',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.c_certification_en.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		id: 'c_certification_ar',
		header: 'Course_certification_ar',
		cell: ({ row }) => (
			<div dangerouslySetInnerHTML={{ __html: row.original.c_certification_ar.join('<br><hr style="margin-top: 20px;margin-bottom: 20px;">') }} />
		),
	},
	{
		accessorKey: 'price_egp',
		header: 'Course_Price in Egypt',
	},
	{
		accessorKey: 'price_ksa',
		header: 'Course_Price in KSA',
	},
	{
		accessorKey: 'price_uae',
		header: 'Course_Price in UAE',
	},
	{
		accessorKey: 'price_usd',
		header: 'Course_Price in USD',
	},
	{
		accessorKey: 'category',
		header: 'Course_Category',
	},
	{
		accessorKey: 'Actions',
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
