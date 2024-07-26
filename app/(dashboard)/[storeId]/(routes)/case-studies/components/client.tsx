'use client';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ApiList } from '@/components/ui/api-list';
import { CaseColumn, columns } from './columns';
interface ProductsClientProps {
	data: CaseColumn[];
}

export const ProductsClient: React.FC<ProductsClientProps> = ({ data }) => {
	const params = useParams();
	const router = useRouter();

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Case Studies (${data.length})`}
					description="Manage Case Studies for Industries"
				/>
				<Button
					onClick={() =>
						router.push(
							`/${params.storeId}/case-studies/new`
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
				entityName="case-studies"
				entityIdName="casestudiesId"
			/> */}
		</>
	);
};
