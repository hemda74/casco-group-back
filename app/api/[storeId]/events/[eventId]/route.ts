import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function GET(
	req: Request,
	{ params }: { params: { eventId: string } }
) {
	try {
		if (!params.eventId) {
			return new NextResponse('event id is required', {
				status: 400,
			});
		}

		const event = await prismadb.event.findUnique({
			where: {
				id: params.eventId,
			},
			include: {
				paragraph_event: true,
				paragraph_event_ar: true,
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
	{ params }: { params: { eventId: string; storeId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}

		if (!params.eventId) {
			return new NextResponse('event id is required', {
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

		const event = await prismadb.event.delete({
			where: {
				id: params.eventId,
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
	{ params }: { params: { eventId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
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

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}
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
		if (!paragraph_event || !paragraph_event.length) {
			return new NextResponse('Paragraph Event is required', {
				status: 400,
			});
		}
		if (!paragraph_event_ar || !paragraph_event_ar.length) {
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

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: params.storeId, userId },
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', {
				status: 405,
			});
		}

		// First, delete existing paragraph events
		await prismadb.event.update({
			where: { id: params.eventId },
			data: {
				title,
				title_ar,
				imageUrl,
				date_of_event,
				date_of_event_ar,
				paragraph_event: { deleteMany: {} },
				paragraph_event_ar: { deleteMany: {} },
			},
		});

		// Then, create new paragraph events
		const event = await prismadb.event.update({
			where: { id: params.eventId },
			data: {
				paragraph_event: {
					createMany: {
						data: paragraph_event.map(
							(paragraph: {
								text: string;
							}) => ({
								text: paragraph.text,
							})
						),
					},
				},
				paragraph_event_ar: {
					createMany: {
						data: paragraph_event_ar.map(
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
