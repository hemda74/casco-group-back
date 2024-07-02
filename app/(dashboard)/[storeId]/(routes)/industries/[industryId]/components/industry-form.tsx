'use client';
import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { Industry, IndustryCategory, ExpertIndustry, IndustryDetailes, IndustryDetailes2, IndustryDetailesPoint, IndustryDetailesPointAr } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
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
		imageUrl: z.string().min(1),
	})),
	industryDetailes: z.array(z.object({
		title: z.string().min(1),
		title_ar: z.string().min(1),
		industryDetailesPoint: z.array(z.object({
			text: z.string().min(1),
		})),
		industryDetailesPointAr: z.array(z.object({
			text: z.string().min(1),
		})),
	})),
	industryDetailes2: z.array(z.object({
		title: z.string().min(1),
		title_ar: z.string().min(1),
		industryDetailesPoint2: z.array(z.object({
			text: z.string().min(1),
		})),
		industryDetailesPointAr2: z.array(z.object({
			text: z.string().min(1),
		})),
	})),
});

type IndustryFormValues = z.infer<typeof formSchema>;

interface IndustryFormProps {
	initialData:
	| (Industry & {
		expertIndustry: ExpertIndustry[];
		industryDetailes: IndustryDetailes[];
		industryDetailes2: IndustryDetailes2[];

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

	const title = initialData ? 'Edit Industry' : 'Create Industry';
	const description = initialData
		? 'Edit a Industry.'
		: 'Add a new Industry';
	const toastMessage = initialData
		? 'Industry updated.'
		: 'Industry created.';
	const action = initialData ? 'Save changes' : 'Create';

	const form = useForm<IndustryFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: '',
			name_ar: '',
			categoryId: '',
			expertIndustry: [],
			industryDetailes: [],
			industryDetailes2: [],
		},
	});

	const { fields: expertIndustryFields, append: appendexpertIndustry, remove: removeexpertIndustry } = useFieldArray({
		control: form.control,
		name: 'expertIndustry',
	});
	const { fields: industryDetailesFields, append: appendindustryDetailes, remove: removeindustryDetailes } = useFieldArray({
		control: form.control,
		name: 'industryDetailes',
	});
	const { fields: industryDetailesFields2, append: appendIndustryDetailes2, remove: removeIndustryDetailes2 } = useFieldArray({
		control: form.control,
		name: 'industryDetailes2',
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
										<Textarea
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
										<Textarea
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
						<Heading description="Managing Experts to Industry" title="Managing Experts to Industry" />
						{expertIndustryFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`expertIndustry.${index}.imageUrl`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>ImageUrl</FormLabel>
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
								<Button
									disabled={loading}
									type="button"
									onClick={() => removeexpertIndustry(index)}
									variant="destructive"
									size="sm"
									className="mt-10 w-1/2"
								>
									Remove
								</Button>
								<Separator />
							</div>
						))}
						<Button
							disabled={loading}
							type="button"
							onClick={() =>
								appendexpertIndustry({
									expert_name: '',
									expert_name_ar: '',
									expert_title: '',
									expert_title_ar: '',
									expert_phone: '',
									expert_mail: '',
									imageUrl: '',
								})
							}
							variant="secondary"
							className="mt-2"
						>
							Add new Expert to Industry
						</Button>
					</div>
					<Separator />
					<div>
						<Heading description="Managing Detailes to Industry" title="Managing Detailes to Industry" />
						{industryDetailesFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`industryDetailes.${index}.title`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Title ${index + 1} English`}</FormLabel>
											<FormControl>
												<Textarea
													disabled={loading}
													placeholder="Enter a title"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`industryDetailes.${index}.title_ar`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Title ${index + 1} Arabic`}</FormLabel>
											<FormControl>
												<Textarea
													disabled={loading}
													placeholder="Enter a title in Arabic"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`industryDetailes.${index}.industryDetailesPoint`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Industry Detailes ${index} Points English`}</FormLabel>
											<FormControl>
												<div>
													{field.value.map((point, pointIndex) => (
														<div key={pointIndex} className="flex items-center space-x-2">
															<FormLabel>{`Point ${pointIndex + 1} English`}</FormLabel>

															<Textarea
																disabled={loading}
																className='mt-5'
																placeholder="Enter a detail point"
																value={point.text}
																onChange={(e) => {
																	const newPoints = [...field.value];
																	newPoints[pointIndex].text = e.target.value;
																	field.onChange(newPoints);
																}}
															/>
															<Button
																disabled={loading}
																type="button"
																onClick={() => {
																	const newPoints = field.value.filter((_, i) => i !== pointIndex);
																	field.onChange(newPoints);
																}}
																variant="destructive"
																size="sm"
															>
																Remove
															</Button>
														</div>
													))}
													<Button
														disabled={loading}
														type="button"
														onClick={() => field.onChange([...field.value, { text: '' }])}
														variant="secondary"
														className="mt-2"
													>
														Add Point
													</Button>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`industryDetailes.${index}.industryDetailesPointAr`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Industry Detailes ${index} Points Arabic`}</FormLabel>
											<FormControl>
												<div>
													{field.value.map((point, pointIndex) => (
														<div key={pointIndex} className="flex items-center space-x-2">
															<FormLabel>{`Point ${pointIndex + 1} Arabic`}</FormLabel>

															<Textarea
																disabled={loading}
																className='mt-5'
																placeholder="Enter a detail point in Arabic"
																value={point.text}
																onChange={(e) => {
																	const newPoints = [...field.value];
																	newPoints[pointIndex].text = e.target.value;
																	field.onChange(newPoints);
																}}
															/>
															<Button
																disabled={loading}
																type="button"
																onClick={() => {
																	const newPoints = field.value.filter((_, i) => i !== pointIndex);
																	field.onChange(newPoints);
																}}
																variant="destructive"
																size="sm"
															>
																Remove
															</Button>
														</div>
													))}
													<Button
														disabled={loading}
														type="button"
														onClick={() => field.onChange([...field.value, { text: '' }])}
														variant="secondary"
														className="mt-2"
													>
														Add Point
													</Button>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									disabled={loading}
									type="button"
									onClick={() => removeindustryDetailes(index)}
									variant="destructive"
									size="sm"
									className="mt-10 w-1/2"
								>
									Remove
								</Button>
								<Separator />
							</div>
						))}
						<Button
							disabled={loading}
							type="button"
							onClick={() =>
								appendindustryDetailes({
									title: '',
									title_ar: '',
									industryDetailesPoint: [],
									industryDetailesPointAr: [],
								})
							}
							variant="secondary"
							className="mt-2"
						>
							Add new Detailes to Industry
						</Button>
					</div>
					<div>
						<Heading description="’Maniging How Can Help Section to Industry" title="’Maniging How Can Help Section to Industry" />
						{industryDetailesFields2.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`industryDetailes2.${index}.title`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Title ${index + 1} English`}</FormLabel>
											<FormControl>
												<Textarea
													disabled={loading}
													placeholder="Enter a title"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`industryDetailes2.${index}.title_ar`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Title ${index + 1} Arabic`}</FormLabel>
											<FormControl>
												<Textarea
													disabled={loading}
													placeholder="Enter a title in Arabic"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`industryDetailes2.${index}.industryDetailesPoint2`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`How Can Help ${index} Points English`}</FormLabel>
											<FormControl>
												<div>
													{field.value.map((point, pointIndex) => (
														<div key={pointIndex} className="flex items-center space-x-2">
															<FormLabel>{`Title ${pointIndex + 1} English`}</FormLabel>
															<Textarea
																disabled={loading}
																className='mt-5'
																placeholder="Enter a point"
																value={point.text}
																onChange={(e) => {
																	const newPoints = [...field.value];
																	newPoints[pointIndex].text = e.target.value;
																	field.onChange(newPoints);
																}}
															/>
															<Button
																disabled={loading}
																type="button"
																onClick={() => {
																	const newPoints = field.value.filter((_, i) => i !== pointIndex);
																	field.onChange(newPoints);
																}}
																variant="destructive"
																size="sm"
															>
																Remove
															</Button>
														</div>
													))}
													<Button
														disabled={loading}
														type="button"
														onClick={() => field.onChange([...field.value, { text: '' }])}
														variant="secondary"
														className="mt-2"
													>
														Add Point
													</Button>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`industryDetailes2.${index}.industryDetailesPointAr2`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`How Can Help ${index} Points Arabic`}</FormLabel>
											<FormControl>
												<div>
													{field.value.map((point, pointIndex) => (
														<div key={pointIndex} className="flex items-center space-x-2">
															<FormLabel>{`Point ${pointIndex + 1} Arabic`}</FormLabel>
															<Textarea
																disabled={loading}
																className='mt-5'
																placeholder="Enter a detail point in Arabic"
																value={point.text}
																onChange={(e) => {
																	const newPoints = [...field.value];
																	newPoints[pointIndex].text = e.target.value;
																	field.onChange(newPoints);
																}}
															/>
															<Button
																disabled={loading}
																type="button"
																onClick={() => {
																	const newPoints = field.value.filter((_, i) => i !== pointIndex);
																	field.onChange(newPoints);
																}}
																variant="destructive"
																size="sm"
															>
																Remove
															</Button>
														</div>
													))}
													<Button
														disabled={loading}
														type="button"
														onClick={() => field.onChange([...field.value, { text: '' }])}
														variant="secondary"
														className="mt-2"
													>
														Add Point
													</Button>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									disabled={loading}
									type="button"
									onClick={() => removeIndustryDetailes2(index)}
									variant="destructive"
									size="sm"
									className="mt-10 w-1/2"
								>
									Remove
								</Button>
								<Separator />
							</div>
						))}
						<Button
							disabled={loading}
							type="button"
							onClick={() =>
								appendIndustryDetailes2({
									title: '',
									title_ar: '',
									industryDetailesPoint2: [],
									industryDetailesPointAr2: [],
								})
							}
							variant="secondary"
							className="mt-2"
						>
							Add new Detailes to Industry
						</Button>
					</div>
					<Separator />
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
