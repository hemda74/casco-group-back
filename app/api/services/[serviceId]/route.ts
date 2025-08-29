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
		imageUrl: string;
	}[];
};

const validateRequestBody = (body: ServiceRequestBody) => {
	const { name, name_ar } = body;

	if (!name) throw new Error('Name is required');
	if (!name_ar) throw new Error('Arabic Name is required');
};

const handleErrorResponse = (error: any) => {
	console.error(error);
	return new NextResponse('Internal error', { status: 500 });
};

export async function POST(req: Request, { params }: { params: {} }) {
	try {
		const body: ServiceRequestBody = await req.json();

		const {
			name,
			name_ar,
			serviceDesc,
			serviceDescAr,
			expertService,
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

		const service = await prismadb.$transaction(async (prisma) => {
			const createdService = await prisma.service.create({
				data: {
					name,
					name_ar,
					store: {
						connect: { id: params.storeId },
					},

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
				include: {
					serviceDesc: true,
					serviceDescAr: true,
					expertService: true,
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
	{ params }: { params: { serviceid: number } }
) {
	try {
		if (!params.serviceId)
			return new NextResponse('Service id is required', {
				status: 400,
			});

		const service = await prismadb.service.findUnique({
			where: { id: params.serviceId },
			include: {
				serviceDesc: true,
				serviceDescAr: true,
				expertService: true,
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
	{ params }: { params: { serviceid: number } }
) {
	try {
		if (!params.serviceId)
			return new NextResponse('Service id is required', {
				status: 400,
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
	{ params }: { params: { serviceid: number } }
) {
	try {
		const body: ServiceRequestBody = await req.json();
		validateRequestBody(body);

		if (!params.serviceId)
			return new NextResponse('Service Id is required', {
				status: 400,
			});

		// Delete existing related records
		await prismadb.serviceDesc.deleteMany({
			where: { serviceId: params.serviceId },
		});

		await prismadb.serviceDescAr.deleteMany({
			where: { serviceId: params.serviceId },
		});

		await prismadb.expertService.deleteMany({
			where: { serviceId: params.serviceId },
		});

		// Update the service and create related records
		const updatedService = await prismadb.service.update({
			where: { id: params.serviceId },
			data: {
				name: body.name,
				name_ar: body.name_ar,
				serviceDesc: {
					create: body.serviceDesc.map(
						(desc) => ({
							...desc,
						})
					),
				},
				serviceDescAr: {
					create: body.serviceDescAr.map(
						(descAr) => ({
							...descAr,
						})
					),
				},
				expertService: {
					create: body.expertService.map(
						(expert) => ({
							...expert,
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

		return new NextResponse(JSON.stringify(updatedService), {
			status: 200,
		});
	} catch (error) {
		return handleErrorResponse(error);
	}
}
