import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function GET(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		if (!params.courseId) {
			return new NextResponse('course id is required', {
				status: 400,
			});
		}

		const course = await prismadb.course.findUnique({
			where: {
				id: params.courseId,
			},
			include: {
				images: true,
				category: true,
				coursetype: true,
				// color: true,
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
	{ params }: { params: { courseId: string; storeId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}

		if (!params.courseId) {
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

		const course = await prismadb.course.delete({
			where: {
				id: params.courseId,
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
	{ params }: { params: { courseId: string; storeId: string } }
) {
	try {
		const { userId } = auth();

		const body = await req.json();

		const {
			name,
			name_ar,
			price,
			categoryId,
			images,
			intro,
			intro_ar,
			duaration,
			duration_ar,
			who_sh_att,
			who_sh_att_ar,
			c_obje,
			c_obje_ar,
			c_content,
			c_content_ar,
			wh_we_bnfi,
			wh_we_bnfi_ar,
			c_in_house,
			c_in_house_ar,
			delv_and_leaders,
			delv_and_leaders_ar,
			date_and_rev,

			certification,
		} = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}

		if (!params.courseId) {
			return new NextResponse('Course Id is required', {
				status: 400,
			});
		}

		if (!name) {
			return new NextResponse('Name is required', {
				status: 400,
			});
		}
		if (!name_ar) {
			return new NextResponse('Name is required', {
				status: 400,
			});
		}
		if (!images || !images.length) {
			return new NextResponse('Images are required', {
				status: 400,
			});
		}

		if (!price) {
			return new NextResponse('Price is required', {
				status: 400,
			});
		}

		if (!categoryId) {
			return new NextResponse('Category id is required', {
				status: 400,
			});
		}
		if (!intro) {
			return new NextResponse('intro is required', {
				status: 400,
			});
		}
		if (!intro_ar) {
			return new NextResponse(
				'introduction in arabic is required',
				{
					status: 400,
				}
			);
		}
		if (!duaration) {
			return new NextResponse('duaration is required', {
				status: 400,
			});
		}
		if (!duration_ar) {
			return new NextResponse(
				'duaration in arabic is required',
				{
					status: 400,
				}
			);
		}
		if (!who_sh_att) {
			return new NextResponse(
				'who should attend is required',
				{
					status: 400,
				}
			);
		}
		if (!who_sh_att_ar) {
			return new NextResponse(
				'who should attend in arabic is required',
				{
					status: 400,
				}
			);
		}
		if (!c_obje) {
			return new NextResponse(
				'course objective is required',
				{
					status: 400,
				}
			);
		}
		if (!c_obje_ar) {
			return new NextResponse(
				'course objective in arabic is required',
				{
					status: 400,
				}
			);
		}
		if (!c_content) {
			return new NextResponse('course conetent is required', {
				status: 400,
			});
		}
		if (!c_content_ar) {
			return new NextResponse(
				'course conetent in arabic is required',
				{
					status: 400,
				}
			);
		}
		if (!wh_we_bnfi) {
			return new NextResponse('what we benefit is required', {
				status: 400,
			});
		}
		if (!wh_we_bnfi_ar) {
			return new NextResponse(
				'what we benefit in arabic is required',
				{
					status: 400,
				}
			);
		}
		if (!c_in_house) {
			return new NextResponse('course in house is required', {
				status: 400,
			});
		}
		if (!c_in_house_ar) {
			return new NextResponse('course in house is required', {
				status: 400,
			});
		}
		if (!date_and_rev) {
			return new NextResponse(
				'At Least date and revnue is required',
				{
					status: 400,
				}
			);
		}
		if (!certification) {
			return new NextResponse(
				'Course Certification is required',
				{
					status: 400,
				}
			);
		}

		if (!delv_and_leaders) {
			return new NextResponse(
				'delviary and course leaders is required',
				{
					status: 400,
				}
			);
		}
		if (!delv_and_leaders_ar) {
			return new NextResponse(
				'delviary and course leaders in arabic is required',
				{
					status: 400,
				}
			);
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

		await prismadb.course.update({
			where: {
				id: params.courseId,
			},
			data: {
				name,
				price,
				categoryId,
				name_ar,
				intro,
				intro_ar,
				duaration,
				duration_ar,
				who_sh_att,
				who_sh_att_ar,
				c_obje,
				c_obje_ar,
				c_content,
				c_content_ar,
				wh_we_bnfi,
				wh_we_bnfi_ar,
				c_in_house,
				c_in_house_ar,
				delv_and_leaders,
				delv_and_leaders_ar,
				certification,

				images: {
					deleteMany: {},
				},
			},
		});

		const course = await prismadb.course.update({
			where: {
				id: params.courseId,
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

		return NextResponse.json(course);
	} catch (error) {
		console.log('[course_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
