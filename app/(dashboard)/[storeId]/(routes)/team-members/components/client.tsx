'use client';

import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ApiList } from '@/components/ui/api-list';

import { CategoryColumn, columns } from './columns';

interface ProductsClientProps {
	data: CategoryColumn[];
}

export const ProductsClient: React.FC<ProductsClientProps> = ({ data }) => {
	const params = useParams();
	const router = useRouter();

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Team Members (${data.length})`}
					description="Manage teammembers"
				/>
				<Button
					onClick={() =>
						router.push(
							`/${params.storeId}/team-members/new`
						)
					}
				>
					<Plus className="mr-2 h-4 w-4" /> Add
					New
				</Button>
			</div>
			<Separator />
			<DataTable
				searchKey="name"
				columns={columns}
				data={data}
			/>
			<Heading
				title="API"
				description="API Calls for team members"
			/>
			<Separator />
			{/* <ApiList
				entityName="team-members"
				entityIdName="teammemberId"
			/> */}
		</>
	);
};
