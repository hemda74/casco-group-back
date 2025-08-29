'use client';
import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
	Course, CoursesCategory, CourseType, C_benefit_ar, C_benefit_en, C_content2_ar, C_content2_en, C_content_ar, C_content_en, C_date_ar, C_date_en, C_intro_ar, C_intro_en, C_objective_ar, C_who_should_en, C_who_should_ar, C_objective_en
} from '@prisma/client';
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
	c_title: z.string().min(2),
	c_title_ar: z.string().min(2),
	imageUrl: z.string().min(2),
	price_egp: z.coerce.number().min(1),
	price_uae: z.coerce.number().min(1),
	price_ksa: z.coerce.number().min(1),
	price_usd: z.coerce.number().min(1),
	categoryid: z.string().min(1),
	coursetypeid: z.string().min(1),
	c_short_intro_en: z.string().min(1),
	c_short_intro_ar: z.string().min(1),
	c_delv_and_leaders_en: z.string().min(1),
	c_delv_and_leaders_ar: z.string().min(1),
	c_in_house_en: z.string().min(1),
	c_in_house_ar: z.string().min(1),
	c_duration_en: z.string().min(1),
	c_duration_ar: z.string().min(1),
	c_intro_en: z.array(z.object({
		text: z.string().min(1),
	})),
	c_intro_ar: z.array(z.object({
		text: z.string().min(1),
	})),
	c_who_should_en: z.array(z.object({
		text: z.string().min(1),
	})),
	c_who_should_ar: z.array(z.object({
		text: z.string().min(1),
	})),
	c_objective_en: z.array(z.object({
		text: z.string().min(1),
	})),
	c_objective_ar: z.array(z.object({
		text: z.string().min(1),
	})),
	c_content_en: z.array(z.object({
		text: z.string().min(1),
	})),
	c_content_ar: z.array(z.object({
		text: z.string().min(1),
	})),
	c_benefit_en: z.array(z.object({
		text: z.string().min(1),
	})),
	c_benefit_ar: z.array(z.object({
		text: z.string().min(1),
	})),
	c_content2_en: z.array(z.object({
		text: z.string().min(1),
	})),
	c_content2_ar: z.array(z.object({
		text: z.string().min(1),
	})),
	c_date_en: z.array(z.object({
		text: z.string().min(1),
	})),
	c_date_ar: z.array(z.object({
		text: z.string().min(1),
	})),
});

type CourseFormValues = z.infer<typeof formSchema>;

interface CourseFormProps {
	initialData:
	| (Course & {

		c_intro_ar: C_intro_ar[];
		c_intro_en: C_intro_en[];
		c_date_ar: C_date_ar[];
		c_date_en: C_date_en[];
		c_content_ar: C_content_ar[];
		c_content_en: C_content_en[];
		c_benefit_ar: C_benefit_ar[];
		c_benefit_en: C_benefit_en[];
		c_content2_ar: C_content2_ar[];
		c_content2_en: C_content2_en[];
		c_objective_ar: C_objective_ar[];
		c_objective_en: C_objective_en[];
		c_who_should_ar: C_who_should_ar[];
		c_who_should_en: C_who_should_en[];
	})
	| null;
	categories: CoursesCategory[];
	types: CourseType[];
}

export const CourseForm: React.FC<CourseFormProps> = ({
	initialData,
	categories,
	types,
}) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? 'Edit Course' : 'Create Course';
	const description = initialData
		? 'Edit a Course.'
		: 'Add a new Course';
	const toastMessage = initialData
		? 'Course updated.'
		: 'Course created.';
	const action = initialData ? 'Save changes' : 'Create';
	const defaultValues = initialData
		? {
			...initialData,
			price_egp: parseFloat(
				String(initialData?.price_egp)
			),
			price_uae: parseFloat(
				String(initialData?.price_uae)
			),

			price_usd: parseFloat(
				String(initialData?.price_usd)
			),

			price_ksa: parseFloat(
				String(initialData?.price_ksa)
			),
		}
		: {
			coursetypeid: '',
			c_title: '',
			c_title_ar: '',
			imageUrl: '',
			categoryid: '',
			c_delv_and_leaders_ar: '',
			c_delv_and_leaders_en: '',
			c_duration_ar: '',
			c_duration_en: '',
			c_in_house_ar: '',
			c_in_house_en: '',
			c_short_intro_ar: '',
			c_short_intro_en: '',
			c_intro_ar: [],
			c_intro_en: [],
			c_content2_ar: [],
			c_content2_en: [],
			c_date_ar: [],
			c_date_en: [],
			c_benefit_ar: [],
			c_benefit_en: [],
			c_content_ar: [],
			c_content_en: [],
			c_objective_ar: [],
			c_objective_en: [],
			c_who_should_ar: [],
			c_who_should_en: [],
			price_usd: 0,
			price_egp: 0,
			price_uae: 0,
			price_ksa: 0,
		};
	const form = useForm<CourseFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const { fields: c_intro_enFields, append: appendc_intro_en, remove: removec_intro_en } = useFieldArray({
		control: form.control,
		name: 'c_intro_en',
	});
	const { fields: c_intro_arFields, append: appendc_intro_ar, remove: removec_intro_ar } = useFieldArray({
		control: form.control,
		name: 'c_intro_ar',
	});
	const { fields: c_date_enFields, append: appendc_date_en, remove: removec_date_en } = useFieldArray({
		control: form.control,
		name: 'c_date_en',
	});
	const { fields: c_date_arFields, append: appendc_date_ar, remove: removec_date_ar } = useFieldArray({
		control: form.control,
		name: 'c_date_ar',
	});
	const { fields: c_content_enFields, append: appendc_content_en, remove: removec_content_en } = useFieldArray({
		control: form.control,
		name: 'c_content_en',
	});
	const { fields: c_content_arFields, append: appendc_content_ar, remove: removec_content_ar } = useFieldArray({
		control: form.control,
		name: 'c_content_ar',
	});
	const { fields: c_benefit_enFields, append: appendc_benefit_en, remove: removec_benefit_en } = useFieldArray({
		control: form.control,
		name: 'c_benefit_en',
	});
	const { fields: c_benefit_arFields, append: appendc_benefit_ar, remove: removec_benefit_ar } = useFieldArray({
		control: form.control,
		name: 'c_benefit_ar',
	});
	const { fields: c_content2_enFields, append: appendc_content2_en, remove: removec_content2_en } = useFieldArray({
		control: form.control,
		name: 'c_content2_en',
	});
	const { fields: c_content2_arFields, append: appendc_content2_ar, remove: removec_content2_ar } = useFieldArray({
		control: form.control,
		name: 'c_content2_ar',
	});
	const { fields: c_objective_enFields, append: appendc_objective_en, remove: removec_objective_en } = useFieldArray({
		control: form.control,
		name: 'c_objective_en',
	});
	const { fields: c_objective_arFields, append: appendc_objective_ar, remove: removec_objective_ar } = useFieldArray({
		control: form.control,
		name: 'c_objective_ar',
	});
	const { fields: c_who_should_enFields, append: appendc_who_should_en, remove: removec_who_should_en } = useFieldArray({
		control: form.control,
		name: 'c_who_should_en',
	});
	const { fields: c_who_should_arFields, append: appendc_who_should_ar, remove: removec_who_should_ar } = useFieldArray({
		control: form.control,
		name: 'c_who_should_ar',
	});
	const onSubmit = async (data: CourseFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/courses/${params.courseId}`,
					data
				);
			} else {
				await axios.post(
					`/api/${params.storeId}/courses`,
					data
				);
			}
			router.refresh();
			router.push(`/${params.storeId}/courses`);
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
				`/api/${params.storeId}/courses/${params.courseId}`
			);
			router.refresh();
			router.push(`/${params.storeId}/courses`);
			toast.success('Course deleted.');
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
							name="imageUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Image</FormLabel>
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
							name="categoryid"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course Category
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
						<FormField
							control={form.control}
							name="coursetypeid"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course Type
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
													placeholder="Select a Type"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{types.map(
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
						<FormField
							control={form.control}
							name="c_title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course Title in English
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
							name="c_title_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Arabic
										Title
									</FormLabel>
									<FormControl>
										<Textarea
											disabled={
												loading
											}
											placeholder="c_title_ar"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="price_egp"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										EGP
										Price
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											disabled={
												loading
											}
											placeholder="9.99"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="price_ksa"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										KSA
										Price
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											disabled={
												loading
											}
											placeholder="9.99"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="price_uae"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										UAE
										Price
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											disabled={
												loading
											}
											placeholder="9.99"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="price_usd"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										USD
										Price
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											disabled={
												loading
											}
											placeholder="9.99"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="c_short_intro_en"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course Short Introduction (English)
									</FormLabel>
									<FormControl>
										<Textarea
											disabled={
												loading
											}
											placeholder="Course Short Introduction (English)"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="c_short_intro_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course Short Introduction (Arabic)
									</FormLabel>
									<FormControl>
										<Textarea
											disabled={
												loading
											}
											placeholder="Course Short Introduction (Arabic)"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="c_delv_and_leaders_en"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course Style of Delivery and Course Leaders (English)
									</FormLabel>
									<FormControl>
										<Textarea
											disabled={
												loading
											}
											placeholder="Course Style of Delivery and Course Leaders (English)"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="c_delv_and_leaders_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course Style of Delivery and Course Leaders (Arabic)
									</FormLabel>
									<FormControl>
										<Textarea
											disabled={
												loading
											}
											placeholder="Course Style of Delivery and Course Leaders (Arabic)"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="c_in_house_en"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										In-House Courses (English)
									</FormLabel>
									<FormControl>
										<Textarea
											disabled={
												loading
											}
											placeholder="In-House Courses (English)"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="c_in_house_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										In-House Courses (Arabic)
									</FormLabel>
									<FormControl>
										<Textarea
											disabled={
												loading
											}
											placeholder="In-House Courses (Arabic)"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="c_duration_en"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course Duration (English)
									</FormLabel>
									<FormControl>
										<Textarea
											disabled={
												loading
											}
											placeholder="Course Duration (English)"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="c_duration_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course Duration (Arabic)
									</FormLabel>
									<FormControl>
										<Textarea
											disabled={
												loading
											}
											placeholder="Course Duration (Arabic)"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div>
						<Heading description="Managing Course Introduction (English)" title="Managing Course Introduction (English)" />
						{c_intro_enFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`c_intro_en.${index}.text`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Course Introduction English Pargraph ${index + 1} `}</FormLabel>
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
									onClick={() => removec_intro_en(index)}
									variant="destructive"
									size="sm"
									className="mt-10"
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
								appendc_intro_en({
									text: '',
								})
							}
							variant="secondary"
							className="mt-2"
						>
							Add new Paragraph
						</Button>
					</div>
					<Separator />
					<div>
						<Heading description="Managing Course Introduction (Arabic)" title="Managing Course Introduction (Arabic)" />
						{c_intro_arFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`c_intro_ar.${index}.text`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Course Introduction Arabic ${index + 1} `}</FormLabel>
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
									onClick={() => removec_intro_ar(index)}
									variant="destructive"
									size="sm"
									className="mt-10"
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
								appendc_intro_ar({
									text: '',
								})
							}
							variant="secondary"
							className="mt-2"
						>
							Add new Paragraph
						</Button>
					</div>
					<Separator />
					<div>
						<Heading description="Managing Course Dates (English)" title="Managing Course Dates (English)" />
						{c_date_enFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`c_date_en.${index}.text`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Course Dates (English) ${index + 1} `}</FormLabel>
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
									onClick={() => removec_date_en(index)}
									variant="destructive"
									size="sm"
									className="mt-10"
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
								appendc_date_en({
									text: '',
								})
							}
							variant="secondary"
							className="mt-2"
						>
							Add new Paragraph
						</Button>
					</div>
					<Separator />
					<div>
						<Heading description="Managing Course Dates (Arabic)" title="Managing Course Dates (Arabic)" />
						{c_date_arFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`c_date_ar.${index}.text`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Managing Course Dates Arabic Pargraph ${index + 1} `}</FormLabel>
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
									onClick={() => removec_date_ar(index)}
									variant="destructive"
									size="sm"
									className="mt-10"
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
								appendc_date_ar({
									text: '',
								})
							}
							variant="secondary"
							className="mt-2"
						>
							Add new Paragraph
						</Button>
					</div>
					<Separator />
					<div>
						<Heading description="Managing Course Content (English)" title="Managing Course Content (English)" />
						{c_content_enFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`c_content_en.${index}.text`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`c_content_en Pargraph ${index + 1} `}</FormLabel>
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
									onClick={() => removec_content_en(index)}
									variant="destructive"
									size="sm"
									className="mt-10"
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
								appendc_content_en({
									text: '',
								})
							}
							variant="secondary"
							className="mt-2"
						>
							Add new Paragraph
						</Button>
					</div>
					<Separator />
					<div>
						<Heading description="Managing Course Content (Arabic)" title="Managing Course Content (Arabic)" />
						{c_content_arFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`c_content_ar.${index}.text`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Content Pargraph (Arabic) ${index + 1} `}</FormLabel>
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
									onClick={() => removec_content_ar(index)}
									variant="destructive"
									size="sm"
									className="mt-10"
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
								appendc_content_ar({
									text: '',
								})
							}
							variant="secondary"
							className="mt-2"
						>
							Add new Paragraph
						</Button>
					</div>
					<Separator />
					<div>
						<Heading description="Managing Course Benefits (English)" title="Managing Course Benefits (English)" />
						{c_benefit_enFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`c_benefit_en.${index}.text`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Benefits Pargraph (English) ${index + 1} `}</FormLabel>
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
									onClick={() => removec_benefit_en(index)}
									variant="destructive"
									size="sm"
									className="mt-10"
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
								appendc_benefit_en({
									text: '',
								})
							}
							variant="secondary"
							className="mt-2"
						>
							Add new Paragraph
						</Button>
					</div>
					<Separator />
					<div>
						<Heading description="Managing Course Benefits (Arabic)" title="Managing Course Benefits (Arabic)" />
						{c_benefit_arFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`c_benefit_ar.${index}.text`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Benefits Pargraph (Arabic) ${index + 1} `}</FormLabel>
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
									onClick={() => removec_benefit_ar(index)}
									variant="destructive"
									size="sm"
									className="mt-10"
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
								appendc_benefit_ar({
									text: '',
								})
							}
							variant="secondary"
							className="mt-2"
						>
							Add new Paragraph
						</Button>
					</div>
					<Separator />
					<div>
						<Heading description="Managing Course Objectives (English)" title="Managing Course Objectives (English)" />
						{c_objective_enFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`c_objective_en.${index}.text`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Objectives Pargraph (English) ${index + 1} `}</FormLabel>
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
									onClick={() => removec_objective_en(index)}
									variant="destructive"
									size="sm"
									className="mt-10"
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
								appendc_objective_en({
									text: '',
								})
							}
							variant="secondary"
							className="mt-2"
						>
							Add new Paragraph
						</Button>
					</div>
					<Separator />
					<div>
						<Heading description="Managing Course Objectives (Arabic)" title="Managing Course Objectives (Arabic)" />
						{c_objective_arFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`c_objective_ar.${index}.text`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`c_objective_ar Pargraph (Arabic) ${index + 1} `}</FormLabel>
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
									onClick={() => removec_objective_ar(index)}
									variant="destructive"
									size="sm"
									className="mt-10"
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
								appendc_objective_ar({
									text: '',
								})
							}
							variant="secondary"
							className="mt-2"
						>
							Add new Paragraph
						</Button>
					</div>
					<Separator />
					<div>
						<Heading description="Managing Course Who Should Attend (English)" title="Managing Course Who Should Attend (English)" />
						{c_who_should_enFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`c_who_should_en.${index}.text`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Who Should Attend Pargraph (English) ${index + 1} `}</FormLabel>
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
									onClick={() => removec_who_should_en(index)}
									variant="destructive"
									size="sm"
									className="mt-10"
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
								appendc_who_should_en({
									text: '',
								})
							}
							variant="secondary"
							className="mt-2"
						>
							Add new Paragraph
						</Button>
					</div>
					<Separator />
					<div>
						<Heading description="Managing Course Who Should Attend (Arabic)" title="Managing Course Who Should Attend (Arabic)" />
						{c_who_should_arFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`c_who_should_ar.${index}.text`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Who Should Attend Pargraph (Arabic)  ${index + 1} `}</FormLabel>
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
									onClick={() => removec_who_should_ar(index)}
									variant="destructive"
									size="sm"
									className="mt-10"
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
								appendc_who_should_ar({
									text: '',
								})
							}
							variant="secondary"
							className="mt-2"
						>
							Add new Paragraph
						</Button>
					</div>
					<Separator />
					<div>
						<Heading description="Managing Course Certification (English)" title="Managing Course Certification (English)" />
						{c_content2_enFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`c_content2_en.${index}.text`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Certification Pargraph (English) ${index + 1} `}</FormLabel>
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
									onClick={() => removec_content2_en(index)}
									variant="destructive"
									size="sm"
									className="mt-10"
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
								appendc_content2_en({
									text: '',
								})
							}
							variant="secondary"
							className="mt-2"
						>
							Add new Paragraph
						</Button>
					</div>
					<Separator />
					<div>
						<Heading description="Managing Course Certification (Arabic)" title="Managing Course Certification (Arabic)" />
						{c_content2_arFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`c_content2_ar.${index}.text`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Certification Pargraph ${index + 1} `}</FormLabel>
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
									onClick={() => removec_content2_ar(index)}
									variant="destructive"
									size="sm"
									className="mt-10"
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
								appendc_content2_ar({
									text: '',
								})
							}
							variant="secondary"
							className="mt-2"
						>
							Add new Paragraph
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
