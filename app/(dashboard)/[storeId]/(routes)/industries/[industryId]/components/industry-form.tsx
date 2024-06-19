'use client';
import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { Industry, IndustryCategory, ExpertIndustry } from '@prisma/client';
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
	Textarea,
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
	name: z.string().min(2),
	name_ar: z.string().min(2),
	categoryId: z.string().min(1),
	expertIndustry: z.array(z.object({
		expert_name: z.string().min(1),
		expert_name_ar: z.string().min(1),
		expert_title: z.string().min(1),
		expert_title_ar: z.string().min(1),
		expert_phone: z.string().min(1),
		expert_mail: z.string().min(1),
		images: z.object({ url: z.string() }).array(),

	})),
});

type IndustryFormValues = z.infer<typeof formSchema>;

interface IndustryFormProps {
	initialData:
	| (Industry & {
		expertIndustry: ExpertIndustry[];
	})
	| null;
	categories: IndustryCategory[];

}

export const IndustryForm: React.FC<IndustryFormProps> = ({
	initialData,
	categories,
}) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? 'Edit category' : 'Create category';
	const description = initialData
		? 'Edit a category.'
		: 'Add a new category';
	const toastMessage = initialData
		? 'Category updated.'
		: 'Category created.';
	const action = initialData ? 'Save changes' : 'Create';

	const form = useForm<IndustryFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: '',
			name_ar: '',
			categoryId: '',
			expertIndustry: [],
		},
	});
	const { fields: expertIndustryFields, append: appendexpertIndustry, remove: removeexpertIndustry } = useFieldArray({
		control: form.control,
		name: 'expertIndustry',
	});
	const onSubmit = async (data: IndustryFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/industries/${params.industryId}`,
					data
				);
			} else {
				await axios.post(
					`/api/${params.storeId}/industries`,
					data
				);
			}
			router.refresh();
			router.push(`/${params.storeId}/industries`);
			toast.success(toastMessage);
		} catch (error: any) {
			toast.error('Something went wrong.');
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(
				`/api/${params.storeId}/industries/${params.industryId}`
			);
			router.refresh();
			router.push(`/${params.storeId}/industries`);
			toast.success('Category deleted.');
		} catch (error: any) {
			toast.error(
				'Make sure you removed all products using this category first.'
			);
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
					<div className="md:grid md:grid-cols-2 gap-8">
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
											placeholder="Category name"
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
											placeholder="Category name"
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
										Billboard
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
													placeholder="Select a billboard"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{categories.map(
												(
													billboard
												) => (
													<SelectItem
														key={
															billboard.id
														}
														value={
															billboard.id
														}
													>
														{
															billboard.name
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
					<div>
						<Heading description="Adding Experts to Industry" title="Adding Experts to Industry" />
						{expertIndustryFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`expertIndustry.${index}.images`} render={({ field }) => (
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
									name={`expertIndustry.${index}.expert_name`}
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
									name={`expertIndustry.${index}.expert_name_ar`}
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
									name={`expertIndustry.${index}.expert_title`}
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
									name={`expertIndustry.${index}.expert_title_ar`}
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
									name={`expertIndustry.${index}.expert_mail`}
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
									name={`expertIndustry.${index}.expert_phone`}
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
									onClick={() => removeexpertIndustry(index)}
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
								appendexpertIndustry({
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
