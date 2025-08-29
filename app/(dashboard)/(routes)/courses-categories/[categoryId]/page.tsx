import prismadb from '@/lib/prismadb';

import { CategoryForm } from './components/category-form';

const CategoryPage = async ({
	params,
}: {
	params: { categoryid: number; };
}) => {
	const category = await prismadb.coursesCategory.findUnique({
		where: {
			id: params.categoryid,
		},
	});



	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<CategoryForm
					initialData={category}
				/>
			</div>
		</div>
	);
};

export default CategoryPage;
