import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
type industryRequestBody = {
	name: string;
	name_ar: string;
	expertIndustry: {
		expert_name: string;
		expert_name_ar: string;
		expert_phone: string;
		expert_mail: string;
		expert_title: string;
		expert_title_ar: string;
		imageUrl: string;
		store: { connect: { id: number } };
	}[];
	industryDetailes: {
		title: string;
		title_ar: string;
		industryDetailesPoint: {
			text: string;
		}[];
		industryDetailesPointAr: {
			text: string;
		}[];
	}[];
	industryDetailes2: {
		title: string;
		title_ar: string;
		industryDetailesPoint2: {
			text: string;
		}[];
		industryDetailesPointAr2: {
			text: string;
		}[];
	}[];
};

export async function POST(req: Request, { params }: { params: {} }) {
	try {
		const body: industryRequestBody = await req.json();
		const {
			name,
			name_ar,
			expertIndustry,
			industryDetailes,
			industryDetailes2,
		} = body;

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

		const category = await prismadb.industry.create({
			data: {
				name,
				name_ar,

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
							imageUrl: expert.imageUrl,
						})
					),
				},
				industryDetailes: {
					create: industryDetailes.map((i) => ({
						title: i.title,
						title_ar: i.title_ar,

						industryDetailesPoint: {
							create: i.industryDetailesPoint.map(
								(point) => ({
									text: point.text,
								})
							),
						},
						industryDetailesPointAr: {
							create: i.industryDetailesPointAr.map(
								(point) => ({
									text: point.text,
								})
							),
						},
					})),
				},
				industryDetailes2: {
					create: industryDetailes2.map((i) => ({
						title: i.title,
						title_ar: i.title_ar,

						industryDetailesPoint2: {
							create: i.industryDetailesPoint2.map(
								(point) => ({
									text: point.text,
								})
							),
						},
						industryDetailesPointAr2: {
							create: i.industryDetailesPointAr2.map(
								(point) => ({
									text: point.text,
								})
							),
						},
					})),
				},
			},
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
			},
		});

		return NextResponse.json(category);
	} catch (error) {
		console.log('[CATEGORIES_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function GET(req: Request, { params }: { params: {} }) {
	try {
		const categories = await prismadb.industry.findMany({});

		return NextResponse.json(categories);
	} catch (error) {
		console.log('[CATEGORIES_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { industryid: number } }
) {
	try {
		const body: industryRequestBody = await req.json();
		const {
			name,
			name_ar,
			industryDetailes,
			industryDetailes2,
			expertIndustry,
		} = body;

		if (!name || !name_ar) {
			return new NextResponse(
				'Name, Arabic Name are required',
				{ status: 400 }
			);
		}

		const updatedindustry = await prismadb.$transaction(
			async (prisma) => {
				await prisma.industryDetailes.deleteMany({
					where: {
						industryId: params.industryid,
					},
				});
				await prisma.industryDetailes2.deleteMany({
					where: {
						industryId: params.industryid,
					},
				});
				await prisma.expertIndustry.deleteMany({
					where: {
						industryId: params.industryid,
					},
				});

				const industry = await prisma.industry.update({
					where: { id: params.industryid },
					data: {
						name,
						name_ar,

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
									imageUrl: expert.imageUrl,
								})
							),
						},
						industryDetailes: {
							create: industryDetailes.map(
								(i) => ({
									title: i.title,
									title_ar: i.title_ar,

									industryDetailesPoint:
										{
											create: i.industryDetailesPoint.map(
												(
													point
												) => ({
													text: point.text,
												})
											),
										},
									industryDetailesPointAr:
										{
											create: i.industryDetailesPointAr.map(
												(
													point
												) => ({
													text: point.text,
												})
											),
										},
								})
							),
						},
						industryDetailes2: {
							create: industryDetailes2.map(
								(i) => ({
									title: i.title,
									title_ar: i.title_ar,

									industryDetailesPoint2:
										{
											create: i.industryDetailesPoint2.map(
												(
													point
												) => ({
													text: point.text,
												})
											),
										},
									industryDetailesPointAr2:
										{
											create: i.industryDetailesPointAr2.map(
												(
													point
												) => ({
													text: point.text,
												})
											),
										},
								})
							),
						},
					},
					include: {
						industryDetailes: {
							include: {
								industryDetailesPoint:
									true,
								industryDetailesPointAr:
									true,
							},
						},
						industryDetailes2: {
							include: {
								industryDetailesPoint2:
									true,
								industryDetailesPointAr2:
									true,
							},
						},
					},
				});
			}
		);

		return NextResponse.json(updatedindustry);
	} catch (error) {
		console.error('[industry_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { categoryid: number } }
) {
	try {
		await prismadb.industry.delete({
			where: {
				id: params.categoryid,
			},
		});

		return new NextResponse('Category deleted successfully', {
			status: 200,
		});
	} catch (error) {
		console.log('[CATEGORIES_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
