"use client"
import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { Industry, IndustryDetailes, IndustryDetailesPoint, IndustryDetailesPointAr } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Textarea
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { AlertModal } from '@/components/modals/alert-modal';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
	title: z.string().min(1),
	title_ar: z.string().min(1),
	industryId: z.string().min(1),
	industryDetailesPoint: z.array(z.object({
		text: z.string().min(1),
	})),
	industryDetailesPointAr: z.array(z.object({
		text: z.string().min(1),
	})),

});

type ServiceFormValues = z.infer<typeof formSchema>;

interface ServiceFormProps {
	initialData:
	| (IndustryDetailes & {
		industryDetailesPoint: IndustryDetailesPoint[];
		industryDetailesPointAr: IndustryDetailesPointAr[];
	})
	| null;
	industries: Industry[];
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
	initialData,
	industries }) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? 'Edit Block' : 'Create Block';
	const description = initialData ? 'Edit a Block.' : 'Add a new Block';
	const toastMessage = initialData ? 'Block updated.' : 'Service created.';
	const action = initialData ? 'Save changes' : 'Create';

	const defaultValues = initialData
		? {
			...initialData,
		}
		: {
			id: '',
			industryId: '',
			title: '',
			title_ar: '',
			industryDetailesPoint: [],
			industryDetailesPointAr: [],
		};

	const form = useForm<ServiceFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const { fields: industryDetailesPointFields, append: appendindustryDetailesPoint, remove: removeindustryDetailesPoint } = useFieldArray({
		control: form.control,
		name: 'industryDetailesPoint',
	});
	const { fields: industryDetailesPointArFields, append: appendindustryDetailesPointAr, remove: removeindustryDetailesPointAr } = useFieldArray({
		control: form.control,
		name: 'industryDetailesPointAr',
	});
	const onSubmit = async (data: ServiceFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/industry-detailes/${params.industrydetailesId}`,
					data
				);
			} else {
				await axios.post(
					`/api/${params.storeId}/industry-detailes`,
					data
				);
			}
			router.refresh();
			router.push(`/${params.storeId}/industry-detailes`);
			toast.success(toastMessage);
		} catch (error: any) {
			toast.error('Something went wrong.', error);
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(
				`/api/${params.storeId}/industry-detailes/${params.industrydetailesId}`
			);
			router.refresh();
			router.push(`/${params.storeId}/industry-detailes`);
			toast.success('Block deleted.');
		} catch (error: any) {
			toast.error('Something went wrong.');
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};
	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<div className="flex items-center justify-between">
				<Heading
					title={title}
					description='dcdeddces'
				/>
				{initialData && (
					<Button
						disabled={loading}
						variant="destructive"
						size="sm"
						onClick={() => setOpen(true)}
					>
						<Trash className="h-4 w-4" />
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full"
				>
					<div className="md:grid md:grid-cols-2 gap-8">
						<FormField
							control={form.control}
							name="industryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Industry</FormLabel>
									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder="Select a category"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{industries.map((category) => (
												<SelectItem
													key={category.id}
													value={category.id}
												>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Textarea
											disabled={loading}
											placeholder="Enter a Value"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="title_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Arabic Title</FormLabel>
									<FormControl>
										<Textarea
											disabled={loading}
											placeholder="Enter a Value"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div>
						<Heading description='Add Point To block' title="Add Point (Arabic)" />
						{industryDetailesPointFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`industryDetailesPoint.${index}.text`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Point</FormLabel>
											<FormControl>
												<Textarea
													disabled={loading}
													placeholder="Enter a Value"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									disabled={loading}
									variant="destructive"
									className="mt-10"
									onClick={() => removeindustryDetailesPoint(index)}
								>
									Remove Point
								</Button>
							</div>
						))}
						<Button
							type="button"
							disabled={loading}
							variant="secondary"
							className="mt-5"
							onClick={() =>
								appendindustryDetailesPoint({
									text: '',

								})
							}
						>
							Add Point
						</Button>
					</div>
					<div>
						<Heading description='Add Point To block' title="Add Point (Arabic)" />
						{industryDetailesPointArFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`industryDetailesPointAr.${index}.text`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Point (Arabic)</FormLabel>
											<FormControl>
												<Textarea
													disabled={loading}
													placeholder="Enter a Value"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									disabled={loading}
									variant="destructive"
									className="mt-10"
									onClick={() => removeindustryDetailesPointAr(index)}
								>
									Remove Point
								</Button>
							</div>
						))}
						<Button
							type="button"
							disabled={loading}
							variant="secondary"
							className="mt-5"
							onClick={() =>
								appendindustryDetailesPointAr({
									text: '',
								})
							}
						>
							Add Point (Arabic)
						</Button>
					</div>

					<Button
						disabled={loading}
						className="ml-auto"
						type="submit"
					>
						{action}
					</Button>
				</form>
			</Form>
		</>
	);
};

export default ServiceForm;
