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
			name,
			name_ar,
			title,
			title_ar,
			brief_1,
			brief_2,
			brief_3,
			brief_1_ar,
			brief_2_ar,
			brief_3_ar,
			teamId,
			images,
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
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!title) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!title_ar) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!brief_1) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!brief_1_ar) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!brief_2) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!brief_2_ar) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!brief_3) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!brief_3_ar) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!images || !images.length) {
			return new NextResponse('Images are required', {
				status: 400,
			});
		}
		if (!teamId) {
			return new NextResponse('team id is required', {
				status: 400,
			});
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

		const product = await prismadb.teamMember.create({
			data: {
				name,
				name_ar,
				teamId,
				title,
				title_ar,
				brief_1,
				brief_2,
				brief_3,
				brief_1_ar,
				brief_2_ar,
				brief_3_ar,
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
		const teamId = searchParams.get('teamId') || undefined;

		if (!params.storeId) {
			return new NextResponse('Store id is required', {
				status: 400,
			});
		}

		const courses = await prismadb.teamMember.findMany({
			where: {
				storeId: params.storeId,
				teamId,
			},
			include: {
				images: true,
				team: true,
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
