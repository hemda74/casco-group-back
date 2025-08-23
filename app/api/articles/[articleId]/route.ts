import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
export async function GET(
	req: Request,
	{ params }: { params: { articleId: string } }
) {
	try {
		if (!params.articleId) {
			return new NextResponse('event id is required', {
				status: 400,
			});
		}

		const event = await prismadb.event3.findUnique({
			where: {
				id: params.articleId,
			},
			include: {
				paragraph_event3: true,
				paragraph_event_ar3: true,
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
	{ params }: { params: { articleId: string; storeId: string } }
) {
	try {
		if (!params.articleId) {
			return new NextResponse('event id is required', {
				status: 400,
			});
		}

		const event = await prismadb.event3.delete({
			where: {
				id: params.articleId,
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
	{ params }: { params: { articleId: string; storeId: string } }
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
		if (!paragraph_event3 || !paragraph_event3.length) {
			return new NextResponse('Paragraph Event is required', {
				status: 400,
			});
		}
		if (!paragraph_event_ar3 || !paragraph_event_ar3.length) {
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

		// First, delete existing paragraph events
		await prismadb.event3.update({
			where: { id: params.articleId },
			data: {
				title,
				title_ar,
				imageUrl,
				date_of_event,
				date_of_event_ar,
				paragraph_event3: { deleteMany: {} },
				paragraph_event_ar3: { deleteMany: {} },
			},
		});

		// Then, create new paragraph events
		const event = await prismadb.event3.update({
			where: { id: params.articleId },
			data: {
				paragraph_event3: {
					createMany: {
						data: paragraph_event3.map(
							(paragraph: {
								text: string;
							}) => ({
								text: paragraph.text,
							})
						),
					},
				},
				paragraph_event_ar3: {
					createMany: {
						data: paragraph_event_ar3.map(
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
