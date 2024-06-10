import prismadb from '@/lib/prismadb';
import { ProductsClient } from './components/client';
import { CategoryColumn } from './components/columns';

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
	const teamMember = await prismadb.teamMember.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			team: true,
		},
		orderBy: {
			name: 'desc',
		},
	});

	const formattedProducts: CategoryColumn[] = teamMember.map((item) => ({
		id: item.id,
		name: item.name,
		name_ar: item.name_ar,
		team: item.team.name,
		title: item.title,
		title_ar: item.title_ar,
		brief_1: item.brief_1,
		brief_1_ar: item.brief_1_ar,
		brief_2: item.brief_2,
		brief_2_ar: item.brief_2_ar,
		brief_3: item.brief_3,
		brief_3_ar: item.brief_3_ar
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
