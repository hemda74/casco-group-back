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
			industryId,
			images,
			title,
			title_ar,
			sub_title,
			sub_title_ar,
			paragraph_1_ar,
			paragraph_1,
			paragraph_2,
			paragraph_2_ar,
			caseStudyPoint,
			caseStudyPointAr,
		} = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}

		if (!title_ar) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!title) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!sub_title) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!sub_title_ar) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!paragraph_2) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!paragraph_2_ar) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!paragraph_1) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!paragraph_1_ar) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!images || !images.length) {
			return new NextResponse('Images are required', {
				status: 400,
			});
		}
		if (!industryId) {
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

		const product = await prismadb.caseStudy.create({
			data: {
				title,
				title_ar,
				sub_title,
				sub_title_ar,
				paragraph_2,
				paragraph_2_ar,
				paragraph_1,
				paragraph_1_ar,
				industryId,
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
				caseStudyPoint: {
					createMany: {
						data: [
							...caseStudyPoint.map(
								(caseStudyPoint: {
									p1: string;
								}) =>
									caseStudyPoint
							),
						],
					},
				},
				caseStudyPointAr: {
					createMany: {
						data: [
							...caseStudyPointAr.map(
								(caseStudyPointAr: {
									p1: string;
								}) =>
									caseStudyPointAr
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
		const industryId = searchParams.get('industryId') || undefined;

		if (!params.storeId) {
			return new NextResponse('Store id is required', {
				status: 400,
			});
		}

		const teammember = await prismadb.caseStudy.findMany({
			where: {
				storeId: params.storeId,
				industryId,
			},
			include: {
				images: true,
				industry: true,
				caseStudyPoint: true,
				caseStudyPointAr: true,
			},
			orderBy: {
				title: 'desc',
			},
		});

		return NextResponse.json(teammember);
	} catch (error) {
		console.log('[COURSES_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
