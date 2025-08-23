import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

type IndustryRequestBody = {
	name: string;
	name_ar: string;
	industryDetailes: {
		title: string;
		title_ar: string;
		industryDetailesPoint: { text: string }[];
		industryDetailesPointAr: { text: string }[];
	}[];
	industryDetailes2: {
		title: string;
		title_ar: string;
		industryDetailesPoint2: { text: string }[];
		industryDetailesPointAr2: { text: string }[];
	}[];
	expertIndustry: {
		expert_imageUrl: string;
		expert_name: string;
		expert_name_ar: string;
		expert_title: string;
		expert_title_ar: string;
		expert_phone: string;
		expert_mail: string;
		imageUrl: string;
	}[];
};

const validateRequestBody = (body: IndustryRequestBody) => {
	const { name, name_ar } = body;

	if (!name) throw new Error('Name is required');
	if (!name_ar) throw new Error('Arabic Name is required');
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
		 
		const body: IndustryRequestBody = await req.json();

		const { name, name_ar } = body;

		 

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

	 

		const industry = await prismadb.$transaction(async (prisma) => {
			const createdIndustry = await prisma.industry.create({
				data: {
					name,
					name_ar,
					store: {
						connect: { id: params.storeId },
					},

					industryDetailes: {
						create: body.industryDetailes.map(
							(deta) => ({
								title: deta.title,
								title_ar: deta.title_ar,
								industryDetailesPoint:
									{
										create: deta.industryDetailesPoint.map(
											(
												point
											) => ({
												text: point.text,
											})
										),
									},
								industryDetailesPointAr:
									{
										create: deta.industryDetailesPointAr.map(
											(
												point
											) => ({
												text: point.text,
											})
										),
									},
								store: {
									connect: {
										id: params.storeId,
									},
								},
							})
						),
					},
					industryDetailes2: {
						create: body.industryDetailes2.map(
							(deta2) => ({
								title: deta2.title,
								title_ar: deta2.title_ar,
								industryDetailesPoint2:
									{
										create: deta2.industryDetailesPoint2.map(
											(
												point2
											) => ({
												text: point2.text,
											})
										),
									},
								industryDetailesPointAr2:
									{
										create: deta2.industryDetailesPointAr2.map(
											(
												pointAr2
											) => ({
												text: pointAr2.text,
											})
										),
									},
								store: {
									connect: {
										id: params.storeId,
									},
								},
							})
						),
					},
					expertIndustry: {
						create: body.expertIndustry.map(
							(expert) => ({
								expert_imageUrl:
									expert.expert_imageUrl,
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
								imageUrl: expert.imageUrl,
								store: {
									connect: {
										id: params.storeId,
									},
								},
							})
						),
					},
				},
				include: {
					industryDetailes: true,
					industryDetailes2: true,
					expertIndustry: true,
				},
			});

			return createdIndustry;
		});

		return new NextResponse(JSON.stringify(industry), {
			status: 200,
		});
	} catch (error: any) {
		console.log('[INDUSTRY_POST] Error:', error.message);
		console.log('[INDUSTRY_POST] Error Stack:', error.stack);
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
			return new NextResponse('Industry id is required', {
				status: 400,
			});

		const industry = await prismadb.industry.findUnique({
			where: { id: params.industryId },
			include: {
				industryDetailes: {
					include: {
						industryDetailesPoint: true,
						industryDetailesPointAr: true,
					},
				},
				industryDetailes2: {
					include: {
						industryDetailesPoint2: true,
						industryDetailesPointAr2: true,
					},
				},
				expertIndustry: true,
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
		 
		if (! )
			return new NextResponse('Unauthenticated', {
				status: 403,
			});

		if (!params.industryId)
			return new NextResponse('Industry id is required', {
				status: 400,
			});

		 

		if (!storeBy )
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
		 
		if (! )
			return new NextResponse('Unauthenticated', {
				status: 403,
			});

		const body: IndustryRequestBody = await req.json();
		validateRequestBody(body);

		if (!params.industryId)
			return new NextResponse('Industry Id is required', {
				status: 400,
			});

		 

		if (!storeBy )
			return new NextResponse('Unauthorized', {
				status: 405,
			});

		// Delete all related IndustryDetailesPoint and IndustryDetailesPointAr records
		const industryDetailsIds = (
			await prismadb.industryDetailes.findMany({
				where: { industryId: params.industryId },
				select: { id: true },
			})
		).map((detail) => detail.id);

		await prismadb.industryDetailesPoint.deleteMany({
			where: {
				industrydetailesId: { in: industryDetailsIds },
			},
		});
		await prismadb.industryDetailesPointAr.deleteMany({
			where: {
				industrydetailesId: { in: industryDetailsIds },
			},
		});

		const industryDetails2Ids = (
			await prismadb.industryDetailes2.findMany({
				where: { industryId: params.industryId },
				select: { id: true },
			})
		).map((detail) => detail.id);

		await prismadb.industryDetailesPoint2.deleteMany({
			where: { detaId: { in: industryDetails2Ids } },
		});
		await prismadb.industryDetailesPointAr2.deleteMany({
			where: { detaId: { in: industryDetails2Ids } },
		});

		// Delete all related IndustryDetailes and IndustryDetailes2 records
		await prismadb.industryDetailes.deleteMany({
			where: { industryId: params.industryId },
		});
		await prismadb.industryDetailes2.deleteMany({
			where: { industryId: params.industryId },
		});

		// Delete all related ExpertIndustry records
		await prismadb.expertIndustry.deleteMany({
			where: { industryId: params.industryId },
		});

		// Update the industry with the new details
		const updatedIndustry = await prismadb.industry.update({
			where: { id: params.industryId },
			data: {
				name: body.name,
				name_ar: body.name_ar,
				industryDetailes: {
					create: body.industryDetailes.map(
						(deta) => ({
							title: deta.title,
							title_ar: deta.title_ar,
							industryDetailesPoint: {
								create: deta.industryDetailesPoint.map(
									(
										point
									) => ({
										text: point.text,
									})
								),
							},
							industryDetailesPointAr:
								{
									create: deta.industryDetailesPointAr.map(
										(
											point
										) => ({
											text: point.text,
										})
									),
								},
							store: {
								connect: {
									id: params.storeId,
								},
							},
						})
					),
				},
				industryDetailes2: {
					create: body.industryDetailes2.map(
						(deta2) => ({
							title: deta2.title,
							title_ar: deta2.title_ar,
							industryDetailesPoint2:
								{
									create: deta2.industryDetailesPoint2.map(
										(
											point2
										) => ({
											text: point2.text,
										})
									),
								},
							industryDetailesPointAr2:
								{
									create: deta2.industryDetailesPointAr2.map(
										(
											pointAr2
										) => ({
											text: pointAr2.text,
										})
									),
								},
							store: {
								connect: {
									id: params.storeId,
								},
							},
						})
					),
				},
				expertIndustry: {
					create: body.expertIndustry.map(
						(expert) => ({
							expert_imageUrl:
								expert.expert_imageUrl,
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
							imageUrl: expert.imageUrl,
							store: {
								connect: {
									id: params.storeId,
								},
							},
						})
					),
				},
			},
			include: {
				industryDetailes: true,
				industryDetailes2: true,
				expertIndustry: true,
			},
		});

		return new NextResponse(JSON.stringify(updatedIndustry), {
			status: 200,
		});
	} catch (error) {
		return handleErrorResponse(error);
	}
}
