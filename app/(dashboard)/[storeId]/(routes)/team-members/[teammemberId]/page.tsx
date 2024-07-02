import prismadb from '@/lib/prismadb';

import { CourseForm } from './components/member-form';

const ProductPage = async ({
	params,
}: {
	params: { teammemberId: string; storeId: string };
}) => {
	const Teammember = await prismadb.teamMember.findUnique({
		where: {
			id: params.teammemberId,
		},

	});

	const teams = await prismadb.team.findMany({
		where: {
			storeId: params.storeId,
		},
	});
	return (
		<div className="flex-row">
			<div className="flex-1 space-x-4 p-8 pt-6">
				<CourseForm
					teams={teams}
					initialData={Teammember}
				/>
			</div>
		</div>
	);
};

export default ProductPage;
