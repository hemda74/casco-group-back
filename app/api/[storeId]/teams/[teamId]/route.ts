import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function GET(
	req: Request,
	{ params }: { params: { teamId: string } }
) {
	try {
		if (!params.teamId) {
			return new NextResponse('team id is required', {
				status: 400,
			});
		}

		const team = await prismadb.team.findUnique({
			where: {
				id: params.teamId,
			},
		});

		return NextResponse.json(team);
	} catch (error) {
		console.log('[team_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { teamId: string; storeId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}

		if (!params.teamId) {
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

		const team = await prismadb.team.delete({
			where: {
				id: params.teamId,
			},
		});

		return NextResponse.json(team);
	} catch (error) {
		console.log('[team_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { teamId: string; storeId: string } }
) {
	try {
		const { userId } = auth();

		const body = await req.json();

		const {
			name,
			name_ar,
			address,
			address_ar,
			linkedin,
			phone,
			imageUrl,
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
		if (!imageUrl) {
			return new NextResponse('Images are required', {
				status: 400,
			});
		}
		if (!address) {
			return new NextResponse('address is required', {
				status: 400,
			});
		}
		if (!address_ar) {
			return new NextResponse('arabic address is required', {
				status: 400,
			});
		}
		if (!linkedin) {
			return new NextResponse('linkedin is required', {
				status: 400,
			});
		}
		if (!phone) {
			return new NextResponse('phone is required', {
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
		await prismadb.team.update({
			where: {
				id: params.teamId,
			},
			data: {
				name,
				name_ar,
				linkedin,
				phone,
				address,
				address_ar,

				imageUrl,
			},
		});

		const team = await prismadb.team.update({
			where: {
				id: params.teamId,
			},
			data: {},
		});

		return NextResponse.json(team);
	} catch (error) {
		console.log('[team_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
