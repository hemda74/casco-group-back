import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';
import { formatter } from '@/lib/utils';

import { ProductsClient } from './components/client';
import { ProductColumn } from './components/columns';

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
	const courses = await prismadb.course.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			category: true,
		},
		orderBy: {
			date_and_rev_1: 'desc',
		},
	});

	const formattedProducts: ProductColumn[] = courses.map((item) => ({
		id: item.id,
		name: item.name,
		name_ar: item.name_ar,
		intro: item.intro,
		intro_ar: item.intro_ar,
		duaration: item.duaration,
		duration_ar: item.duration_ar,
		who_sh_att: item.who_sh_att,
		who_sh_att_ar: item.who_sh_att_ar,
		c_obje: item.c_obje,
		c_obje_ar: item.c_obje_ar,
		c_content: item.c_content,
		c_content_ar: item.c_content_ar,
		wh_we_bnfi: item.wh_we_bnfi,
		wh_we_bnfi_ar: item.wh_we_bnfi_ar,
		c_in_house: item.c_in_house,
		c_in_house_ar: item.c_in_house_ar,
		delv_and_leaders: item.delv_and_leaders,
		delv_and_leaders_ar: item.delv_and_leaders_ar,
		price: formatter.format(item.price.toNumber()),
		category: item.category.name,
		date_and_rev_1: item.date_and_rev_1,
		date_and_rev_2: item.date_and_rev_2,
		date_and_rev_3: item.date_and_rev_3,
		date_and_rev_4: item.date_and_rev_4,
		date_and_rev_5: item.date_and_rev_5,
		date_and_rev_6: item.date_and_rev_6,
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
