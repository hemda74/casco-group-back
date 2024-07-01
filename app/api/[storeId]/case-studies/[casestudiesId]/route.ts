import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function GET(
	req: Request,
	{ params }: { params: { casestudiesId: string } }
) {
	try {
		if (!params.casestudiesId) {
			return new NextResponse('course id is required', {
				status: 400,
			});
		}

		const course = await prismadb.caseStudy.findUnique({
			where: {
				id: params.casestudiesId,
			},
			include: {
				industry: true,
			},
		});

		return NextResponse.json(course);
	} catch (error) {
		console.log('[course_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { casestudiesId: string; storeId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}

		if (!params.casestudiesId) {
			return new NextResponse('course id is required', {
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

		const course = await prismadb.caseStudy.delete({
			where: {
				id: params.casestudiesId,
			},
		});

		return NextResponse.json(course);
	} catch (error) {
		console.log('[course_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { casestudiesId: string; storeId: string } }
) {
	try {
		const { userId } = auth();

		const body = await req.json();

		const {
			sub_title,
			sub_title_ar,
			industryId,
			imageUrl,
			title,
			title_ar,
			paragraph_1,
			paragraph_1_ar,
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
		if (!sub_title) {
			return new NextResponse('sub_title is required', {
				status: 400,
			});
		}
		if (!sub_title_ar) {
			return new NextResponse(
				' Arabic sub_title is required',
				{
					status: 400,
				}
			);
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
		if (!imageUrl) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!industryId) {
			return new NextResponse('industryIdd is required', {
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

		await prismadb.caseStudy.update({
			where: {
				id: params.casestudiesId,
			},
			data: {
				sub_title,
				sub_title_ar,
				title,
				title_ar,
				paragraph_1,
				paragraph_1_ar,
				paragraph_2,
				paragraph_2_ar,
				industryId,
				imageUrl,
				caseStudyPoint: { deleteMany: {} },
				caseStudyPointAr: { deleteMany: {} },
			},
		});

		const course = await prismadb.caseStudy.update({
			where: {
				id: params.casestudiesId,
			},
			data: {
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

		return NextResponse.json(course);
	} catch (error) {
		console.log('[course_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
