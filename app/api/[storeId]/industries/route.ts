import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
type ServiceRequestBody = {
	name: string;
	name_ar: string;
	expertIndustry: {
		expert_name: string;
		expert_name_ar: string;
		expert_phone: string;
		expert_mail: string;
		expert_title: string;
		expert_title_ar: string;
		// expert_imageUrl: string;
		store: { connect: { id: string } };
	}[];
	categoryId: string;
};

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();

		const body: ServiceRequestBody = await req.json();

		const { name, name_ar, expertIndustry, categoryId } = body;

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
			return new NextResponse('Arabic Name is required', {
				status: 400,
			});
		}

		if (!categoryId) {
			return new NextResponse('Billboard ID is required', {
				status: 400,
			});
		}

		if (!params.storeId) {
			return new NextResponse('Store id is required', {
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

		const category = await prismadb.industry.create({
			data: {
				name,
				name_ar,
				categoryId,
				expertIndustry: {
					create: expertIndustry.map(
						(expert) => ({
							expert_name:
								expert.expert_name,
							expert_name_ar:
								expert.expert_name_ar,
							expert_title:
								expert.expert_title,
							expert_title_ar:
								expert.expert_title_ar,
							expert_phone:
								expert.expert_phone,
							expert_mail:
								expert.expert_mail,
							store: {
								connect: {
									id: params.storeId,
								},
							},
						})
					),
				},
				storeId: params.storeId,
			},
		});

		return NextResponse.json(category);
	} catch (error) {
		console.log('[CATEGORIES_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		if (!params.storeId) {
			return new NextResponse('Store id is required', {
				status: 400,
			});
		}

		const categories = await prismadb.industryCategory.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(categories);
	} catch (error) {
		console.log('[CATEGORIES_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
