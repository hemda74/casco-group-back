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
		// expert_imageUrl: string;
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
								// expert_imageUrl:
								// 	expert.expert_imageUrl,
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
