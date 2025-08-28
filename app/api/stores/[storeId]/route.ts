import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function PATCH(
	req: Request,
	{ params }: { params: { storeid: number } }
) {
	try {
		const {} = auth();
		const body = await req.json();

		const { name } = body;

		if (!name) {
			return new NextResponse('Name is required', {
				status: 400,
			});
		}

		if (!params.storeId) {
			return new NextResponse('Store id is required', {
				status: 400,
			});
		}

		const store = await prismadb.store.updateMany({
			where: {
				id: params.storeId,
			},
			data: {
				name,
			},
		});

		return NextResponse.json(store);
	} catch (error) {
		console.log('[STORE_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { storeid: number } }
) {
	try {
		if (!params.storeId) {
			return new NextResponse('Store id is required', {
				status: 400,
			});
		}

		const store = await prismadb.store.deleteMany({
			where: {
				id: params.storeId,
			},
		});

		return NextResponse.json(store);
	} catch (error) {
		console.log('[STORE_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
