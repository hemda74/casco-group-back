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

		const {
			name,
			name_ar,
			imageUrl,
			text,
			title,
			text_ar,
			title_ar,
		} = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}

		if (!name) {
			return new NextResponse('name is required', {
				status: 400,
			});
		}
		if (!title) {
			return new NextResponse('title is required', {
				status: 400,
			});
		}
		if (!text) {
			return new NextResponse('text is required', {
				status: 400,
			});
		}
		if (!name_ar) {
			return new NextResponse('name_ar is required', {
				status: 400,
			});
		}
		if (!title_ar) {
			return new NextResponse('title_ar is required', {
				status: 400,
			});
		}
		if (!text_ar) {
			return new NextResponse('text_ar is required', {
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

		const insidersView = await prismadb.testimonials.create({
			data: {
				name,
				text,
				title,
				name_ar,
				text_ar,
				title_ar,
				imageUrl,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(insidersView);
	} catch (error) {
		console.log('[insidersViewS_POST]', error);
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

		const insidersViews = await prismadb.insidersView.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(insidersViews);
	} catch (error) {
		console.log('[insidersViewS_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
