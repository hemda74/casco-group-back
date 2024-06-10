import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

export async function GET(
	req: Request,
	{ params }: { params: { teammemberId: string } }
) {
	try {
		if (!params.teammemberId) {
			return new NextResponse('Team member ID is required', {
				status: 400,
			});
		}

		const teamMember = await prismadb.teamMember.findUnique({
			where: { id: params.teammemberId },
			include: { team: true },
		});

		return NextResponse.json(teamMember);
	} catch (error) {
		console.error('[GET_TEAM_MEMBER]', error);
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
			return new NextResponse('Team member ID is required', {
				status: 400,
			});
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: params.storeId, userId },
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', {
				status: 405,
			});
		}

		const teamMember = await prismadb.teamMember.delete({
			where: { id: params.teammemberId },
		});

		return NextResponse.json(teamMember);
	} catch (error) {
		console.error('[DELETE_TEAM_MEMBER]', error);
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
			title,
			title_ar,
			brief_1,
			brief_1_ar,
			brief_2,
			brief_2_ar,
			brief_3,
			brief_3_ar,
			teamId,
		} = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}

		if (
			!teamId ||
			!name ||
			!name_ar ||
			!title ||
			!title_ar ||
			!brief_1 ||
			!brief_1_ar ||
			!brief_2 ||
			!brief_2_ar ||
			!brief_3 ||
			!brief_3_ar
		) {
			return new NextResponse('All fields are required', {
				status: 400,
			});
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: params.storeId, userId },
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', {
				status: 405,
			});
		}

		const teamMember = await prismadb.teamMember.update({
			where: { id: params.teammemberId },
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
			},
		});

		return NextResponse.json(teamMember);
	} catch (error) {
		console.error('[PATCH_TEAM_MEMBER]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
