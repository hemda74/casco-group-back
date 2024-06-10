'use client';

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { CoursesCategory, Image, Course } from '@prisma/client';
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
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
	name: z.string().min(1),
	name_ar: z.string().min(1),
	price_usd: z.coerce.number().min(1),
	images: z.object({ url: z.string() }).array(),
	price_egp: z.coerce.number().min(1),
	price_uae: z.coerce.number().min(1),
	price_ksa: z.coerce.number().min(1),
	categoryId: z.string().min(1),
	intro: z.string().min(1),
	intro_ar: z.string().min(1),
	short_intro: z.string().min(1),
	short_intro_ar: z.string().min(1),
	duaration: z.string().min(1),
	duration_ar: z.string().min(1),
	who_sh_att: z.string().min(1),
	who_sh_att_ar: z.string().min(1),
	c_obje_list: z.string().min(1),
	c_obje_list_ar: z.string().min(1),
	c_obje: z.string().min(1),
	course_type: z.string().min(1),
	course_type_ar: z.string().min(1),
	c_obje_ar: z.string().min(1),
	c_content: z.string().min(1),
	c_content_ar: z.string().min(1),
	wh_we_bnfi: z.string().min(1),
	wh_we_bnfi_ar: z.string().min(1),
	c_in_house: z.string().min(1),
	c_in_house_ar: z.string().min(1),
	delv_and_leaders: z.string().min(1),
	delv_and_leaders_ar: z.string().min(1),
	course_date: z.string().min(1),
	course_date_ar: z.string().min(1),
	certification: z.string().min(1),
	certification_ar: z.string().min(1),
});

type CourseFormValues = z.infer<typeof formSchema>;

interface CourseFormProps {
	initialData:
	| (Course & {
		images: Image[];
	})
	| null;
	categories: CoursesCategory[];
}

export const CourseForm: React.FC<CourseFormProps> = ({
	initialData,
	categories,
}) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? 'Edit course' : 'Create course';
	const description = initialData ? 'Edit a course.' : 'Add a new Course';
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
			name: '',
			name_ar: '',
			duaration: '',
			duration_ar: '',
			price_usd: 0,
			price_egp: 0,
			price_uae: 0,
			price_ksa: 0,
			categoryId: '',
			intro: '',
			intro_ar: '',
			short_intro: '',
			short_intro_ar: '',
			who_sh_att: '',
			who_sh_att_ar: '',
			c_obje_list: '',
			c_obje_list_ar: '',
			c_obje: '',
			course_type: '',
			course_type_ar: '',
			c_obje_ar: '',
			c_content: '',
			c_content_ar: '',
			wh_we_bnfi: '',
			wh_we_bnfi_ar: '',
			c_in_house: '',
			c_in_house_ar: '',
			delv_and_leaders: '',
			delv_and_leaders_ar: '',
			course_date: '',
			course_date_ar: '',
			certification: '',
			certification_ar: '',
			images: [],
		};

	const form = useForm<CourseFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
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
			toast.error('Something went wrong.', error);
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
					<FormField
						control={form.control}
						name="images"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Images
								</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value.map(
											(
												image
											) =>
												image.url
										)}
										disabled={
											loading
										}
										onChange={(
											url
										) =>
											field.onChange(
												[
													...field.value,
													{
														url,
													},
												]
											)
										}
										onRemove={(
											url
										) =>
											field.onChange(
												[
													...field.value.filter(
														(
															current
														) =>
															current.url !==
															url
													),
												]
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="md:grid md:grid-cols-1 gap-8">
						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
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
										<Textarea
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
							name="duaration"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Duration
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="duration_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Duration
										in
										Arabic
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="intro"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Introduction
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="intro_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Introduction
										in
										Arabic
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="short_intro"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Short
										Introduction
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="short_intro_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Short
										Introduction
										in
										Arabic
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="who_sh_att"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										How
										Should
										Attend
										this
										Course
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="who_sh_att_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										How
										Should
										Attend
										this
										Course
										in
										Arabic
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="c_obje"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Objective
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="c_obje_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Objective
										in
										Arabic
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="c_obje_list"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Objective
										List
										in
										Arabic
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="c_obje_list_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Objective
										List
										in
										Arabic
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="course_date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Date
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="course_date_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Date
										in
										Arabic
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="c_content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Content
									</FormLabel>
									<FormControl>
										<Textarea
											disabled={
												loading
											}
											placeholder=" Enter a Value"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="c_content_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Content
										in
										Arabic
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="course_type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Type
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="course_type_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Type
										in
										Arabic
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="wh_we_bnfi"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										What
										we
										benfite
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="wh_we_bnfi_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										what
										we
										benfite
										in
										arabic
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="c_in_house"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										in
										house
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="c_in_house_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										in
										house
										in
										arabic
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="delv_and_leaders"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										delvairy
										and
										leaders
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="delv_and_leaders_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										delvairy
										and
										leaders
										in
										arabic
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="certification"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Certification
									</FormLabel>
									<FormControl>
										<Textarea
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
							name="certification_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Certification
										In
										Arabic
									</FormLabel>
									<FormControl>
										<Textarea
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
