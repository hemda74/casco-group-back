'use client';

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { Team, Image7, TeamMember } from '@prisma/client';
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
import { Checkbox } from '@/components/ui/checkbox';
import { title } from 'process';

const formSchema = z.object({
	name: z.string().min(1),
	name_ar: z.string().min(1),
	teamId: z.string().min(1),
	title: z.string().min(1),
	title_ar: z.string().min(1),
	brief_1: z.string().min(1),
	brief_1_ar: z.string().min(1),
	brief_2_ar: z.string().min(1),
	brief_2: z.string().min(1),
	brief_3_ar: z.string().min(1),
	brief_3: z.string().min(1),
	images: z.object({ url: z.string() }).array(),

});

type CourseFormValues = z.infer<typeof formSchema>;

interface CourseFormProps {
	initialData:
	| (TeamMember & {
		images: Image7[];
	})
	| null;
	teams: Team[];
}

export const CourseForm: React.FC<CourseFormProps> = ({
	initialData,
	teams,
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

	const form = useForm<CourseFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: '',
			name_ar: '',
			teamId: '',
			title: '',
			title_ar: '',
			brief_1: '',
			brief_2: '',
			brief_3: '',
			brief_1_ar: '',
			brief_2_ar: '',
			brief_3_ar: '',
			images: [],
		},
	});

	const onSubmit = async (data: CourseFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/team-members/${params.teammemberId}`,
					data
				);
			} else {
				await axios.post(
					`/api/${params.storeId}/team-members`,
					data
				);
			}
			router.refresh();
			router.push(`/${params.storeId}/team-members`);
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
				`/api/${params.storeId}/team-members/${params.teammemberId}`
			);
			router.refresh();
			router.push(`/${params.storeId}/team-members`);
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
							name="teamId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Member Team
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
											{teams.map(
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
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Title
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
							name="title_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Title
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
							name="brief_1"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										First Pargraph
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
							name="brief_1_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										First Pargraph In Arabic
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
							name="brief_2"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Second Pargraph
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
							name="brief_2_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Second Pargraph In Arabic
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
						/>	<FormField
							control={form.control}
							name="brief_3"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Third Pargraph
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
							name="brief_3_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Third Pargraph In Arabic
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
