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
			linkedin,
			address,
			address_ar,
			phone,
			imageUrl,
		} = body;

		if (!name) {
			return new NextResponse('Name is required', {
				status: 400,
			});
		}
		if (!name_ar) {
			return new NextResponse(' Arabic Name is required', {
				status: 400,
			});
		}
		if (!address) {
			return new NextResponse('address is required', {
				status: 400,
			});
		}
		if (!address_ar) {
			return new NextResponse('address_ar is required', {
				status: 400,
			});
		}
		if (!linkedin) {
			return new NextResponse('linkedin is required', {
				status: 400,
			});
		}
		if (!phone) {
			return new NextResponse('phone is required', {
				status: 400,
			});
		}
		if (!imageUrl) {
			return new NextResponse('Images are required', {
				status: 400,
			});
		}

		const product = await prismadb.team.create({
			data: {
				name,
				name_ar,

				phone,
				address,
				address_ar,
				linkedin,
				imageUrl,
			},
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log('[PRODUCTS_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function GET(req: Request, { params }: { params: {} }) {
	try {
		const { searchParams } = new URL(req.url);
		const billboardId =
			searchParams.get('billboardId') || undefined;

		const courses = await prismadb.team.findMany({
			orderBy: {
				name: 'desc',
			},
		});

		return NextResponse.json(courses);
	} catch (error) {
		console.log('[COURSES_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
