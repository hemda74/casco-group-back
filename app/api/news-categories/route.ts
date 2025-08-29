import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

export async function POST(req: Request, { params }: { params: {} }) {
	try {
		const {} = auth();

		const body = await req.json();

		const { name, name_ar } = body;

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

		const category = await prismadb.newsCategory.create({
			data: {
				name,
				name_ar,
			},
		});

		return NextResponse.json(category);
	} catch (error) {
		console.log('[CATEGORIES_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function GET(req: Request, { params }: { params: {} }) {
	try {
		const categories = await prismadb.newsCategory.findMany({});

		return NextResponse.json(categories);
	} catch (error) {
		console.log('[CATEGORIES_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
