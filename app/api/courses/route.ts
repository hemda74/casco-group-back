import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prismadb from '@/lib/prismadb';
type courseRequestBody = {
	categoryid: number;
	coursetypeid: number;
	c_title: string;
	imageUrl: string;
	c_title_ar: string;
	price_egp: number;
	price_ksa: number;
	price_uae: number;
	price_usd: number;
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

export async function POST(req: Request, { params }: { params: {} }) {
	try {
		const body: courseRequestBody = await req.json();
		const {
			c_title,
			c_title_ar,
			imageUrl,
			categoryid,
			coursetypeid,
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
		if (!categoryid) {
			return new NextResponse('Billboard ID is required', {
				status: 400,
			});
		}
		if (!coursetypeid) {
			return new NextResponse('Billboard ID is required', {
				status: 400,
			});
		}

		const category = await prismadb.course.create({
			data: {
				c_title,
				imageUrl,
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
				c_intro_en: {
					create: c_intro_en.map((i) => ({
						text: i.text,
					})),
				},
				c_intro_ar: {
					create: c_intro_ar.map((i) => ({
						text: i.text,
					})),
				},
				c_date_en: {
					create: c_date_en.map((i) => ({
						text: i.text,
					})),
				},
				c_date_ar: {
					create: c_date_ar.map((i) => ({
						text: i.text,
					})),
				},
				c_content_en: {
					create: c_content_en.map((i) => ({
						text: i.text,
					})),
				},
				c_content_ar: {
					create: c_content_ar.map((i) => ({
						text: i.text,
					})),
				},
				c_benefit_en: {
					create: c_benefit_en.map((i) => ({
						text: i.text,
					})),
				},
				c_benefit_ar: {
					create: c_benefit_ar.map((i) => ({
						text: i.text,
					})),
				},
				c_content2_en: {
					create: c_content2_en.map((i) => ({
						text: i.text,
					})),
				},
				c_content2_ar: {
					create: c_content2_ar.map((i) => ({
						text: i.text,
					})),
				},
				c_objective_en: {
					create: c_objective_en.map((i) => ({
						text: i.text,
					})),
				},
				c_objective_ar: {
					create: c_objective_ar.map((i) => ({
						text: i.text,
					})),
				},
				c_who_should_en: {
					create: c_who_should_en.map((i) => ({
						text: i.text,
					})),
				},
				c_who_should_ar: {
					create: c_who_should_ar.map((i) => ({
						text: i.text,
					})),
				},

				category: {
					connect: { id: categoryid },
				},
				CourseType: {
					connect: { id: coursetypeid },
				},
			},
		});

		return NextResponse.json(category);
	} catch (error) {
		console.log('[CATEGORIES_POST]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function GET(req: Request, { params }: { params: {} }) {
	try {
		const categories = await prismadb.course.findMany({});

		return NextResponse.json(categories);
	} catch (error) {
		console.log('[CATEGORIES_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
