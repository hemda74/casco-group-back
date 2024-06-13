'use client';
import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { Service, ServicesCategory, ServiceDesc, ServiceDescAr, ExpertService, Expert } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
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
	name: z.string().min(1),
	name_ar: z.string().min(1),
	categoryId: z.string().min(1),
	serviceDesc: z.array(z.object({
		title: z.string().min(1),
		desc_1: z.string().min(1),
		desc_2: z.string().min(1),
	})),
	serviceDescAr: z.array(z.object({
		title_ar: z.string().min(1),
		desc_1_ar: z.string().min(1),
		desc_2_ar: z.string().min(1),
	})),
	expertIds: z.array(z.string().min(1)),
});

type ServiceFormValues = z.infer<typeof formSchema>;

interface ServiceFormProps {
	initialData:
	| (Service & {
		serviceDesc: ServiceDesc[];
		serviceDescAr: ServiceDescAr[];
		expertServices: ExpertService[];
	})
	| null;
	categories: ServicesCategory[];
	experts: Expert[];
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
	initialData,
	categories,
	experts,
}) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? 'Edit Service' : 'Create Service';
	const description = initialData ? 'Edit a Service.' : 'Add a new Service';
	const toastMessage = initialData ? 'Service updated.' : 'Service created.';
	const action = initialData ? 'Save changes' : 'Create';

	const defaultValues = initialData
		? {
			...initialData,
			expertIds: initialData.expertServices.map((es) => es.expertId),
		}
		: {
			id: '',
			categoryId: '',
			name: '',
			name_ar: '',
			serviceDesc: [],
			serviceDescAr: [],
			expertIds: [],
		};

	const form = useForm<ServiceFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const { fields: serviceDescFields, append: appendServiceDesc, remove: removeServiceDesc } = useFieldArray({
		control: form.control,
		name: 'serviceDesc',
	});

	const { fields: serviceDescArFields, append: appendServiceDescAr, remove: removeServiceDescAr } = useFieldArray({
		control: form.control,
		name: 'serviceDescAr',
	});

	const { fields: expertFields, append: appendExpert, remove: removeExpert } = useFieldArray({
		control: form.control,
		name: 'expertIds',
	});

	const onSubmit = async (data: ServiceFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/services/${params.serviceId}`,
					data
				);
			} else {
				await axios.post(
					`/api/${params.storeId}/services`,
					data
				);
			}
			router.refresh();
			router.push(`/${params.storeId}/services`);
			toast.success(toastMessage);
		} catch (error: any) {
			toast.error('Something went wrong.');
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(
				`/api/${params.storeId}/services/${params.serviceId}`
			);
			router.refresh();
			router.push(`/${params.storeId}/services`);
			toast.success('Service deleted.');
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
				<Heading description="d"
					title={title}
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
					<div className="md:grid md:grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
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
							name="name_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Arabic Name</FormLabel>
									<FormControl>
										<Input
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
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
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
											{categories.map((category) => (
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
					</div>
					<div>
						<Heading description="d" title="Service Descriptions" />
						{serviceDescFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-3 gap-8">
								<FormField
									control={form.control}
									name={`serviceDesc.${index}.title`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Title</FormLabel>
											<FormControl>
												<Input
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
									name={`serviceDesc.${index}.desc_1`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Description</FormLabel>
											<FormControl>
												<Input
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
									name={`serviceDesc.${index}.desc_2`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Second Description</FormLabel>
											<FormControl>
												<Input
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
									onClick={() => removeServiceDesc(index)}
								>
									Remove
								</Button>
							</div>
						))}
						<Button
							type="button"
							disabled={loading}
							variant="secondary"
							onClick={() => appendServiceDesc({ title: '', desc_1: '', desc_2: '' })}
						>
							Add Service Description
						</Button>
					</div>
					<div>
						<Heading description="d" title="Service Descriptions (Arabic)" />
						{serviceDescArFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-3 gap-8">
								<FormField
									control={form.control}
									name={`serviceDescAr.${index}.title_ar`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Title (Arabic)</FormLabel>
											<FormControl>
												<Input
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
									name={`serviceDescAr.${index}.desc_1_ar`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Description (Arabic)</FormLabel>
											<FormControl>
												<Input
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
									name={`serviceDescAr.${index}.desc_2_ar`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Second Description (Arabic)</FormLabel>
											<FormControl>
												<Input
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
									onClick={() => removeServiceDescAr(index)}
								>
									Remove
								</Button>
							</div>
						))}
						<Button
							type="button"
							disabled={loading}
							variant="secondary"
							onClick={() => appendServiceDescAr({ title_ar: '', desc_1_ar: '', desc_2_ar: '' })}
						>
							Add Service Description (Arabic)
						</Button>
					</div>
					<div>
						<Heading description="d" title="Experts" />
						{expertFields.map((field, index) => (
							<div key={field.id} className="flex items-center space-x-4">
								<FormField
									control={form.control}
									name={`expertIds.${index}`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Expert</FormLabel>
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
															placeholder="Select an expert"
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{experts.map(
														(expert) => (
															<SelectItem
																key={expert.id}
																value={expert.id}
															>
																{expert.name}
															</SelectItem>
														)
													)}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									disabled={loading}
									variant="destructive"
									onClick={() => removeExpert(index)}
								>
									Remove
								</Button>
							</div>
						))}
						<Button
							type="button"
							disabled={loading}
							variant="secondary"
							onClick={() => appendExpert('')}
						>
							Add Expert
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
}
