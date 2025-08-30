import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function GET(
	req: Request,
	{ params }: { params: { categoryid: number } }
) {
	try {
		if (!params.categoryid) {
			return new NextResponse('Category id is required', {
				status: 400,
			});
		}

		const category = await prismadb.coursesCategory.findUnique({
			where: {
				id: params.categoryid,
			},
		});

		return NextResponse.json(category);
	} catch (error) {
		console.log('[CATEGORY_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { categoryid: number } }
) {
	try {
		if (!params.categoryid) {
			return new NextResponse('Category id is required', {
				status: 400,
			});
		}

		const category = await prismadb.coursesCategory.delete({
			where: {
				id: params.categoryid,
			},
		});

		return NextResponse.json(category);
	} catch (error) {
		console.log('[CATEGORY_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { categoryid: number } }
) {
	try {
		const body = await req.json();

		const { name, name_ar } = body;

		if (!name) {
			return new NextResponse('Name is required', {
				status: 400,
			});
		}
		if (!name_ar) {
			return new NextResponse('Arabic Name is required', {
				status: 400,
			});
		}

		if (!params.categoryid) {
			return new NextResponse('Category id is required', {
				status: 400,
			});
		}

		const category = await prismadb.coursesCategory.update({
			where: {
				id: params.categoryid,
			},
			data: {
				name,
				name_ar,
			},
		});

		return NextResponse.json(category);
	} catch (error) {
		console.log('[CATEGORY_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
