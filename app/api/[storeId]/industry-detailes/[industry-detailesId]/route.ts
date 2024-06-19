import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

type ServiceRequestBody = {
	categoryId: string;
	name: string;
	name_ar: string;
	serviceDesc: {
		title: string;
		desc_1: string;
		desc_2: string;
	}[];
	serviceDescAr: {
		title_ar: string;
		desc_1_ar: string;
		desc_2_ar: string;
	}[];
	expertService: {
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

const validateRequestBody = (body: ServiceRequestBody) => {
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
		const body: ServiceRequestBody = await req.json();

		const {
			name,
			name_ar,
			serviceDesc,
			serviceDescAr,
			expertService,
			categoryId,
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

		const service = await prismadb.$transaction(async (prisma) => {
			const createdService = await prisma.service.create({
				data: {
					name,
					name_ar,
					store: {
						connect: { id: params.storeId },
					},
					category: {
						connect: { id: categoryId },
					},
					serviceDesc: {
						create: serviceDesc.map(
							(desc) => ({
								title: desc.title,
								desc_1: desc.desc_1,
								desc_2: desc.desc_2,
								store: {
									connect: {
										id: params.storeId,
									},
								},
							})
						),
					},
					serviceDescAr: {
						create: serviceDescAr.map(
							(descAr) => ({
								title_ar: descAr.title_ar,
								desc_1_ar: descAr.desc_1_ar,
								desc_2_ar: descAr.desc_2_ar,
								store: {
									connect: {
										id: params.storeId,
									},
								},
							})
						),
					},
					expertService: {
						create: expertService.map(
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
					serviceDesc: true,
					serviceDescAr: true,
					expertService: {
						include: {
							images: true,
						},
					},
				},
			});

			return createdService;
		});

		return new NextResponse(JSON.stringify(service), {
			status: 200,
		});
	} catch (error: any) {
		console.log('[SERVICE_POST] Error:', error.message);
		console.log('[SERVICE_POST] Error Stack:', error.stack);
		return new NextResponse(`Internal error: ${error.message}`, {
			status: 500,
		});
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { serviceId: string } }
) {
	try {
		if (!params.serviceId)
			return new NextResponse('Service id is required', {
				status: 400,
			});

		const service = await prismadb.service.findUnique({
			where: { id: params.serviceId },
			include: {
				category: true,
				serviceDesc: true,
				serviceDescAr: true,
				expertService: {
					include: {
						images: true,
					},
				},
			},
		});

		return new NextResponse(JSON.stringify(service), {
			status: 200,
		});
	} catch (error) {
		return handleErrorResponse(error);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { serviceId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId)
			return new NextResponse('Unauthenticated', {
				status: 403,
			});

		if (!params.serviceId)
			return new NextResponse('Service id is required', {
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

		const service = await prismadb.service.delete({
			where: { id: params.serviceId },
		});

		return new NextResponse(JSON.stringify(service), {
			status: 200,
		});
	} catch (error) {
		return handleErrorResponse(error);
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { serviceId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId)
			return new NextResponse('Unauthenticated', {
				status: 403,
			});

		const body: ServiceRequestBody = await req.json();
		validateRequestBody(body);

		if (!params.serviceId)
			return new NextResponse('Service Id is required', {
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

		const updatedService = await prismadb.$transaction(
			async (prisma) => {
				await prisma.serviceDesc.deleteMany({
					where: { serviceId: params.serviceId },
				});

				await prisma.serviceDescAr.deleteMany({
					where: { serviceId: params.serviceId },
				});

				await prisma.expertService.deleteMany({
					where: { serviceId: params.serviceId },
				});

				const updatedService =
					await prisma.service.update({
						where: { id: params.serviceId },
						data: {
							categoryId: body.categoryId,
							name: body.name,
							name_ar: body.name_ar,
							serviceDesc: {
								create: body.serviceDesc.map(
									(
										desc
									) => ({
										...desc,
										store: {
											connect: {
												id: params.storeId,
											},
										},
									})
								),
							},
							serviceDescAr: {
								create: body.serviceDescAr.map(
									(
										descAr
									) => ({
										...descAr,
										store: {
											connect: {
												id: params.storeId,
											},
										},
									})
								),
							},
							expertService: {
								create: body.expertService.map(
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
							serviceDesc: true,
							serviceDescAr: true,
							expertService: {
								include: {
									images: true,
								},
							},
						},
					});

				return updatedService;
			}
		);

		return new NextResponse(JSON.stringify(updatedService), {
			status: 200,
		});
	} catch (error) {
		return handleErrorResponse(error);
	}
}
