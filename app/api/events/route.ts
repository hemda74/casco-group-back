import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const body = await req.json();

		const {
			title,
			title_ar,
			imageUrl,
			categoryId,
			paragraph_event,
			paragraph_event_ar,
			date_of_event,
			date_of_event_ar,
		} = body;

		if (!title) {
			return new NextResponse('this field is required', {
				status: 400,
			});
		}
		if (!title_ar) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!date_of_event) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!date_of_event_ar) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!imageUrl) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!paragraph_event || !paragraph_event.length) {
			return new NextResponse(
				'one pargraph at least is required are required',
				{
					status: 400,
				}
			);
		}
		if (!paragraph_event_ar || !paragraph_event_ar.length) {
			return new NextResponse(
				'one pargraph at least is required are required',
				{
					status: 400,
				}
			);
		}
		if (!categoryId) {
			return new NextResponse('Category id is required', {
				status: 400,
			});
		}

		if (!params.storeId) {
			return new NextResponse('Store id is required', {
				status: 400,
			});
		}

		const product = await prismadb.event.create({
			data: {
				title,
				title_ar,
				categoryId,
				date_of_event,
				date_of_event_ar,
				imageUrl,
				storeId: params.storeId,
				paragraph_event: {
					createMany: {
						data: [
							...paragraph_event.map(
								(paragraph_event: {
									text: string;
								}) =>
									paragraph_event
							),
						],
					},
				},
				paragraph_event_ar: {
					createMany: {
						data: [
							...paragraph_event_ar.map(
								(paragraph_event_ar: {
									text: string;
								}) =>
									paragraph_event_ar
							),
						],
					},
				},
			},
		});

		return NextResponse.json(product);
	} catch (error) {
		console.log('[PRODUCTS_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { searchParams } = new URL(req.url);
		const categoryId = searchParams.get('categoryId') || undefined;

		if (!params.storeId) {
			return new NextResponse('Store id is required', {
				status: 400,
			});
		}

		const courses = await prismadb.event.findMany({
			where: {
				storeId: params.storeId,
				categoryId,
			},
			include: {
				paragraph_event: true,
				paragraph_event_ar: true,
				category: true,
			},
		});

		return NextResponse.json(courses);
	} catch (error) {
		console.log('[COURSES_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
