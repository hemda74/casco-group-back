import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import Navbar from '@/components/navbar';
import prismadb from '@/lib/prismadb';

export default async function DashboardLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { storeId: string };
}) {
	const { userId } = auth();

	if (!userId) {
		redirect('/sign-in');
	}

	const store = await prismadb.store.findFirst({
		where: {
			id: params.storeId,
			userId,
		},
	});

	if (!store) {
		redirect('/');
	}

	return (
		<>
			<div className="grid grid-cols-10 gap-4  ">
				<div className="col-start-1 col-end-3">
					<Navbar />
				</div>
				<div className="col-start-3 col-end-10">
					{children}
				</div>
			</div>
		</>
	);
}
