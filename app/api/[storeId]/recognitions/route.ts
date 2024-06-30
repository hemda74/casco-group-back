import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();

		const body = await req.json();

		const { imageUrl, title, title_ar } = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}

		if (!title) {
			return new NextResponse('title is required', {
				status: 400,
			});
		}

		if (!title_ar) {
			return new NextResponse('title_ar is required', {
				status: 400,
			});
		}

		if (!imageUrl) {
			return new NextResponse('Image URL is required', {
				status: 400,
			});
		}

		if (!params.storeId) {
			return new NextResponse('Store id is required', {
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

		const recognition = await prismadb.recognition.create({
			data: {
				title,
				title_ar,
				imageUrl,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(recognition);
	} catch (error) {
		console.log('[recognitionS_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		if (!params.storeId) {
			return new NextResponse('Store id is required', {
				status: 400,
			});
		}

		const recognitions = await prismadb.recognition.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(recognitions);
	} catch (error) {
		console.log('[recognitionS_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
