import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function GET(
	req: Request,
	{ params }: { params: { newsId: string } }
) {
	try {
		if (!params.newsId) {
			return new NextResponse('news id is required', {
				status: 400,
			});
		}

		const news = await prismadb.news.findUnique({
			where: {
				id: params.newsId,
			},
			include: {
				images: true,
				category: true,

				// color: true,
			},
		});

		return NextResponse.json(news);
	} catch (error) {
		console.log('[news_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { newsId: string; storeId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}

		if (!params.newsId) {
			return new NextResponse('news id is required', {
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

		const news = await prismadb.news.delete({
			where: {
				id: params.newsId,
			},
		});

		return NextResponse.json(news);
	} catch (error) {
		console.log('[news_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { newsId: string; storeId: string } }
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

		await prismadb.news.update({
			where: {
				id: params.newsId,
			},
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
				images: {
					deleteMany: {},
				},
			},
		});

		const news = await prismadb.news.update({
			where: {
				id: params.newsId,
			},
			data: {
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

		return NextResponse.json(news);
	} catch (error) {
		console.log('[news_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
