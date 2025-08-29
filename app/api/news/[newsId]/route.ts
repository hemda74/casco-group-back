import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function GET(
	req: Request,
	{ params }: { params: { newsid: number } }
) {
	try {
		if (!params.newsid) {
			return new NextResponse('news id is required', {
				status: 400,
			});
		}

		const news = await prismadb.news.findUnique({
			where: {
				id: params.newsid,
			},
			include: {
				paragraph_news: true,
				paragraph_news_ar: true,
				category: true,
			},
		});

		return NextResponse.json(news);
	} catch (error) {
		console.log('[news_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { newsid: number } }
) {
	try {
		const {} = auth();

		if (!params.newsid) {
			return new NextResponse('news id is required', {
				status: 400,
			});
		}

		const news = await prismadb.news.delete({
			where: {
				id: params.newsid,
			},
		});

		return NextResponse.json(news);
	} catch (error) {
		console.log('[news_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { newsid: number } }
) {
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
			return new NextResponse('Title is required', {
				status: 400,
			});
		}
		if (!title_ar) {
			return new NextResponse('Arabic Title is required', {
				status: 400,
			});
		}
		if (!imageUrl) {
			return new NextResponse('Image URL is required', {
				status: 400,
			});
		}
		if (!categoryid) {
			return new NextResponse('Category ID is required', {
				status: 400,
			});
		}
		if (!paragraph_news || !paragraph_news.length) {
			return new NextResponse('Paragraph news is required', {
				status: 400,
			});
		}
		if (!paragraph_news_ar || !paragraph_news_ar.length) {
			return new NextResponse(
				'Paragraph news in Arabic is required',
				{ status: 400 }
			);
		}
		if (!date_of_news) {
			return new NextResponse('Date of news is required', {
				status: 400,
			});
		}
		if (!date_of_news_ar) {
			return new NextResponse(
				'Date of news in Arabic is required',
				{ status: 400 }
			);
		}

		// First, delete existing paragraph news
		await prismadb.news.update({
			where: { id: params.newsid },
			data: {
				title,
				title_ar,
				imageUrl,
				date_of_news,
				date_of_news_ar,
				paragraph_news: { deleteMany: {} },
				paragraph_news_ar: { deleteMany: {} },
			},
		});
		const news = await prismadb.news.update({
			where: { id: params.newsid },
			data: {
				paragraph_news: {
					createMany: {
						data: paragraph_news.map(
							(paragraph: {
								text: string;
							}) => ({
								text: paragraph.text,
							})
						),
					},
				},
				paragraph_news_ar: {
					createMany: {
						data: paragraph_news_ar.map(
							(paragraph: {
								text: string;
							}) => ({
								text: paragraph.text,
							})
						),
					},
				},
			},
		});

		return NextResponse.json(news);
	} catch (error) {
		console.error('[news_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}
