import prismadb from '@/lib/prismadb';
import { CaseForm } from './components/case-studies-form';
const ProductPage = async ({
	params,
}: {
	params: { casestudiesId: string; storeId: string };
}) => {
	const casestudies = await prismadb.caseStudy.findUnique({
		where: {
			id: params.casestudiesId,
		},
		include: {
			caseStudyPoint: true,
			caseStudyPointAr: true,
		},
	});
	const industries = await prismadb.industry.findMany({
		where: {
			storeId: params.storeId,
		},
	});
	return (
		<div className="flex-row">
			<div className="flex-1 space-x-4 p-8 pt-6">
				<CaseForm
					industries={industries}
					initialData={casestudies}
				/>
			</div>
		</div>
	);
};
export default ProductPage;
