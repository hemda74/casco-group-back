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
	images: z.object({ url: z.string() }).array(),
	price: z.coerce.number().min(1),
	categoryId: z.string().min(1),
	intro: z.string().min(1),
	intro_ar: z.string().min(1),
	duaration: z.string().min(1),
	duration_ar: z.string().min(1),
	who_sh_att: z.string().min(1),
	who_sh_att_ar: z.string().min(1),
	c_obje: z.string().min(1),
	c_obje_ar: z.string().min(1),
	c_content: z.string().min(1),
	c_content_ar: z.string().min(1),
	wh_we_bnfi: z.string().min(1),
	wh_we_bnfi_ar: z.string().min(1),
	c_in_house: z.string().min(1),
	c_in_house_ar: z.string().min(1),
	delv_and_leaders: z.string().min(1),
	delv_and_leaders_ar: z.string().min(1),
	date_and_rev_1: z.string().min(1),
	date_and_rev_2: z.string().min(1),
	date_and_rev_3: z.string().min(1),
	date_and_rev_4: z.string().min(1),
	date_and_rev_5: z.string().min(1),
	date_and_rev_6: z.string().min(1),
	certification: z.string().min(1),

	// colorId: z.string().min(1),
	// sizeId: z.string().min(1),
	// isFeatured: z.boolean().default(false).optional(),
	// isArchived: z.boolean().default(false).optional(),
});

type CourseFormValues = z.infer<typeof formSchema>;

interface CourseFormProps {
	initialData:
		| (Course & {
				images: Image[];
		  })
		| null;
	categories: CoursesCategory[];
	// colors: Color[];
	// sizes: Size[];
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
				price: parseFloat(String(initialData?.price)),
		  }
		: {
				name: '',
				name_ar: '',
				images: [],
				price: 0,
				categoryId: '',
				intro: '',
				intro_ar: '',
				duaration: '',
				duration_ar: '',
				who_sh_att: '',
				who_sh_att_ar: '',
				c_obje: '',
				c_obje_ar: '',
				c_content: '',
				c_content_ar: '',
				wh_we_bnfi: '',
				wh_we_bnfi_ar: '',
				c_in_house: '',
				c_in_house_ar: '',
				delv_and_leaders: '',
				delv_and_leaders_ar: '',
				date_and_rev_1: '',
				date_and_rev_2: '',
				date_and_rev_3: '',
				date_and_rev_4: '',
				date_and_rev_5: '',
				date_and_rev_6: '',
				certification: '',
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
							name="duaration"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Duration
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
							name="duration_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Duration
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
							name="c_obje"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Objective
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
							name="c_content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Content
									</FormLabel>
									<FormControl>
										<Input
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
							name="wh_we_bnfi"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										What
										we
										benfite
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
							name="c_in_house"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										in
										house
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
							name="certification"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Certification
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
							name="date_and_rev_1"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Date
										&
										Revuene_1
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
							name="date_and_rev_2"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Date
										&
										Revuene_2
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
							name="date_and_rev_3"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Date
										&
										Revuene_3
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
							name="date_and_rev_4"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Date
										&
										Revuene_4
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
							name="date_and_rev_5"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Date
										&
										Revuene_5
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
							name="date_and_rev_6"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Course
										Date
										&
										Revuene_6
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
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
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
