'use client';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ApiList } from '@/components/ui/api-list';
import { ServiceColumn, columns } from './columns';
interface ServiceClientProps {
	data: ServiceColumn[];
}
export const ServiceClient: React.FC<ServiceClientProps> = ({ data }) => {
	const params = useParams();
	const router = useRouter();
	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Total How Can Help Blocks (${data.length})`}
					description="Manage How Can Help Blocks "
				/>
				<Button
					onClick={() =>
						router.push(
							`/${params.storeId}/how-can-help/new`
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
				description="API Calls for How Can Help Block"
			/>
			<Separator />
			<ApiList
				entityName="how-can-help"
				entityIdName="howcanhelpId"
			/>
		</>
	);
};
