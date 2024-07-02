import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

type ServiceRequestBody = {
	name: string;
	name_ar: string;
	serviceDesc: {
		title: string;
		desc_1: string;
		desc_2: string;
		store: { connect: { id: string } };
	}[];
	serviceDescAr: {
		title_ar: string;
		desc_1_ar: string;
		desc_2_ar: string;
		store: { connect: { id: string } };
	}[];
	expertService: {
		expert_name: string;
		expert_name_ar: string;
		expert_phone: string;
		expert_mail: string;
		expert_title: string;
		expert_title_ar: string;
		imageUrl: string;
		store: { connect: { id: string } };
	}[];
	categoryId: string;
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

		if (!name || !name_ar || !categoryId) {
			return new NextResponse(
				'Name, Arabic Name and Category ID are required',
				{ status: 400 }
			);
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: params.storeId, userId },
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', {
				status: 405,
			});
		}

		const service = await prismadb.$transaction(async (prisma) => {
			const createdService = await prisma.service.create({
				data: {
					storeId: params.storeId,
					name,
					name_ar,
					categoryId,
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
								imageUrl: expert.imageUrl,
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

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}

		const services = await prismadb.service.findMany({
			where: { storeId: params.storeId },
			include: {
				serviceDesc: true,
				serviceDescAr: true,
				expertService: true,
			},
		});

		return NextResponse.json(services);
	} catch (error) {
		console.error('[SERVICE_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; serviceId: string } }
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

		if (!name || !name_ar || !categoryId) {
			return new NextResponse(
				'Name, Arabic Name and Category ID are required',
				{ status: 400 }
			);
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: params.storeId, userId },
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', {
				status: 405,
			});
		}

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

				const service = await prisma.service.update({
					where: { id: params.serviceId },
					data: {
						name,
						name_ar,
						categoryId,
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
									imageUrl: expert.imageUrl,
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
								})
							),
						},
					},
				});
				return service;
			}
		);

		return NextResponse.json(updatedService);
	} catch (error) {
		console.error('[SERVICE_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { storeId: string; serviceId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: params.storeId, userId },
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', {
				status: 405,
			});
		}

		const deletedService = await prismadb.service.delete({
			where: { id: params.serviceId },
		});

		return NextResponse.json(deletedService);
	} catch (error) {
		console.error('[SERVICE_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
