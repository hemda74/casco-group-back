import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(req: Request, { params }: { params: {} }) {
	try {
		const {} = auth();

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

		const insidersView = await prismadb.testimonials.create({
			data: {
				name,
				text,
				title,
				name_ar,
				text_ar,
				title_ar,
				imageUrl,
			},
		});

		return NextResponse.json(insidersView);
	} catch (error) {
		console.log('[insidersViewS_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function GET(req: Request, { params }: { params: {} }) {
	try {
		const insidersViews = await prismadb.insidersView.findMany({});

		return NextResponse.json(insidersViews);
	} catch (error) {
		console.log('[insidersViewS_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
