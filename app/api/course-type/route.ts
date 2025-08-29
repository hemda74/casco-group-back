import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(req: Request, { params }: { params: {} }) {
	try {
		const body = await req.json();

		const { name, name_ar } = body;

		if (!name) {
			return new NextResponse('Name is required', {
				status: 400,
			});
		}

		if (!name_ar) {
			return new NextResponse('name_ar is required', {
				status: 400,
			});
		}

		const courseType = await prismadb.courseType.create({
			data: {
				name,
				name_ar,
			},
		});

		return NextResponse.json(courseType);
	} catch (error) {
		console.log('[courseTypeS_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function GET(req: Request, { params }: { params: {} }) {
	try {
		const courseTypes = await prismadb.courseType.findMany({});

		return NextResponse.json(courseTypes);
	} catch (error) {
		console.log('[courseTypeS_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
