import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
export async function GET(
	req: Request,
	{ params }: { params: { testimonialid: number } }
) {
	try {
		if (!params.testimonialId) {
			return new NextResponse('Billboard id is required', {
				status: 400,
			});
		}

		const billboard = await prismadb.testimonials.findUnique({
			where: {
				id: params.testimonialId,
			},
		});

		return NextResponse.json(billboard);
	} catch (error) {
		console.log('[BILLBOARD_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { testimonialid: number; storeid: number } }
) {
	try {
		const {} = auth();

		if (!params.testimonialId) {
			return new NextResponse('Billboard id is required', {
				status: 400,
			});
		}

		const billboard = await prismadb.testimonials.delete({
			where: {
				id: params.testimonialId,
			},
		});

		return NextResponse.json(billboard);
	} catch (error) {
		console.log('[BILLBOARD_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { testimonialid: number; storeid: number } }
) {
	try {
		const {} = auth();

		const body = await req.json();

		const {
			name,
			name_ar,
			title,
			title_ar,
			text,
			text_ar,
			imageUrl,
		} = body;

		if (!name) {
			return new NextResponse('name is required', {
				status: 400,
			});
		}
		if (!name_ar) {
			return new NextResponse('name_ar is required', {
				status: 400,
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
		if (!text) {
			return new NextResponse('text is required', {
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

		if (!params.testimonialId) {
			return new NextResponse('Billboard id is required', {
				status: 400,
			});
		}

		const billboard = await prismadb.testimonials.update({
			where: {
				id: params.testimonialId,
			},
			data: {
				name,
				title,
				text,
				name_ar,
				title_ar,
				text_ar,
				imageUrl,
			},
		});

		return NextResponse.json(billboard);
	} catch (error) {
		console.log('[BILLBOARD_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
