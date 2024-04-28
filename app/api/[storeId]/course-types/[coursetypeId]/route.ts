import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';

export async function GET(
	req: Request,
	{ params }: { params: { coursetypeId: string } }
) {
	try {
		if (!params.coursetypeId) {
			return new NextResponse('Type id is required', {
				status: 400,
			});
		}

		const type = await prismadb.courseType.findUnique({
			where: {
				id: params.coursetypeId,
			},
		});

		return NextResponse.json(type);
	} catch (error) {
		console.log('[SIZE_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { coursetypeId: string; storeId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}

		if (!params.coursetypeId) {
			return new NextResponse('Size id is required', {
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

		const type = await prismadb.courseType.delete({
			where: {
				id: params.coursetypeId,
			},
		});

		return NextResponse.json(type);
	} catch (error) {
		console.log('[SIZE_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { coursetypeId: string; storeId: string } }
) {
	try {
		const { userId } = auth();

		const body = await req.json();

		const { name, value } = body;

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

		if (!value) {
			return new NextResponse('Value is required', {
				status: 400,
			});
		}

		if (!params.coursetypeId) {
			return new NextResponse('Size id is required', {
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

		const type = await prismadb.courseType.update({
			where: {
				id: params.coursetypeId,
			},
			data: {
				name,
				value,
			},
		});

		return NextResponse.json(type);
	} catch (error) {
		console.log('[SIZE_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
