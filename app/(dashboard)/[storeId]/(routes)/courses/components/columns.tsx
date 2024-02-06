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
		header: 'Name',
	},
	{
		accessorKey: 'name_ar',
		header: 'Arabic Name',
	},
	{
		accessorKey: 'intro',
		header: 'Introduction',
	},
	{
		accessorKey: 'intro_ar',
		header: 'Introduction in Arabic',
	},
	{
		accessorKey: 'duaration',
		header: 'Course duration in Arabic',
	},
	{
		accessorKey: 'duaration_ar',
		header: 'Course duration in Arabic',
	},
	{
		accessorKey: 'who_sh_att',
		header: 'who_should_attend this course',
	},
	{
		accessorKey: 'who_sh_att_ar',
		header: 'who_should_attend this course in Arabic',
	},
	{
		accessorKey: 'c_obje',
		header: 'course objective',
	},
	{
		accessorKey: 'c_obje_ar',
		header: 'course objective in Arabic',
	},
	{
		accessorKey: 'c_content',
		header: 'course Content',
	},
	{
		accessorKey: 'c_content_ar',
		header: 'course Content in Arabic',
	},
	{
		accessorKey: 'wh_we_bnfi',
		header: 'what we benefit',
	},
	{
		accessorKey: 'wh_we_bnfi_ar',
		header: 'what we benefit in Arabic',
	},
	{
		accessorKey: 'c_in_house',
		header: 'Course in house',
	},
	{
		accessorKey: 'c_in_house_ar',
		header: 'Course in house in Arabic',
	},
	{
		accessorKey: 'delv_and_leaders',
		header: 'Style of Delivery and Course Leaders',
	},
	{
		accessorKey: 'delv_and_leaders_ar',
		header: 'Style of Delivery and Course Leaders in Arabic',
	},
	{
		accessorKey: 'price',
		header: 'Price',
	},
	{
		accessorKey: 'category',
		header: 'Category',
	},

	{
		accessorKey: 'date_and_rev',
		header: 'Date',
	},
	{
		accessorKey: 'date_and_rev_ar',
		header: 'Date',
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
