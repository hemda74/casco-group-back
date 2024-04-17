'use client';

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { Service, Image, ServicesCategory } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
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
import ImageUpload from '@/components/ui/image-upload';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
	name: z.string().min(1),
	name_ar: z.string().min(1),
	title: z.string().min(1),
	title_ar: z.string().min(1),
	explanation: z.string().min(1),
	explanation_2: z.string().min(1),
	explanation_ar: z.string().min(1),
	explanation_2_ar: z.string().min(1),
	categoryId: z.string().min(1),
	// colorId: z.string().min(1),
	// sizeId: z.string().min(1),
	// isFeatured: z.boolean().default(false).optional(),
	// isArchived: z.boolean().default(false).optional(),
});

type ServiceFormValues = z.infer<typeof formSchema>;

interface ServiceFormProps {
	initialData:
		| (Service & {
				images: Image[];
		  })
		| null;
	categories: ServicesCategory[];
	// colors: Color[];
	// sizes: Size[];
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
	initialData,
	categories,
}) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? 'Edit Service' : 'Create Service';
	const description = initialData
		? 'Edit a Service.'
		: 'Add a new Service';
	const toastMessage = initialData
		? 'Service updated.'
		: 'Service created.';
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
				title: '',
				title_ar: '',
				explanation: '',
				explanation_2: '',
				explanation_2_ar: '',
				explanation_ar: '',
		  };

	const form = useForm<ServiceFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const onSubmit = async (data: ServiceFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/Services/${params.ServiceId}`,
					data
				);
			} else {
				await axios.post(
					`/api/${params.storeId}/Services`,
					data
				);
			}
			router.refresh();
			router.push(`/${params.storeId}/Services`);
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
				<Heading
					title={title}
					description={description}
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
									<FormLabel>
										Name
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												loading
											}
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
									<FormLabel>
										Arabic
										Name
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												loading
											}
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
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Service
										Title
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												loading
											}
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
									<FormLabel>
										Service
										in
										Arabic
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												loading
											}
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
							name="explanation"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Service
										Explanation
										1
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												loading
											}
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
							name="explanation_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Service
										Explanation
										1
										in
										Arabic
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												loading
											}
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
							name="explanation_2"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Service
										Explanation
										2
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												loading
											}
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
							name="explanation_2_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Service
										Explanation
										2
										in
										Arabic
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												loading
											}
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
									<FormLabel>
										Category
									</FormLabel>
									<Select
										disabled={
											loading
										}
										onValueChange={
											field.onChange
										}
										value={
											field.value
										}
										defaultValue={
											field.value
										}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={
														field.value
													}
													placeholder="Select a category"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{categories.map(
												(
													category
												) => (
													<SelectItem
														key={
															category.id
														}
														value={
															category.id
														}
													>
														{
															category.name
														}
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
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
