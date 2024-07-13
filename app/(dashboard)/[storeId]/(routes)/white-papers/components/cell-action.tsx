'use client';
import axios from 'axios';
import { useState } from 'react';
import { Edit, Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertModal } from '@/components/modals/alert-modal';
import { ProductColumn } from './columns';

interface CellActionProps {
	data: ProductColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const onConfirm = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/${params.storeId}/events/${data.id}`);
			toast.success('courses-category deleted.');
			router.refresh();
		} catch (error) {
			toast.error('Make sure you removed all records using related to this record first.');
		} finally {
			setOpen(false);
			setLoading(false);
		}
	};
	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onConfirm}
				loading={loading}
			/>
			<div className="flex-col space-y-2">
				<Button variant="default" onClick={() => router.push(`/${params.storeId}/events/${data.id}`)}>
					<Edit className="mr-2 h-4 w-4" /> Update
				</Button>
				<Button variant="destructive" onClick={() => setOpen(true)}>
					<Trash className="mr-2 h-4 w-5" /> Delete
				</Button>
			</div>
		</>
	);
};
