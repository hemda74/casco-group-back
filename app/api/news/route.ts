import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(req: Request, { params }: { params: {} }) {
	try {
		const {} = auth();

		const body = await req.json();

		const {
			title,
			title_ar,
			imageUrl,
			categoryid,
			paragraph_news,
			paragraph_news_ar,
			date_of_news,
			date_of_news_ar,
		} = body;

		if (!title) {
			return new NextResponse('this field is required', {
				status: 400,
			});
		}
		if (!title_ar) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!date_of_news) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}
		if (!date_of_news_ar) {
			return new NextResponse(' this field is required', {
				status: 400,
			});
		}

		if (!paragraph_news || !paragraph_news.length) {
			return new NextResponse(
				'one pargraph at least is required are required',
				{
					status: 400,
				}
			);
		}
		if (!paragraph_news_ar || !paragraph_news_ar.length) {
			return new NextResponse(
				'one pargraph at least is required are required',
				{
					status: 400,
				}
			);
		}
		if (!categoryid) {
			return new NextResponse('Category id is required', {
				status: 400,
			});
		}

		const product = await prismadb.news.create({
			data: {
				title,
				title_ar,
				date_of_news,
				date_of_news_ar,
				imageUrl,
				categoryid,

				paragraph_news: {
					createMany: {
						data: [
							...paragraph_news.map(
								(paragraph_news: {
									text: string;
								}) =>
									paragraph_news
							),
						],
					},
				},
				paragraph_news_ar: {
					createMany: {
						data: [
							...paragraph_news_ar.map(
								(paragraph_news_ar: {
									text: string;
								}) =>
									paragraph_news_ar
							),
						],
					},
				},
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
		const categoryid = searchParams.get('categoryid') || undefined;

		const courses = await prismadb.news.findMany({
			where: {
				categoryid,
			},
			include: {
				paragraph_news: true,
				paragraph_news_ar: true,
				category: true,
			},
		});

		return NextResponse.json(courses);
	} catch (error) {
		console.log('[COURSES_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
