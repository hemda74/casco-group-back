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
	Course,
	CoursesCategory,
	CourseType,
	C_benefit_ar,
	C_benefit_en,
	C_content2_ar,
	C_content2_en,
	C_content_ar,
	C_content_en,
	C_date_ar,
	C_date_en,
	C_intro_ar,
	C_intro_en,
	C_objective_ar,
	C_who_should_en,
	C_who_should_ar,
	C_objective_en
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

// Schema definition
const textItemSchema = z.object({
	text: z.string().min(1, 'Text is required'),
});

const formSchema = z.object({
	c_title: z.string().min(2, 'Title must be at least 2 characters'),
	c_title_ar: z.string().min(2, 'Arabic title must be at least 2 characters'),
	imageUrl: z.string().min(2, 'Image is required'),
	price_egp: z.coerce.number().min(1, 'EGP price must be greater than 0'),
	price_uae: z.coerce.number().min(1, 'UAE price must be greater than 0'),
	price_ksa: z.coerce.number().min(1, 'KSA price must be greater than 0'),
	price_usd: z.coerce.number().min(1, 'USD price must be greater than 0'),
	categoryid: z.string().min(1, 'Category is required'),
	coursetypeid: z.string().min(1, 'Course type is required'),
	c_short_intro_en: z.string().min(1, 'English short introduction is required'),
	c_short_intro_ar: z.string().min(1, 'Arabic short introduction is required'),
	c_delv_and_leaders_en: z.string().min(1, 'English delivery and leaders is required'),
	c_delv_and_leaders_ar: z.string().min(1, 'Arabic delivery and leaders is required'),
	c_in_house_en: z.string().min(1, 'English in-house info is required'),
	c_in_house_ar: z.string().min(1, 'Arabic in-house info is required'),
	c_duration_en: z.string().min(1, 'English duration is required'),
	c_duration_ar: z.string().min(1, 'Arabic duration is required'),
	c_intro_en: z.array(textItemSchema),
	c_intro_ar: z.array(textItemSchema),
	c_who_should_en: z.array(textItemSchema),
	c_who_should_ar: z.array(textItemSchema),
	c_objective_en: z.array(textItemSchema),
	c_objective_ar: z.array(textItemSchema),
	c_content_en: z.array(textItemSchema),
	c_content_ar: z.array(textItemSchema),
	c_benefit_en: z.array(textItemSchema),
	c_benefit_ar: z.array(textItemSchema),
	c_content2_en: z.array(textItemSchema),
	c_content2_ar: z.array(textItemSchema),
	c_date_en: z.array(textItemSchema),
	c_date_ar: z.array(textItemSchema),
});

type CourseFormValues = z.infer<typeof formSchema>;

interface CourseFormProps {
	initialData: (Course & {
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
	}) | null;
	categories: CoursesCategory[];
	types: CourseType[];
}

// Default form values
const getDefaultValues = (initialData: CourseFormProps['initialData']): CourseFormValues => {
	if (initialData) {
		return {
			...initialData,
			price_egp: parseFloat(String(initialData.price_egp)),
			price_uae: parseFloat(String(initialData.price_uae)),
			price_usd: parseFloat(String(initialData.price_usd)),
			price_ksa: parseFloat(String(initialData.price_ksa)),
			c_title: '',
			c_title_ar: '',
			c_short_intro_en: '',
			c_short_intro_ar: '',
			c_duration_en: '',
			c_duration_ar: '',
			c_in_house_en: '',
			c_in_house_ar: '',
			c_delv_and_leaders_en: '',
			c_delv_and_leaders_ar: '',
			imageUrl: '',
			c_intro_en: [],
			c_intro_ar: [],
			c_who_should_en: [],
			c_who_should_ar: [],
			c_objective_en: [],
			c_objective_ar: [],
			c_content_en: [],
			c_content_ar: [],
			c_benefit_en: [],
			c_benefit_ar: [],
			c_content2_en: [],
			c_content2_ar: [],
			c_date_en: [],
			c_date_ar: [],
			categoryid: '',
			coursetypeid: ''
		};
	}

	return {
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
};

// Reusable dynamic section component
interface DynamicSectionProps {
	title: string;
	description: string;
	fields: Array<{ id: string }>;
	fieldName: string;
	onAppend: (value: { text: string }) => void;
	onRemove: (index: number) => void;
	control: any;
	loading: boolean;
}

const DynamicSection: React.FC<DynamicSectionProps> = ({
	title,
	description,
	fields,
	fieldName,
	onAppend,
	onRemove,
	control,
	loading,
}) => (
	<div>
		<Heading description={description} title={title} />
		{fields.map((field, index) => (
			<div key={field.id} className="grid grid-cols-2 gap-8 mb-4">
				<FormField
					control={control}
					name={`${fieldName}.${index}.text`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>{`${title} Paragraph ${index + 1}`}</FormLabel>
							<FormControl>
								<Textarea
									disabled={loading}
									placeholder="Enter content"
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
					onClick={() => onRemove(index)}
					variant="destructive"
					size="sm"
					className="mt-10"
				>
					Remove
				</Button>
			</div>
		))}
		<Button
			disabled={loading}
			type="button"
			onClick={() => onAppend({ text: '' })}
			variant="secondary"
			className="mt-2"
		>
			Add New Paragraph
		</Button>
	</div>
);

export const CourseForm: React.FC<CourseFormProps> = ({
	initialData,
	categories,
	types,
}) => {
	const params = useParams();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	// Form configuration
	const isEditing = Boolean(initialData);
	const title = isEditing ? 'Edit Course' : 'Create Course';
	const description = isEditing ? 'Edit a Course.' : 'Add a new Course';
	const toastMessage = isEditing ? 'Course updated.' : 'Course created.';
	const action = isEditing ? 'Save changes' : 'Create';

	const form = useForm<CourseFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: getDefaultValues(initialData),
	});

	// Field arrays setup
	const fieldArrays = {
		c_intro_en: useFieldArray({ control: form.control, name: 'c_intro_en' }),
		c_intro_ar: useFieldArray({ control: form.control, name: 'c_intro_ar' }),
		c_date_en: useFieldArray({ control: form.control, name: 'c_date_en' }),
		c_date_ar: useFieldArray({ control: form.control, name: 'c_date_ar' }),
		c_content_en: useFieldArray({ control: form.control, name: 'c_content_en' }),
		c_content_ar: useFieldArray({ control: form.control, name: 'c_content_ar' }),
		c_benefit_en: useFieldArray({ control: form.control, name: 'c_benefit_en' }),
		c_benefit_ar: useFieldArray({ control: form.control, name: 'c_benefit_ar' }),
		c_content2_en: useFieldArray({ control: form.control, name: 'c_content2_en' }),
		c_content2_ar: useFieldArray({ control: form.control, name: 'c_content2_ar' }),
		c_objective_en: useFieldArray({ control: form.control, name: 'c_objective_en' }),
		c_objective_ar: useFieldArray({ control: form.control, name: 'c_objective_ar' }),
		c_who_should_en: useFieldArray({ control: form.control, name: 'c_who_should_en' }),
		c_who_should_ar: useFieldArray({ control: form.control, name: 'c_who_should_ar' }),
	};

	// Form submission handler
	const onSubmit = async (data: CourseFormValues) => {
		try {
			setLoading(true);
			const url = isEditing
				? `/api/${params.storeId}/courses/${params.courseId}`
				: `/api/${params.storeId}/courses`;

			const method = isEditing ? axios.patch : axios.post;
			await method(url, data);

			router.refresh();
			router.push(`/${params.storeId}/courses`);
			toast.success(toastMessage);
		} catch (error) {
			toast.error('Something went wrong.');
		} finally {
			setLoading(false);
		}
	};

	// Delete handler
	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/${params.storeId}/courses/${params.courseId}`);
			router.refresh();
			router.push(`/${params.storeId}/courses`);
			toast.success('Course deleted.');
		} catch (error) {
			toast.error('Make sure you removed all products using this course first.');
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	// Price fields configuration
	const priceFields = [
		{ name: 'price_egp' as const, label: 'EGP Price' },
		{ name: 'price_ksa' as const, label: 'KSA Price' },
		{ name: 'price_uae' as const, label: 'UAE Price' },
		{ name: 'price_usd' as const, label: 'USD Price' },
	];

	// Text area fields configuration
	const textFields = [
		{ name: 'c_short_intro_en' as const, label: 'Course Short Introduction (English)' },
		{ name: 'c_short_intro_ar' as const, label: 'Course Short Introduction (Arabic)' },
		{ name: 'c_delv_and_leaders_en' as const, label: 'Course Style of Delivery and Course Leaders (English)' },
		{ name: 'c_delv_and_leaders_ar' as const, label: 'Course Style of Delivery and Course Leaders (Arabic)' },
		{ name: 'c_in_house_en' as const, label: 'In-House Courses (English)' },
		{ name: 'c_in_house_ar' as const, label: 'In-House Courses (Arabic)' },
		{ name: 'c_duration_en' as const, label: 'Course Duration (English)' },
		{ name: 'c_duration_ar' as const, label: 'Course Duration (Arabic)' },
	];

	// Dynamic sections configuration
	const dynamicSections = [
		{ key: 'c_intro_en', title: 'Course Introduction (English)', description: 'Managing Course Introduction (English)' },
		{ key: 'c_intro_ar', title: 'Course Introduction (Arabic)', description: 'Managing Course Introduction (Arabic)' },
		{ key: 'c_date_en', title: 'Course Dates (English)', description: 'Managing Course Dates (English)' },
		{ key: 'c_date_ar', title: 'Course Dates (Arabic)', description: 'Managing Course Dates (Arabic)' },
		{ key: 'c_content_en', title: 'Course Content (English)', description: 'Managing Course Content (English)' },
		{ key: 'c_content_ar', title: 'Course Content (Arabic)', description: 'Managing Course Content (Arabic)' },
		{ key: 'c_benefit_en', title: 'Course Benefits (English)', description: 'Managing Course Benefits (English)' },
		{ key: 'c_benefit_ar', title: 'Course Benefits (Arabic)', description: 'Managing Course Benefits (Arabic)' },
		{ key: 'c_objective_en', title: 'Course Objectives (English)', description: 'Managing Course Objectives (English)' },
		{ key: 'c_objective_ar', title: 'Course Objectives (Arabic)', description: 'Managing Course Objectives (Arabic)' },
		{ key: 'c_who_should_en', title: 'Who Should Attend (English)', description: 'Managing Course Who Should Attend (English)' },
		{ key: 'c_who_should_ar', title: 'Who Should Attend (Arabic)', description: 'Managing Course Who Should Attend (Arabic)' },
		{ key: 'c_content2_en', title: 'Course Certification (English)', description: 'Managing Course Certification (English)' },
		{ key: 'c_content2_ar', title: 'Course Certification (Arabic)', description: 'Managing Course Certification (Arabic)' },
	];

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>

			<div className="flex items-center justify-between">
				<Heading title={title} description={description} />
				{isEditing && (
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
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
					{/* Basic Information Grid */}
					<div className="md:grid md:grid-cols-2 gap-8">
						{/* Image Upload */}
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

						{/* Course Category */}
						<FormField
							control={form.control}
							name="categoryid"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Category</FormLabel>
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
													value={String(category.id)} // Fixed: Convert to string
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

						{/* Course Type */}
						<FormField
							control={form.control}
							name="coursetypeid"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Type</FormLabel>
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
													placeholder="Select a type"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{types.map((type) => (
												<SelectItem
													key={type.id}
													value={String(type.id)} // Fixed: Convert to string
												>
													{type.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Course Titles */}
						<FormField
							control={form.control}
							name="c_title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Title (English)</FormLabel>
									<FormControl>
										<Textarea
											disabled={loading}
											placeholder="Enter course title in English"
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
									<FormLabel>Course Title (Arabic)</FormLabel>
									<FormControl>
										<Textarea
											disabled={loading}
											placeholder="Enter course title in Arabic"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Price Fields */}
						{priceFields.map(({ name, label }) => (
							<FormField
								key={name}
								control={form.control}
								name={name}
								render={({ field }) => (
									<FormItem>
										<FormLabel>{label}</FormLabel>
										<FormControl>
											<Input
												type="number"
												disabled={loading}
												placeholder="0.00"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}

						{/* Text Area Fields */}
						{textFields.map(({ name, label }) => (
							<FormField
								key={name}
								control={form.control}
								name={name}
								render={({ field }) => (
									<FormItem>
										<FormLabel>{label}</FormLabel>
										<FormControl>
											<Textarea
												disabled={loading}
												placeholder={label}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}
					</div>

					{/* Dynamic Sections */}
					{dynamicSections.map((section, index) => (
						<div key={section.key}>
							<Separator />
							<DynamicSection
								title={section.title}
								description={section.description}
								fields={fieldArrays[section.key as keyof typeof fieldArrays].fields}
								fieldName={section.key}
								onAppend={fieldArrays[section.key as keyof typeof fieldArrays].append}
								onRemove={fieldArrays[section.key as keyof typeof fieldArrays].remove}
								control={form.control}
								loading={loading}
							/>
						</div>
					))}

					<Separator />

					{/* Submit Button */}
					<Button disabled={loading} className="ml-auto" type="submit">
						{action}
					</Button>
				</form>
			</Form>
		</>
	);
};