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

		const {} = body;

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

		if (!images || !images.length) {
			return new NextResponse('Images are required', {
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
				'course objective is required',
				{
					status: 400,
				}
			);
		}
		if (!c_obje_ar) {
			return new NextResponse(
				'course objective in arabic is required',
				{
					status: 400,
				}
			);
		}
		if (!c_content) {
			return new NextResponse('course conetent is required', {
				status: 400,
			});
		}
		if (!c_content_ar) {
			return new NextResponse(
				'course conetent in arabic is required',
				{
					status: 400,
				}
			);
		}
		if (!wh_we_bnfi) {
			return new NextResponse('what we benefit is required', {
				status: 400,
			});
		}
		if (!wh_we_bnfi_ar) {
			return new NextResponse(
				'what we benefit in arabic is required',
				{
					status: 400,
				}
			);
		}
		if (!c_in_house) {
			return new NextResponse('course in house is required', {
				status: 400,
			});
		}
		if (!c_in_house_ar) {
			return new NextResponse('course in house is required', {
				status: 400,
			});
		}
		if (!date_and_rev_1) {
			return new NextResponse('date and revnue is required', {
				status: 400,
			});
		}
		if (!delv_and_leaders) {
			return new NextResponse(
				'delviary and course leaders is required',
				{
					status: 400,
				}
			);
		}
		if (!delv_and_leaders_ar) {
			return new NextResponse(
				'delviary and course leaders in arabic is required',
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

		const product = await prismadb.course.create({
			data: {
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
		const colorId = searchParams.get('colorId') || undefined;
		const sizeId = searchParams.get('sizeId') || undefined;
		const isFeatured = searchParams.get('isFeatured');

		if (!params.storeId) {
			return new NextResponse('Store id is required', {
				status: 400,
			});
		}

		const courses = await prismadb.course.findMany({
			where: {
				storeId: params.storeId,
				categoryId,
			},
			include: {
				images: true,
				category: true,
			},
			orderBy: {
				name: 'desc',
			},
		});

		return NextResponse.json(courses);
	} catch (error) {
		console.log('[COURSES_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
