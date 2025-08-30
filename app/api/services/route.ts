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
		store: { connect: { id: number } };
	}[];
	serviceDescAr: {
		title_ar: string;
		desc_1_ar: string;
		desc_2_ar: string;
		store: { connect: { id: number } };
	}[];
	expertService: {
		expert_name: string;
		expert_name_ar: string;
		expert_phone: string;
		expert_mail: string;
		expert_title: string;
		expert_title_ar: string;
		imageUrl: string;
		store: { connect: { id: number } };
	}[];
};

export async function POST(req: Request, { params }: { params: {} }) {
	try {
		const {} = auth();
		const body: ServiceRequestBody = await req.json();
		const {
			name,
			name_ar,
			serviceDesc,
			serviceDescAr,
			expertService,
		} = body;

		if (!name || !name_ar) {
			return new NextResponse(
				'Name, Arabic Name and Category ID are required',
				{ status: 400 }
			);
		}

		const service = await prismadb.$transaction(async (prisma) => {
			const createdService = await prisma.service.create({
				data: {
					name,
					name_ar,

					serviceDesc: {
						create: serviceDesc.map(
							(desc) => ({
								title: desc.title,
								desc_1: desc.desc_1,
								desc_2: desc.desc_2,
							})
						),
					},
					serviceDescAr: {
						create: serviceDescAr.map(
							(descAr) => ({
								title_ar: descAr.title_ar,
								desc_1_ar: descAr.desc_1_ar,
								desc_2_ar: descAr.desc_2_ar,
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

export async function GET(req: Request, { params }: { params: {} }) {
	try {
		const categories = await prismadb.service.findMany({});

		return NextResponse.json(categories);
	} catch (error) {
		console.log('[CATEGORIES_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { serviceid: number } }
) {
	try {
		const {} = auth();
		const body: ServiceRequestBody = await req.json();
		const {
			name,
			name_ar,
			serviceDesc,
			serviceDescAr,
			expertService,
		} = body;

		if (!name || !name_ar) {
			return new NextResponse(
				'Name, Arabic Name and Category ID are required',
				{ status: 400 }
			);
		}

		const updatedService = await prismadb.$transaction(
			async (prisma) => {
				await prisma.serviceDesc.deleteMany({
					where: { serviceId: params.serviceid },
				});
				await prisma.serviceDescAr.deleteMany({
					where: { serviceId: params.serviceid },
				});
				await prisma.expertService.deleteMany({
					where: { serviceId: params.serviceid },
				});

				const service = await prisma.service.update({
					where: { id: params.serviceid },
					data: {
						name,
						name_ar,

						serviceDesc: {
							create: serviceDesc.map(
								(desc) => ({
									title: desc.title,
									desc_1: desc.desc_1,
									desc_2: desc.desc_2,
								})
							),
						},
						serviceDescAr: {
							create: serviceDescAr.map(
								(descAr) => ({
									title_ar: descAr.title_ar,
									desc_1_ar: descAr.desc_1_ar,
									desc_2_ar: descAr.desc_2_ar,
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
	{ params }: { params: { serviceid: number } }
) {
	try {
		const {} = auth();

		const deletedService = await prismadb.service.delete({
			where: { id: params.serviceid },
		});

		return NextResponse.json(deletedService);
	} catch (error) {
		console.error('[SERVICE_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
