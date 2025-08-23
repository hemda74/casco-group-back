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
			paragraph_event3,
			paragraph_event_ar3,
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
		if (!paragraph_event3 || !paragraph_event3.length) {
			return new NextResponse(
				'one pargraph at least is required are required',
				{
					status: 400,
				}
			);
		}
		if (!paragraph_event_ar3 || !paragraph_event_ar3.length) {
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

		const product = await prismadb.event3.create({
			data: {
				title,
				title_ar,
				categoryId,
				date_of_event,
				date_of_event_ar,
				imageUrl,
				storeId: params.storeId,
				paragraph_event3: {
					createMany: {
						data: [
							...paragraph_event3.map(
								(paragraph_event3: {
									text: string;
								}) =>
									paragraph_event3
							),
						],
					},
				},
				paragraph_event_ar3: {
					createMany: {
						data: [
							...paragraph_event_ar3.map(
								(paragraph_event_ar3: {
									text: string;
								}) =>
									paragraph_event_ar3
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

		const courses = await prismadb.event3.findMany({
			where: {
				storeId: params.storeId,
				categoryId,
			},
			include: {
				paragraph_event3: true,
				paragraph_event_ar3: true,
				category: true,
			},
		});

		return NextResponse.json(courses);
	} catch (error) {
		console.log('[COURSES_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
