import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

type industryRequestBody = {
	industryId: string;
	title: string;
	title_ar: string;
	industryDetailesPoint: {
		text: string;
	}[];
	industryDetailesPointAr: {
		text: string;
	}[];
};

const validateRequestBody = (body: industryRequestBody) => {
	const { title, title_ar, industryId } = body;

	if (!title) throw new Error('title is required');
	if (!title_ar) throw new Error('Arabic title is required');
	if (!industryId) throw new Error('industry id is required');
};

const handleErrorResponse = (error: any) => {
	console.error(error);
	return new NextResponse('Internal error', { status: 500 });
};

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		const body: industryRequestBody = await req.json();

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

		const industry = await prismadb.$transaction(async (prisma) => {
			const createdindustry =
				await prisma.industryDetailes.create({
					data: {
						title,
						title_ar,
						store: {
							connect: {
								id: params.storeId,
							},
						},
						industry: {
							connect: {
								id: industryId,
							},
						},
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
								})
							),
						},
					},
					include: {
						industryDetailesPoint: true,
						industryDetailesPointAr: true,
					},
				});

			return createdindustry;
		});

		return new NextResponse(JSON.stringify(industry), {
			status: 200,
		});
	} catch (error: any) {
		console.log('[industry_POST] Error:', error.message);
		console.log('[industry_POST] Error Stack:', error.stack);
		return new NextResponse(`Internal error: ${error.message}`, {
			status: 500,
		});
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { industrydetailesId: string } }
) {
	try {
		if (!params.industrydetailesId)
			return new NextResponse('industry id is required', {
				status: 400,
			});

		const industry = await prismadb.industryDetailes.findUnique({
			where: { id: params.industrydetailesId },
			include: {
				industry: true,
				industryDetailesPoint: true,
				industryDetailesPointAr: true,
			},
		});

		return new NextResponse(JSON.stringify(industry), {
			status: 200,
		});
	} catch (error) {
		return handleErrorResponse(error);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { industrydetailesId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId)
			return new NextResponse('Unauthenticated', {
				status: 403,
			});

		if (!params.industrydetailesId)
			return new NextResponse('industry id is required', {
				status: 400,
			});

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId)
			return new NextResponse('Unauthorized', {
				status: 405,
			});

		const industry = await prismadb.industryDetailes.delete({
			where: { id: params.industrydetailesId },
		});

		return new NextResponse(JSON.stringify(industry), {
			status: 200,
		});
	} catch (error) {
		return handleErrorResponse(error);
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { industrydetailesId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId)
			return new NextResponse('Unauthenticated', {
				status: 403,
			});

		const body: industryRequestBody = await req.json();
		validateRequestBody(body);

		if (!params.industrydetailesId)
			return new NextResponse('industry Id is required', {
				status: 400,
			});

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId)
			return new NextResponse('Unauthorized', {
				status: 405,
			});

		const updatedindustry = await prismadb.$transaction(
			async (prisma) => {
				await prisma.industryDetailesPoint.deleteMany({
					where: {
						industrydetailesId:
							params.industrydetailesId,
					},
				});

				await prisma.industryDetailesPointAr.deleteMany(
					{
						where: {
							industrydetailesId:
								params.industrydetailesId,
						},
					}
				);

				const updatedindustry =
					await prisma.industryDetailes.update({
						where: {
							id: params.industrydetailesId,
						},
						data: {
							industryId: body.industryId,
							title: body.title,
							title_ar: body.title_ar,
							industryDetailesPoint: {
								create: body.industryDetailesPoint.map(
									(
										desc
									) => ({
										...desc,
									})
								),
							},
							industryDetailesPointAr:
								{
									create: body.industryDetailesPointAr.map(
										(
											descAr
										) => ({
											...descAr,
										})
									),
								},
						},
						include: {
							industryDetailesPoint:
								true,
							industryDetailesPointAr:
								true,
						},
					});

				return updatedindustry;
			}
		);

		return new NextResponse(JSON.stringify(updatedindustry), {
			status: 200,
		});
	} catch (error) {
		return handleErrorResponse(error);
	}
}
