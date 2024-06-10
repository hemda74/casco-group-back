import prismadb from '@/lib/prismadb';

import { CategoryForm } from './components/team-form';

const ProductPage = async ({
	params,
}: {
	params: { teammemberId: string; storeId: string };
}) => {
	const team = await prismadb.teamMember.findUnique({
		where: {
			id: params.teammemberId,
		},
		include: {
			images: true,
			team: true
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
				<CategoryForm
					teams={teams}
					initialData={team}
				/>
			</div>
		</div>
	);
};

export default ProductPage;
