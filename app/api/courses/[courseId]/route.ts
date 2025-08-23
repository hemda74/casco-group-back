import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';

type CourseRequestBody = {
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
} & Record<string, { text: string }[]>;

// Configuration for dynamic fields that need special handling
const DYNAMIC_FIELDS = [
	'c_intro_en',
	'c_intro_ar',
	'c_who_should_en',
	'c_who_should_ar',
	'c_objective_en',
	'c_objective_ar',
	'c_content_en',
	'c_content_ar',
	'c_benefit_en',
	'c_benefit_ar',
	'c_content2_en',
	'c_content2_ar',
	'c_date_en',
	'c_date_ar',
];

const REQUIRED_FIELDS = [
	'c_title',
	'c_title_ar',
	'imageUrl',
	'categoryId',
	'coursetypeId',
];

const validateFields = (body: CourseRequestBody) => {
	REQUIRED_FIELDS.forEach((field) => {
		if (!body[field]) throw new Error(`${field} is required`);
	});
};

const validateStore = async (storeId: string) => {
	const store = await prismadb.store.findFirst({
		where: { id: storeId },
	});
	if (!store) throw new Error('Unauthorized');
	return store;
};

const handleError = (error: any, context: string) => {
	console.error(`[${context}] Error:`, error.message);
	const status =
		error.message.includes('required') ||
		error.message === 'Unauthorized'
			? 400
			: 500;
	return new NextResponse(error.message, { status });
};

const createDynamicFieldData = (body: CourseRequestBody) => {
	const dynamicData: Record<string, any> = {};

	DYNAMIC_FIELDS.forEach((field) => {
		if (body[field]) {
			dynamicData[field] = {
				create: body[field].map(
					(item: { text: string }) => ({
						text: item.text,
					})
				),
			};
		}
	});

	return dynamicData;
};

const getStaticFields = (body: CourseRequestBody) => {
	const staticFields: Record<string, any> = {};

	Object.keys(body).forEach((key) => {
		if (!DYNAMIC_FIELDS.includes(key)) {
			staticFields[key] =
				body[key as keyof CourseRequestBody];
		}
	});

	return staticFields;
};

// API Routes
export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const body: CourseRequestBody = await req.json();
		validateFields(body);

		await validateStore(params.storeId);

		const staticFields = getStaticFields(body);
		const dynamicFields = createDynamicFieldData(body);

		const course = await prismadb.course.create({
			data: {
				categoryId: body.categoryId,
				coursetypeId: body.coursetypeId,
				c_title: body.c_title,
				c_title_ar: body.c_title_ar,
				price_egp: body.price_egp,
				price_ksa: body.price_ksa,
				price_uae: body.price_uae,
				price_usd: body.price_usd,
				imageUrl: body.imageUrl,
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
				...dynamicFields,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(course);
	} catch (error) {
		return handleError(error, 'course_POST');
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		if (!params.courseId) throw new Error('course id is required');

		const includeFields = DYNAMIC_FIELDS.reduce((acc, field) => {
			acc[field] = true;
			return acc;
		}, {} as Record<string, boolean>);

		const course = await prismadb.course.findUnique({
			where: { id: params.courseId },
			include: {
				CourseType: true,
				category: true,
				...includeFields,
			},
		});

		return NextResponse.json(course);
	} catch (error) {
		return handleError(error, 'course_GET');
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { courseId: string; storeId: string } }
) {
	try {
		if (!params.courseId) throw new Error('course id is required');

		await validateStore(params.storeId);

		const course = await prismadb.course.delete({
			where: { id: params.courseId },
		});

		return NextResponse.json(course);
	} catch (error) {
		return handleError(error, 'course_DELETE');
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; storeId: string } }
) {
	try {
		const body: CourseRequestBody = await req.json();
		validateFields(body);

		if (!params.courseId) throw new Error('Course Id is required');

		await validateStore(params.storeId);

		// Delete all dynamic field records in parallel
		const deletePromises = DYNAMIC_FIELDS.map((field) => {
			const tableName = field as keyof typeof prismadb;
			return (prismadb[tableName] as any).deleteMany({
				where: { courseId: params.courseId },
			});
		});

		await Promise.all(deletePromises);

		// Update with new data
		const staticFields = getStaticFields(body);
		const dynamicFields = createDynamicFieldData(body);

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
				imageUrl: body.imageUrl,
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
				...dynamicFields,
			},
		});

		return NextResponse.json(updatedCourse);
	} catch (error) {
		return handleError(error, 'course_PATCH');
	}
}
