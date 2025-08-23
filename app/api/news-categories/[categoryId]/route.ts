import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function GET(
	req: Request,
	{ params }: { params: { categoryId: string } }
) {
	try {
		if (!params.categoryId) {
			return new NextResponse('Category id is required', {
				status: 400,
			});
		}

		const category = await prismadb.newsCategory.findUnique({
			where: {
				id: params.categoryId,
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
	{ params }: { params: { categoryId: string; storeId: string } }
) {
	try {
		const {} = auth();

		if (!params.categoryId) {
			return new NextResponse('Category id is required', {
				status: 400,
			});
		}

		const category = await prismadb.newsCategory.delete({
			where: {
				id: params.categoryId,
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
	{ params }: { params: { categoryId: string; storeId: string } }
) {
	try {
		const {} = auth();

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
		if (!params.categoryId) {
			return new NextResponse('Category id is required', {
				status: 400,
			});
		}

		const category = await prismadb.newsCategory.update({
			where: {
				id: params.categoryId,
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
