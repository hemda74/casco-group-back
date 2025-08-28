import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function GET(
	req: Request,
	{ params }: { params: { paperid: number } }
) {
	try {
		if (!params.paperId) {
			return new NextResponse('event id is required', {
				status: 400,
			});
		}

		const event = await prismadb.event2.findUnique({
			where: {
				id: params.paperId,
			},
			include: {
				paragraph_event2: true,
				paragraph_event_ar2: true,
				category: true,
			},
		});

		return NextResponse.json(event);
	} catch (error) {
		console.log('[event_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { paperid: number; storeid: number } }
) {
	try {
		const {} = auth();

		if (!params.paperId) {
			return new NextResponse('event id is required', {
				status: 400,
			});
		}

		const event = await prismadb.event2.delete({
			where: {
				id: params.paperId,
			},
		});

		return NextResponse.json(event);
	} catch (error) {
		console.log('[event_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { paperid: number; storeid: number } }
) {
	try {
		const {} = auth();
		const body = await req.json();

		const {
			title,
			title_ar,
			imageUrl,
			categoryId,
			paragraph_event2,
			paragraph_event_ar2,
			date_of_event,
			date_of_event_ar,
		} = body;

		if (!title) {
			return new NextResponse('Title is required', {
				status: 400,
			});
		}
		if (!title_ar) {
			return new NextResponse('Arabic Title is required', {
				status: 400,
			});
		}
		if (!imageUrl) {
			return new NextResponse('Image URL is required', {
				status: 400,
			});
		}
		if (!categoryId) {
			return new NextResponse('Category ID is required', {
				status: 400,
			});
		}
		if (!paragraph_event2 || !paragraph_event2.length) {
			return new NextResponse('Paragraph Event is required', {
				status: 400,
			});
		}
		if (!paragraph_event_ar2 || !paragraph_event_ar2.length) {
			return new NextResponse(
				'Paragraph Event in Arabic is required',
				{ status: 400 }
			);
		}
		if (!date_of_event) {
			return new NextResponse('Date of Event is required', {
				status: 400,
			});
		}
		if (!date_of_event_ar) {
			return new NextResponse(
				'Date of Event in Arabic is required',
				{ status: 400 }
			);
		}

		const storeBy = await prismadb.store.findFirst({
			where: { id: params.storeId },
		});

		if (!storeBy) {
			return new NextResponse('Unauthorized', {
				status: 405,
			});
		}

		// First, delete existing paragraph events
		await prismadb.event2.update({
			where: { id: params.paperId },
			data: {
				title,
				title_ar,
				imageUrl,
				date_of_event,
				date_of_event_ar,
				paragraph_event2: { deleteMany: {} },
				paragraph_event_ar2: { deleteMany: {} },
			},
		});

		// Then, create new paragraph events
		const event = await prismadb.event2.update({
			where: { id: params.paperId },
			data: {
				paragraph_event2: {
					createMany: {
						data: paragraph_event2.map(
							(paragraph: {
								text: string;
							}) => ({
								text: paragraph.text,
							})
						),
					},
				},
				paragraph_event_ar2: {
					createMany: {
						data: paragraph_event_ar2.map(
							(paragraph: {
								text: string;
							}) => ({
								text: paragraph.text,
							})
						),
					},
				},
			},
		});

		return NextResponse.json(event);
	} catch (error) {
		console.error('[event_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
