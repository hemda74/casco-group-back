import prismadb from '@/lib/prismadb';
import { IndustryForm } from './components/industry-form';

const CategoryPage = async ({
	params,
}: {
	params: { industryid: number; storeid: number };
}) => {
	const industry = await prismadb.industry.findUnique({
		where: {
			id: params.industryId,
		},
		include: {
			expertIndustry: true,
			industryDetailes: {
				include: {
					industryDetailesPoint: true,
					industryDetailesPointAr: true,
				}
			},
			industryDetailes2: {
				include: {
					industryDetailesPoint2: true,
					industryDetailesPointAr2: true,
				}
			}
		},
	});
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<IndustryForm
					initialData={industry}
				/>
			</div>
		</div>
	);
};
export default CategoryPage;
