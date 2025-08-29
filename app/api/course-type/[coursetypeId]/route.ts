import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';

export async function GET(
	req: Request,
	{ params }: { params: { coursetypeid: number } }
) {
	try {
		if (!params.coursetypeid) {
			return new NextResponse('courseType id is required', {
				status: 400,
			});
		}

		const courseType = await prismadb.courseType.findUnique({
			where: {
				id: params.coursetypeid,
			},
		});

		return NextResponse.json(courseType);
	} catch (error) {
		console.log('[courseType_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { coursetypeid: number } }
) {
	try {
		if (!params.coursetypeid) {
			return new NextResponse('courseType id is required', {
				status: 400,
			});
		}

		const courseType = await prismadb.courseType.delete({
			where: {
				id: params.coursetypeid,
			},
		});

		return NextResponse.json(courseType);
	} catch (error) {
		console.log('[courseType_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { coursetypeid: number } }
) {
	try {
		const body = await req.json();

		const { name, name_ar } = body;

		if (!name) {
			return new NextResponse('Name is required', {
				status: 400,
			});
		}

		if (!params.coursetypeid) {
			return new NextResponse('courseType id is required', {
				status: 400,
			});
		}

		const courseType = await prismadb.courseType.update({
			where: {
				id: params.coursetypeid,
			},
			data: {
				name,
				name_ar,
			},
		});

		return NextResponse.json(courseType);
	} catch (error) {
		console.log('[courseType_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
