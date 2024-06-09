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
			include: {
				images: true,
				billboard: true,
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

		const { name, name_ar, billboardId, images } = body;

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
		if (!images || !images.length) {
			return new NextResponse('Images are required', {
				status: 400,
			});
		}

		if (!billboardId) {
			return new NextResponse('billboard id is required', {
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
				billboardId,

				images: {
					deleteMany: {},
				},
			},
		});

		const team = await prismadb.team.update({
			where: {
				id: params.teamId,
			},
			data: {
				images: {
					createMany: {
						data: [
							...images.map(
								(image: {
									url: string;
								}) => image
							),
						],
					},
				},
			},
		});

		return NextResponse.json(team);
	} catch (error) {
		console.log('[team_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
