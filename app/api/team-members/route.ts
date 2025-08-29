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
			teamId,
			imageUrl,
			title,
			title_ar,
			brief_1,
			brief_1_ar,
			brief_2,
			brief_2_ar,
			brief_3,
			brief_3_ar,
		} = body;

		if (!name) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!name_ar) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!title_ar) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!title) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!brief_1) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!brief_1_ar) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!brief_2) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!brief_2_ar) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!brief_3) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!brief_3_ar) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!imageUrl) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!teamId) {
			return new NextResponse('team id is required', {
				status: 400,
			});
		}

		const product = await prismadb.teamMember.create({
			data: {
				name,
				name_ar,
				title,
				title_ar,
				brief_1,
				brief_1_ar,
				brief_2,
				brief_2_ar,
				brief_3,
				brief_3_ar,
				teamId,
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
		const teamId = searchParams.get('teamId') || undefined;

		const teammember = await prismadb.teamMember.findMany({
			where: {
				teamId,
			},
			include: {
				team: true,
			},
			orderBy: {
				name: 'desc',
			},
		});

		return NextResponse.json(teammember);
	} catch (error) {
		console.log('[COURSES_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
