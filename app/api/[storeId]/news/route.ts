import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();

		const body = await req.json();

		const {
			title,
			title_ar,
			images,
			paragraph_1,
			paragraph_1_ar,
			paragraph_2,
			paragraph_2_ar,
			paragraph_3,
			paragraph_3_ar,
			paragraph_4,
			paragraph_4_ar,
			paragraph_5,
			paragraph_5_ar,
			categoryId,
		} = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}
		if (!title) {
			return new NextResponse('Name is required', {
				status: 400,
			});
		}
		if (!title_ar) {
			return new NextResponse(' Arabic Name is required', {
				status: 400,
			});
		}
		if (!images || !images.length) {
			return new NextResponse('Images are required', {
				status: 400,
			});
		}

		if (!categoryId) {
			return new NextResponse('Category id is required', {
				status: 400,
			});
		}
		if (!paragraph_1) {
			return new NextResponse('intro is required', {
				status: 400,
			});
		}
		if (!paragraph_1_ar) {
			return new NextResponse(
				'introduction in arabic is required',
				{
					status: 400,
				}
			);
		}
		if (!paragraph_2) {
			return new NextResponse('intro is required', {
				status: 400,
			});
		}
		if (!paragraph_2_ar) {
			return new NextResponse(
				'introduction in arabic is required',
				{
					status: 400,
				}
			);
		}
		if (!paragraph_3) {
			return new NextResponse('intro is required', {
				status: 400,
			});
		}
		if (!paragraph_3_ar) {
			return new NextResponse(
				'introduction in arabic is required',
				{
					status: 400,
				}
			);
		}
		if (!paragraph_4) {
			return new NextResponse('intro is required', {
				status: 400,
			});
		}
		if (!paragraph_4_ar) {
			return new NextResponse(
				'introduction in arabic is required',
				{
					status: 400,
				}
			);
		}
		if (!paragraph_5) {
			return new NextResponse('intro is required', {
				status: 400,
			});
		}
		if (!paragraph_5_ar) {
			return new NextResponse(
				'introduction in arabic is required',
				{
					status: 400,
				}
			);
		}

		if (!params.storeId) {
			return new NextResponse('Store id is required', {
				status: 400,
			});
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', {
				status: 405,
			});
		}

		const product = await prismadb.news.create({
			data: {
				title,
				title_ar,
				paragraph_1,
				paragraph_1_ar,
				paragraph_2,
				paragraph_2_ar,
				paragraph_3,
				paragraph_3_ar,
				paragraph_4,
				paragraph_4_ar,
				paragraph_5,
				paragraph_5_ar,
				categoryId,
				storeId: params.storeId,
				images: {
					createMany: {
						data: [
							...images.map(
								(image: {
									url: string;
								}) => image
							),
						],
					},
				},
			},
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log('[PRODUCTS_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { searchParams } = new URL(req.url);
		const categoryId = searchParams.get('categoryId') || undefined;

		if (!params.storeId) {
			return new NextResponse('Store id is required', {
				status: 400,
			});
		}

		const courses = await prismadb.news.findMany({
			where: {
				storeId: params.storeId,
				categoryId,
			},
			include: {
				images: true,
				category: true,
			},
			orderBy: {
				title: 'desc',
			},
		});

		return NextResponse.json(courses);
	} catch (error) {
		console.log('[COURSES_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
