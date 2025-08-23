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
		store: { connect: { id: string } };
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

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
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

		if (!params.storeId) {
			return new NextResponse('Store id is required', {
				status: 400,
			});
		}

		const category = await prismadb.industry.create({
			data: {
				name,
				name_ar,
				store: {
					connect: { id: params.storeId },
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
							imageUrl: expert.imageUrl,
							store: {
								connect: {
									id: params.storeId,
								},
							},
						})
					),
				},
				industryDetailes: {
					create: industryDetailes.map((i) => ({
						title: i.title,
						title_ar: i.title_ar,
						store: {
							connect: {
								id: params.storeId,
							},
						},
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
						store: {
							connect: {
								id: params.storeId,
							},
						},
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

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		if (!params.storeId) {
			return new NextResponse('Store id is required', {
				status: 400,
			});
		}

		const categories = await prismadb.industry.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(categories);
	} catch (error) {
		console.log('[CATEGORIES_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; industryId: string } }
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

		const storeBy = await prismadb.store.findFirst({
			where: { id: params.storeId },
		});

		const updatedindustry = await prismadb.$transaction(
			async (prisma) => {
				await prisma.industryDetailes.deleteMany({
					where: {
						industryId: params.industryId,
					},
				});
				await prisma.industryDetailes2.deleteMany({
					where: {
						industryId: params.industryId,
					},
				});
				await prisma.expertIndustry.deleteMany({
					where: {
						industryId: params.industryId,
					},
				});

				const industry = await prisma.industry.update({
					where: { id: params.industryId },
					data: {
						name,
						name_ar,
						store: {
							connect: {
								id: params.storeId,
							},
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
									imageUrl: expert.imageUrl,
									store: {
										connect: {
											id: params.storeId,
										},
									},
								})
							),
						},
						industryDetailes: {
							create: industryDetailes.map(
								(i) => ({
									title: i.title,
									title_ar: i.title_ar,
									store: {
										connect: {
											id: params.storeId,
										},
									},
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
									store: {
										connect: {
											id: params.storeId,
										},
									},
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
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	try {
		if (!params.storeId || !params.categoryId) {
			return new NextResponse(
				'Store id and category id are required',
				{
					status: 400,
				}
			);
		}

		await prismadb.industry.delete({
			where: {
				id: params.categoryId,
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
