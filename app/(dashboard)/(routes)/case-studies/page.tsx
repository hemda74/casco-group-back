import prismadb from '@/lib/prismadb';
import { ProductsClient } from './components/client';
import { CaseColumn } from './components/columns';

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
	const caseStudy = await prismadb.caseStudy.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			industry: true,
			caseStudyPoint: true,
			caseStudyPointAr: true,
		},
		orderBy: {
			title: 'desc',
		},
	});

	const formattedProducts: CaseColumn[] = caseStudy.map((item) => ({
		id: item.id,
		industry: item.industry.name,
		title: item.title,
		title_ar: item.title_ar,
		sub_title: item.sub_title,
		sub_title_ar: item.sub_title_ar,
		paragraph_1: item.paragraph_1,
		paragraph_1_ar: item.paragraph_1_ar,
		paragraph_2: item.paragraph_2,
		paragraph_2_ar: item.paragraph_2_ar,
		caseStudyPoint: item.caseStudyPoint.map(p => p.p1),
		caseStudyPointAr: item.caseStudyPointAr.map(p => p.p1),
	}));

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<ProductsClient data={formattedProducts} />
			</div>
		</div>
	);
};

export default ProductsPage;
