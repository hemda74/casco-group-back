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
			name
		} = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}

		if (!name) {
			return new NextResponse('Name is required', {
				status: 400,
			});
		}
		if (!name_ar) {
			return new NextResponse(' Arabic Name is required', {
				status: 400,
			});
		}
		if (!price) {
			return new NextResponse('Price is required', {
				status: 400,
			});
		}

		if (!categoryId) {
			return new NextResponse('Category id is required', {
				status: 400,
			});
		}
		if (!intro) {
			return new NextResponse('intro is required', {
				status: 400,
			});
		}
		if (!intro_ar) {
			return new NextResponse(
				'introduction in arabic is required',
				{
					status: 400,
				}
			);
		}
		if (!duaration) {
			return new NextResponse('duaration is required', {
				status: 400,
			});
		}
		if (!duration_ar) {
			return new NextResponse(
				'duaration in arabic is required',
				{
					status: 400,
				}
			);
		}
		if (!who_sh_att) {
			return new NextResponse(
				'who should attend is required',
				{
					status: 400,
				}
			);
		}
		if (!who_sh_att_ar) {
			return new NextResponse(
				'who should attend in arabic is required',
				{
					status: 400,
				}
			);
		}
		if (!c_obje) {
			return new NextResponse(
				'service objective is required',
				{
					status: 400,
				}
			);
		}
		if (!c_obje_ar) {
			return new NextResponse(
				'service objective in arabic is required',
				{
					status: 400,
				}
			);
		}
		if (!c_content) {
			return new NextResponse('service conetent is required', {
				status: 400,
			});
		}
		if (!c_content_ar) {
			return new NextResponse(
				'service conetent in arabic is required',
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

		const product = await prismadb.service.create({
			data: {
				storeId: params.storeId,
				images: {
					createMany: {
						
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
		const colorId = searchParams.get('colorId') || undefined;
		const sizeId = searchParams.get('sizeId') || undefined;
		const isFeatured = searchParams.get('isFeatured');

		if (!params.storeId) {
			return new NextResponse('Store id is required', {
				status: 400,
			});
		}

		const services = await prismadb.service.findMany({
			where: {
				storeId: params.storeId,
				categoryId,
			},
			include: {
				category: true,
			},
			orderBy: {
				name: 'desc',
			},
		});

		return NextResponse.json(services);
	} catch (error) {
		console.log('[serviceS_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
