import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

type ServiceRequestBody = {
	title: string;
	title_ar: string;
	industryDetailesPoint: {
		text: string;
	}[];
	industryDetailesPointAr: {
		text: string;
	}[];
	industryId: string;
};

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();

		const body: ServiceRequestBody = await req.json();

		const {
			title,
			title_ar,
			industryDetailesPoint,
			industryDetailesPointAr,
			industryId,
		} = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}

		if (!title) {
			return new NextResponse('title is required', {
				status: 400,
			});
		}
		if (!title_ar) {
			return new NextResponse('Arabic title is required', {
				status: 400,
			});
		}

		if (!industryId) {
			return new NextResponse('industry id is required', {
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

		const service = await prismadb.$transaction(async (prisma) => {
			const createdService =
				await prisma.industryDetailes.create({
					data: {
						storeId: params.storeId,
						title,
						title_ar,
						industryId,
						industryDetailesPoint: {
							create: industryDetailesPoint.map(
								(desc) => ({
									text: desc.text,
								})
							),
						},
						industryDetailesPointAr: {
							create: industryDetailesPointAr.map(
								(descAr) => ({
									text: descAr.text,

									store: {
										connect: {
											id: params.storeId,
										},
									},
								})
							),
						},
					},
				});

			return createdService;
		});

		return NextResponse.json(service);
	} catch (error) {
		console.error('[SERVICE_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
