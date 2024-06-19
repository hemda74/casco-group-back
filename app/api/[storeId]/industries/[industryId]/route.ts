import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

type industryRequestBody = {
	categoryId: string;
	name: string;
	name_ar: string;
	expertIndustry: {
		expert_imageUrl: string;
		expert_name: string;
		expert_name_ar: string;
		expert_title: string;
		expert_title_ar: string;
		expert_phone: string;
		expert_mail: string;
		images: {
			url: string;
		}[];
	}[];
};

const validateRequestBody = (body: industryRequestBody) => {
	const { name, name_ar, categoryId } = body;

	if (!name) throw new Error('Name is required');
	if (!name_ar) throw new Error('Arabic Name is required');
	if (!categoryId) throw new Error('Category id is required');
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

		const { name, name_ar, expertIndustry, categoryId } = body;

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
			return new NextResponse('Arabic Name is required', {
				status: 400,
			});
		}

		if (!categoryId) {
			return new NextResponse('Category id is required', {
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
			const createdindustry = await prisma.industry.create({
				data: {
					name,
					name_ar,
					store: {
						connect: { id: params.storeId },
					},
					category: {
						connect: { id: categoryId },
					},

					expertIndustry: {
						create: expertIndustry.map(
							(expert) => ({
								expert_name:
									expert.expert_name,
								expert_name_ar:
									expert.expert_name_ar,
								expert_title:
									expert.expert_title,
								expert_title_ar:
									expert.expert_title_ar,
								expert_phone:
									expert.expert_phone,
								expert_mail:
									expert.expert_mail,
								store: {
									connect: {
										id: params.storeId,
									},
								},
								images: {
									create: expert.images.map(
										(
											image
										) => ({
											url: image.url,
										})
									),
								},
							})
						),
					},
				},
				include: {
					expertIndustry: {
						include: {
							images: true,
						},
					},
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
	{ params }: { params: { industryId: string } }
) {
	try {
		if (!params.industryId)
			return new NextResponse('industry id is required', {
				status: 400,
			});

		const industry = await prismadb.industry.findUnique({
			where: { id: params.industryId },
			include: {
				category: true,
				expertIndustry: {
					include: {
						images: true,
					},
				},
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
	{ params }: { params: { industryId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId)
			return new NextResponse('Unauthenticated', {
				status: 403,
			});

		if (!params.industryId)
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

		const industry = await prismadb.industry.delete({
			where: { id: params.industryId },
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
	{ params }: { params: { industryId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId)
			return new NextResponse('Unauthenticated', {
				status: 403,
			});

		const body: industryRequestBody = await req.json();
		validateRequestBody(body);

		if (!params.industryId)
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
				await prisma.expertIndustry.deleteMany({
					where: {
						industryId: params.industryId,
					},
				});

				const updatedindustry =
					await prisma.industry.update({
						where: {
							id: params.industryId,
						},
						data: {
							categoryId: body.categoryId,
							name: body.name,
							name_ar: body.name_ar,
							expertIndustry: {
								create: body.expertIndustry.map(
									(
										expert
									) => ({
										...expert,
										store: {
											connect: {
												id: params.storeId,
											},
										},
										images: {
											create: expert.images.map(
												(
													image
												) => ({
													url: image.url,
												})
											),
										},
									})
								),
							},
						},
						include: {
							expertIndustry: {
								include: {
									images: true,
								},
							},
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
