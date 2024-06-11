import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

// Define the expected request body type
type ServiceRequestBody = {
	name: string;
	name_ar: string;
	servicedesc: {
		title: string;
		desc_1: string;
		desc_2: string;
		store: { connect: { id: string } };
	}[];
	servicedescar: {
		title_ar: string;
		desc_1_ar: string;
		desc_2_ar: string;
		store: { connect: { id: string } };
	}[];
	categoryId: string;
	expertIds: string[];
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
			servicedesc,
			servicedescar,
			categoryId,
			expertIds,
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

		const service = await prismadb.service.create({
			data: {
				storeId: params.storeId,
				name,
				name_ar,
				categoryId,
				expertId: expertIds[0], // Assuming you have a single expertId for simplicity
				servicedesc: {
					create: servicedesc.map((desc) => ({
						title: desc.title,
						desc_1: desc.desc_1,
						desc_2: desc.desc_2,
						store: {
							connect: {
								id: params.storeId,
							},
						}, // Connect to the store
					})),
				},
				servicedescar: {
					create: servicedescar.map((descAr) => ({
						title_ar: descAr.title_ar,
						desc_1_ar: descAr.desc_1_ar,
						desc_2_ar: descAr.desc_2_ar,
						store: {
							connect: {
								id: params.storeId,
							},
						}, // Connect to the store
					})),
				},
				experts: {
					connect: expertIds.map((id) => ({
						id,
					})),
				},
			},
		});

		return NextResponse.json(service);
	} catch (error) {
		console.log('[SERVICE_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
