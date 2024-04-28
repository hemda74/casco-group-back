import prismadb from '@/lib/prismadb';

import { SizeForm } from './components/types-form';

const SizePage = async ({ params }: { params: { coursetypeId: string } }) => {
	const type = await prismadb.courseType.findUnique({
		where: {
			id: params.coursetypeId,
		},
	});

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<SizeForm initialData={type} />
			</div>
		</div>
	);
};

export default SizePage;
