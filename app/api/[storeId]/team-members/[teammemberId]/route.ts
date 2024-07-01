import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function GET(
	req: Request,
	{ params }: { params: { teammemberId: string } }
) {
	try {
		if (!params.teammemberId) {
			return new NextResponse('course id is required', {
				status: 400,
			});
		}

		const course = await prismadb.teamMember.findUnique({
			where: {
				id: params.teammemberId,
			},
			include: {
				team: true,
			},
		});

		return NextResponse.json(course);
	} catch (error) {
		console.log('[course_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { teammemberId: string; storeId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}

		if (!params.teammemberId) {
			return new NextResponse('course id is required', {
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

		const course = await prismadb.teamMember.delete({
			where: {
				id: params.teammemberId,
			},
		});

		return NextResponse.json(course);
	} catch (error) {
		console.log('[course_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { teammemberId: string; storeId: string } }
) {
	try {
		const { userId } = auth();

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

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}
		if (!name) {
			return new NextResponse('Name is required', {
				status: 400,
			});
		}
		if (!name_ar) {
			return new NextResponse(' Arabic Name is required', {
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

		await prismadb.teamMember.update({
			where: {
				id: params.teammemberId,
			},
			data: {
				name,
				name_ar,
				title,
				title_ar,
				brief_1,
				brief_1_ar,
				brief_2,
				imageUrl,
				brief_2_ar,
				brief_3,
				brief_3_ar,
				teamId,
			},
		});

		const course = await prismadb.teamMember.update({
			where: {
				id: params.teammemberId,
			},
			data: {},
		});

		return NextResponse.json(course);
	} catch (error) {
		console.log('[course_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
