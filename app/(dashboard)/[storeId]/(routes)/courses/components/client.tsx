'use client';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ApiList } from '@/components/ui/api-list';
import { CourseColumn, columns } from './columns';
interface CourseClientProps {
	data: CourseColumn[];
}
export const CourseClient: React.FC<CourseClientProps> = ({ data }) => {
	const params = useParams();
	const router = useRouter();
	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Courses (${data.length})`}
					description="Manage Courses "
				/>
				<Button
					onClick={() =>
						router.push(
							`/${params.storeId}/courses/new`
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
				description="API Calls for courses"
			/>
			<Separator />
			<ApiList
				entityName="courses"
				entityIdName="courseId"
			/>
		</>
	);
};
