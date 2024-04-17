import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

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
				expert: true,
				category: true,
				// size: true,
				// color: true,
			},
		});

		return NextResponse.json(service);
	} catch (error) {
		console.log('[service_GET]', error);
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
			return new NextResponse('service id is required', {
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
		console.log('[service_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { serviceId: string; storeId: string } }
) {
	try {
		const { userId } = auth();

		const body = await req.json();

		const {
			categoryId,
			name,
			name_ar,
			title,
			title_ar,
			explanation,
			explanation_2,
			explanation_ar,
			explanation_2_ar,
		} = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}

		if (!params.serviceId) {
			return new NextResponse('service Id is required', {
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

		if (!title) {
			return new NextResponse('title is required', {
				status: 400,
			});
		}

		if (!categoryId) {
			return new NextResponse('Category id is required', {
				status: 400,
			});
		}
		if (!title_ar) {
			return new NextResponse('Arabic Tilte is required', {
				status: 400,
			});
		}
		if (!explanation) {
			return new NextResponse('explanation 1 is required', {
				status: 400,
			});
		}
		if (!explanation_2) {
			return new NextResponse('explanation 2 is required', {
				status: 400,
			});
		}
		if (!explanation_ar) {
			return new NextResponse(
				'explanation 1 in arabic is required',
				{
					status: 400,
				}
			);
		}
		if (!explanation_2_ar) {
			return new NextResponse(
				'explanation 2  in arabic is required',
				{
					status: 400,
				}
			);
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

		await prismadb.service.update({
			where: {
				id: params.serviceId,
			},
			data: {
				categoryId,
				name,
				name_ar,
				title,
				title_ar,
				explanation,
				explanation_2,
				explanation_ar,
				explanation_2_ar,
				expert: {
					deleteMany: {},
				},
			},
		});

		const service = await prismadb.service.update({
			where: {
				id: params.serviceId,
			},
			data: {},
		});

		return NextResponse.json(service);
	} catch (error) {
		console.log('[service_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
