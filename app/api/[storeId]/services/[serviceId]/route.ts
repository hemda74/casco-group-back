import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

type ServicePatchRequestBody = {
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
		name: string;
		name_ar: string;
		phone: string;
		mail: string;
		title: string;
		title_ar: string;
		imageUrl: string;
		store: { connect: { id: string } };
	}[];
};

type ServicePostRequestBody = {
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
		name: string;
		name_ar: string;
		phone: string;
		mail: string;
		title: string;
		title_ar: string;
		imageUrl: string;
		store: { connect: { id: string } };
	}[];
};

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();

		const body: ServicePostRequestBody = await req.json();

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
			return new NextResponse(' Arabic Name is required', {
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
								name: expert.name,
								name_ar: expert.name_ar,
								title: expert.title,
								title_ar: expert.title_ar,
								phone: expert.phone,
								mail: expert.mail,
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
					serviceDesc: true,
					serviceDescAr: true,
					expertService: true,
				},
			});

			return createdService;
		});

		return NextResponse.json(service);
	} catch (error) {
		console.log('[SERVICE_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { serviceId: string } }
) {
	try {
		if (!params.serviceId) {
			return new NextResponse('Service id is required', {
				status: 400,
			});
		}

		const service = await prismadb.service.findUnique({
			where: {
				id: params.serviceId,
			},
			include: {
				category: true,
				serviceDesc: true,
				serviceDescAr: true,
				expertService: true,
			},
		});

		return NextResponse.json(service);
	} catch (error) {
		console.log('[SERVICE_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { serviceId: string; storeId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}

		if (!params.serviceId) {
			return new NextResponse('Service id is required', {
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

		const service = await prismadb.service.delete({
			where: {
				id: params.serviceId,
			},
		});

		return NextResponse.json(service);
	} catch (error) {
		console.log('[SERVICE_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { serviceId: string; storeId: string } }
) {
	try {
		const { userId } = auth();

		const body: ServicePatchRequestBody = await req.json();

		const {
			categoryId,
			name,
			name_ar,
			serviceDesc,
			serviceDescAr,
			expertService,
		} = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}

		if (!params.serviceId) {
			return new NextResponse('Service Id is required', {
				status: 400,
			});
		}

		if (!name) {
			return new NextResponse('Name is required', {
				status: 400,
			});
		}
		if (!name_ar) {
			return new NextResponse('Name is required', {
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

		// Delete existing serviceDesc and serviceDescAr records
		await prismadb.serviceDesc.deleteMany({
			where: {
				serviceId: params.serviceId,
			},
		});

		await prismadb.serviceDescAr.deleteMany({
			where: {
				serviceId: params.serviceId,
			},
		});
		await prismadb.expertService.deleteMany({
			where: {
				serviceId: params.serviceId,
			},
		});

		// Update the service
		const updatedService = await prismadb.service.update({
			where: {
				id: params.serviceId,
			},
			data: {
				categoryId,
				name,
				name_ar,
				serviceDesc: {
					create: serviceDesc.map((desc) => ({
						title: desc.title,
						desc_1: desc.desc_1,
						desc_2: desc.desc_2,
						store: {
							connect: {
								id: params.storeId,
							},
						},
					})),
				},
				serviceDescAr: {
					create: serviceDescAr.map((descAr) => ({
						title_ar: descAr.title_ar,
						desc_1_ar: descAr.desc_1_ar,
						desc_2_ar: descAr.desc_2_ar,
						store: {
							connect: {
								id: params.storeId,
							},
						},
					})),
				},
				expertService: {
					create: expertService.map((expert) => ({
						imageUrl: expert.imageUrl,
						name: expert.name,
						name_ar: expert.name_ar,
						title: expert.title,
						title_ar: expert.title_ar,
						phone: expert.phone,
						mail: expert.mail,
						store: {
							connect: {
								id: params.storeId,
							},
						},
					})),
				},
			},
			include: {
				serviceDesc: true,
				serviceDescAr: true,
				expertService: true,
			},
		});

		return NextResponse.json(updatedService);
	} catch (error) {
		console.log('[SERVICE_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
