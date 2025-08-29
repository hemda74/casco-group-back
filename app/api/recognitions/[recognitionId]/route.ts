import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
export async function GET(
	req: Request,
	{ params }: { params: { recognitionid: number } }
) {
	try {
		if (!params.recognitionid) {
			return new NextResponse('Billboard id is required', {
				status: 400,
			});
		}

		const billboard = await prismadb.recognition.findUnique({
			where: {
				id: params.recognitionid,
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
	{ params }: { params: { recognitionid: number } }
) {
	try {
		const {} = auth();

		if (!params.recognitionid) {
			return new NextResponse('Billboard id is required', {
				status: 400,
			});
		}

		const billboard = await prismadb.recognition.delete({
			where: {
				id: params.recognitionid,
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
	{ params }: { params: { recognitionid: number } }
) {
	try {
		const {} = auth();

		const body = await req.json();

		const { title, title_ar, imageUrl } = body;

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

		if (!imageUrl) {
			return new NextResponse('Image URL is required', {
				status: 400,
			});
		}

		if (!params.recognitionid) {
			return new NextResponse('Billboard id is required', {
				status: 400,
			});
		}

		const billboard = await prismadb.recognition.update({
			where: {
				id: params.recognitionid,
			},
			data: {
				title,
				title_ar,
				imageUrl,
			},
		});

		return NextResponse.json(billboard);
	} catch (error) {
		console.log('[BILLBOARD_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
