import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

type courseRequestBody = {
	categoryId: string;
	coursetypeId: string;
	c_title: string;
	c_title_ar: string;
	price_egp: number;
	price_ksa: number;
	price_uae: number;
	price_usd: number;
	imageUrl: string;
	c_short_intro_en: string;
	c_short_intro_ar: string;
	c_duration_en: string;
	c_duration_ar: string;
	c_in_house_en: string;
	c_in_house_ar: string;
	c_delv_and_leaders_en: string;
	c_delv_and_leaders_ar: string;
	c_intro_en: {
		text: string;
	}[];
	c_intro_ar: {
		text: string;
	}[];
	c_who_should_en: {
		text: string;
	}[];
	c_who_should_ar: {
		text: string;
	}[];
	c_objective_en: {
		text: string;
	}[];
	c_objective_ar: {
		text: string;
	}[];
	c_content_en: {
		text: string;
	}[];
	c_content_ar: {
		text: string;
	}[];
	c_benefit_en: {
		text: string;
	}[];
	c_benefit_ar: {
		text: string;
	}[];
	c_content2_en: {
		text: string;
	}[];
	c_content2_ar: {
		text: string;
	}[];
	c_date_en: {
		text: string;
	}[];
	c_date_ar: {
		text: string;
	}[];
};

const validateRequestBody = (body: courseRequestBody) => {
	const { c_title, c_title_ar, categoryId, coursetypeId, imageUrl } =
		body;

	if (!c_title) throw new Error('c_title is required');
	if (!c_title_ar) throw new Error('Arabic c_title is required');
	if (!imageUrl) throw new Error('Image is required');
	if (!categoryId) throw new Error('Category id is required');
	if (!coursetypeId) throw new Error('Category id is required');
};

const handleErrorResponse = (error: any) => {
	console.error(error);
	return new NextResponse('Internal error', { status: 500 });
};

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		const body: courseRequestBody = await req.json();

		const {
			c_title,
			imageUrl,
			coursetypeId,
			c_title_ar,
			categoryId,
			price_egp,
			price_ksa,
			price_uae,
			price_usd,
			c_short_intro_en,
			c_short_intro_ar,
			c_duration_en,
			c_duration_ar,
			c_in_house_en,
			c_in_house_ar,
			c_delv_and_leaders_en,
			c_delv_and_leaders_ar,
			c_intro_en,
			c_intro_ar,
			c_benefit_ar,
			c_benefit_en,
			c_content2_ar,
			c_content2_en,
			c_content_ar,
			c_content_en,
			c_date_ar,
			c_date_en,
			c_objective_ar,
			c_objective_en,
			c_who_should_ar,
			c_who_should_en,
		} = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 403,
			});
		}
		if (!coursetypeId) {
			return new NextResponse('c_title is required', {
				status: 400,
			});
		}
		if (!c_title) {
			return new NextResponse('c_title is required', {
				status: 400,
			});
		}
		if (!c_title_ar) {
			return new NextResponse('Arabic c_title is required', {
				status: 400,
			});
		}
		if (!imageUrl) {
			return new NextResponse('Arabic c_title is required', {
				status: 400,
			});
		}
		if (!categoryId) {
			return new NextResponse('Category id is required', {
				status: 400,
			});
		}
		if (!coursetypeId) {
			return new NextResponse('Category id is required', {
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

		const course = await prismadb.$transaction(async (prisma) => {
			const createdcourse = await prisma.course.create({
				data: {
					imageUrl,
					c_title,
					c_title_ar,
					price_egp,
					price_ksa,
					price_uae,
					price_usd,
					c_short_intro_en,
					c_short_intro_ar,
					c_duration_en,
					c_duration_ar,
					c_in_house_en,
					c_in_house_ar,
					c_delv_and_leaders_en,
					c_delv_and_leaders_ar,
					store: {
						connect: { id: params.storeId },
					},
					category: {
						connect: { id: categoryId },
					},
					CourseType: {
						connect: { id: coursetypeId },
					},
					c_intro_en: {
						create: c_intro_en.map(
							(expert) => ({
								text: expert.text,
							})
						),
					},
					c_intro_ar: {
						create: c_intro_ar.map(
							(expert) => ({
								text: expert.text,
							})
						),
					},
					c_benefit_en: {
						create: c_benefit_en.map(
							(expert) => ({
								text: expert.text,
							})
						),
					},
					c_benefit_ar: {
						create: c_benefit_ar.map(
							(expert) => ({
								text: expert.text,
							})
						),
					},
					c_content2_en: {
						create: c_content2_en.map(
							(expert) => ({
								text: expert.text,
							})
						),
					},
					c_content2_ar: {
						create: c_content2_ar.map(
							(expert) => ({
								text: expert.text,
							})
						),
					},
					c_content_en: {
						create: c_content_en.map(
							(expert) => ({
								text: expert.text,
							})
						),
					},
					c_content_ar: {
						create: c_content_ar.map(
							(expert) => ({
								text: expert.text,
							})
						),
					},
					c_date_en: {
						create: c_date_en.map(
							(expert) => ({
								text: expert.text,
							})
						),
					},
					c_date_ar: {
						create: c_date_ar.map(
							(expert) => ({
								text: expert.text,
							})
						),
					},
					c_objective_en: {
						create: c_objective_en.map(
							(expert) => ({
								text: expert.text,
							})
						),
					},
					c_objective_ar: {
						create: c_objective_ar.map(
							(expert) => ({
								text: expert.text,
							})
						),
					},
					c_who_should_en: {
						create: c_who_should_en.map(
							(expert) => ({
								text: expert.text,
							})
						),
					},
					c_who_should_ar: {
						create: c_who_should_ar.map(
							(expert) => ({
								text: expert.text,
							})
						),
					},
				},
			});

			return createdcourse;
		});

		return new NextResponse(JSON.stringify(course), {
			status: 200,
		});
	} catch (error: any) {
		console.log('[course_POST] Error:', error.message);
		console.log('[course_POST] Error Stack:', error.stack);
		return new NextResponse(`Internal error: ${error.message}`, {
			status: 500,
		});
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		if (!params.courseId)
			return new NextResponse('course id is required', {
				status: 400,
			});

		const course = await prismadb.course.findUnique({
			where: { id: params.courseId },
			include: {
				CourseType: true,
				category: true,
				c_benefit_ar: true,
				c_benefit_en: true,
				c_content2_ar: true,
				c_content2_en: true,
				c_content_ar: true,
				c_content_en: true,
				c_date_ar: true,
				c_date_en: true,
				c_intro_ar: true,
				c_intro_en: true,
				c_objective_ar: true,
				c_objective_en: true,
				c_who_should_ar: true,
				c_who_should_en: true,
			},
		});

		return new NextResponse(JSON.stringify(course), {
			status: 200,
		});
	} catch (error) {
		return handleErrorResponse(error);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { courseId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId)
			return new NextResponse('Unauthenticated', {
				status: 403,
			});

		if (!params.courseId)
			return new NextResponse('course id is required', {
				status: 400,
			});

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId)
			return new NextResponse('Unauthorized', {
				status: 405,
			});

		const course = await prismadb.course.delete({
			where: { id: params.courseId },
		});

		return new NextResponse(JSON.stringify(course), {
			status: 200,
		});
	} catch (error) {
		return handleErrorResponse(error);
	}
}
export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; storeId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId)
			return new NextResponse('Unauthenticated', {
				status: 403,
			});

		const body: courseRequestBody = await req.json();
		validateRequestBody(body);

		if (!params.courseId)
			return new NextResponse('Course Id is required', {
				status: 400,
			});

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: params.storeId, userId },
		});

		if (!storeByUserId)
			return new NextResponse('Unauthorized', {
				status: 405,
			});

		// Deletion operations
		await prismadb.c_benefit_ar.deleteMany({
			where: { courseId: params.courseId },
		});
		await prismadb.c_intro_ar.deleteMany({
			where: { courseId: params.courseId },
		});
		await prismadb.c_content2_ar.deleteMany({
			where: { courseId: params.courseId },
		});
		await prismadb.c_benefit_en.deleteMany({
			where: { courseId: params.courseId },
		});
		await prismadb.c_intro_en.deleteMany({
			where: { courseId: params.courseId },
		});
		await prismadb.c_content2_en.deleteMany({
			where: { courseId: params.courseId },
		});
		await prismadb.c_date_ar.deleteMany({
			where: { courseId: params.courseId },
		});
		await prismadb.c_content_ar.deleteMany({
			where: { courseId: params.courseId },
		});
		await prismadb.c_objective_ar.deleteMany({
			where: { courseId: params.courseId },
		});
		await prismadb.c_date_en.deleteMany({
			where: { courseId: params.courseId },
		});
		await prismadb.c_content_en.deleteMany({
			where: { courseId: params.courseId },
		});
		await prismadb.c_objective_en.deleteMany({
			where: { courseId: params.courseId },
		});
		await prismadb.c_who_should_ar.deleteMany({
			where: { courseId: params.courseId },
		});
		await prismadb.c_who_should_en.deleteMany({
			where: { courseId: params.courseId },
		});

		// Update course with new data
		const updatedCourse = await prismadb.course.update({
			where: { id: params.courseId },
			data: {
				categoryId: body.categoryId,
				coursetypeId: body.coursetypeId,
				c_title: body.c_title,
				c_title_ar: body.c_title_ar,
				price_egp: body.price_egp,
				price_ksa: body.price_ksa,
				price_uae: body.price_uae,
				price_usd: body.price_usd,
				c_short_intro_en: body.c_short_intro_en,
				c_short_intro_ar: body.c_short_intro_ar,
				c_duration_en: body.c_duration_en,
				c_duration_ar: body.c_duration_ar,
				c_in_house_en: body.c_in_house_en,
				c_in_house_ar: body.c_in_house_ar,
				c_delv_and_leaders_en:
					body.c_delv_and_leaders_en,
				c_delv_and_leaders_ar:
					body.c_delv_and_leaders_ar,
				c_benefit_ar: {
					create: body.c_benefit_ar.map(
						(item) => ({
							...item,
						})
					),
				},
				c_benefit_en: {
					create: body.c_benefit_en.map(
						(item) => ({
							...item,
						})
					),
				},
				c_date_ar: {
					create: body.c_date_ar.map((item) => ({
						...item,
					})),
				},
				c_date_en: {
					create: body.c_date_en.map((item) => ({
						...item,
					})),
				},
				c_intro_ar: {
					create: body.c_intro_ar.map((item) => ({
						...item,
					})),
				},
				c_intro_en: {
					create: body.c_intro_en.map((item) => ({
						...item,
					})),
				},
				c_content_ar: {
					create: body.c_content_ar.map(
						(item) => ({
							...item,
						})
					),
				},
				c_content_en: {
					create: body.c_content_en.map(
						(item) => ({
							...item,
						})
					),
				},
				c_objective_ar: {
					create: body.c_objective_ar.map(
						(item) => ({
							...item,
						})
					),
				},
				c_objective_en: {
					create: body.c_objective_en.map(
						(item) => ({
							...item,
						})
					),
				},
				c_who_should_ar: {
					create: body.c_who_should_ar.map(
						(item) => ({
							...item,
						})
					),
				},
				c_who_should_en: {
					create: body.c_who_should_en.map(
						(item) => ({
							...item,
						})
					),
				},
				c_content2_ar: {
					create: body.c_content2_ar.map(
						(item) => ({
							...item,
						})
					),
				},
				c_content2_en: {
					create: body.c_content2_en.map(
						(item) => ({
							...item,
						})
					),
				},
			},
		});

		return new NextResponse(JSON.stringify(updatedCourse), {
			status: 200,
		});
	} catch (error) {
		console.error('Error during update:', error);
		return handleErrorResponse(error);
	}
}
