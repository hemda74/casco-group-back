"use client"
import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { Service, ServicesCategory, ServiceDesc, ServiceDescAr, ExpertService } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
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
import ImageUpload from '@/components/ui/image-upload';

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
	expertService: z.array(z.object({
		expert_name: z.string().min(1),
		expert_name_ar: z.string().min(1),
		expert_title: z.string().min(1),
		expert_title_ar: z.string().min(1),
		expert_phone: z.string().min(1),
		expert_mail: z.string().min(1),
		images: z.object({ url: z.string() }).array(),

	})),
});

type ServiceFormValues = z.infer<typeof formSchema>;

interface ServiceFormProps {
	initialData:
	| (Service & {
		serviceDesc: ServiceDesc[];
		serviceDescAr: ServiceDescAr[];
		expertService: ExpertService[];
	})
	| null;
	categories: ServicesCategory[];
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
	initialData,
	categories
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
		}
		: {
			id: '',
			categoryId: '',
			name: '',
			name_ar: '',
			serviceDesc: [],
			serviceDescAr: [],
			expertService: [],
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
	const { fields: expertServiceFields, append: appendExpertService, remove: removeExpertService } = useFieldArray({
		control: form.control,
		name: 'expertService',
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
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
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
							name="name_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Arabic Name</FormLabel>
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
						<Heading description='cedcedc' title="Service Descriptions" />
						{serviceDescFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`serviceDesc.${index}.title`}
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
									name={`serviceDesc.${index}.desc_1`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Description</FormLabel>
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
									name={`serviceDesc.${index}.desc_2`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Second Description</FormLabel>
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
							className="mt-5"
							onClick={() =>
								appendServiceDesc({
									title: '',
									desc_1: '',
									desc_2: '',
								})
							}
						>
							Add Service Description
						</Button>
					</div>
					<div>
						<Heading description='cedcfedc' title="Service Descriptions (Arabic)" />
						{serviceDescArFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`serviceDescAr.${index}.title_ar`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Title (Arabic)</FormLabel>
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
									name={`serviceDescAr.${index}.desc_1_ar`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Description (Arabic)</FormLabel>
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
									name={`serviceDescAr.${index}.desc_2_ar`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Second Description (Arabic)</FormLabel>
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
							className="mt-5"
							onClick={() =>
								appendServiceDescAr({
									title_ar: '',
									desc_1_ar: '',
									desc_2_ar: '',
								})
							}
						>
							Add Service Description (Arabic)
						</Button>
					</div>
					<div>
						<Heading description="fkvjvnkerjfb" title="Experts" />
						{expertServiceFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								{/* Image Upload */}
								{/* <FormField
										control={form.control}
										name={`expertService.${index}.images`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Expert Image</FormLabel>
												<FormDescription>Please add one image only.</FormDescription>
												<FormControl>
													<ImageUpload
														value={field.value ? [field.value] : []}
														disabled={loading}
														onChange={(url) => field.onChange(url)}
														onRemove={() => field.onChange('')}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/> */}
								<FormField
									control={form.control}
									name={`expertService.${index}.images`} render={({ field }) => (
										<FormItem>
											<FormLabel>Images</FormLabel>
											<FormControl>
												<ImageUpload
													value={field.value.map((image) => image.url)}
													disabled={loading}
													onChange={(url) =>
														field.onChange([...field.value, { url }])
													}
													onRemove={(url) =>
														field.onChange(
															field.value.filter(
																(current) => current.url !== url
															)
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name={`expertService.${index}.expert_name`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Expert Name (English)</FormLabel>
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
									name={`expertService.${index}.expert_name_ar`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Expert Name (Arabic)</FormLabel>
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
									name={`expertService.${index}.expert_title`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Expert Title (English)</FormLabel>
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
									name={`expertService.${index}.expert_title_ar`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Expert Title (Arabic)</FormLabel>
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
									name={`expertService.${index}.expert_mail`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Expert Mail</FormLabel>
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
									name={`expertService.${index}.expert_phone`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Expert Phone</FormLabel>
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
									onClick={() => removeExpertService(index)}
								>
									Remove
								</Button>
							</div>
						))}
						<Button
							type="button"
							disabled={loading}
							variant="secondary"
							className="mt-5"
							onClick={() =>
								appendExpertService({
									expert_name: '',
									expert_name_ar: '',
									expert_title: '',
									expert_title_ar: '',
									expert_mail: '',
									expert_phone: '',
									images: [],
								})
							}
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
};

export default ServiceForm;
