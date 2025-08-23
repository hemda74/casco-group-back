'use client';
import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { Event2, NewsCategory, paragrph_event2, paragrph_event_ar2 } from '@prisma/client';
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
	imageUrl: z.string().min(1),
	title: z.string().min(1),
	title_ar: z.string().min(1),
	categoryId: z.string().min(1),
	paragraph_event2: z.array(z.any()),
	paragraph_event_ar2: z.array(z.any()),
	date_of_event: z.string().min(1),
	date_of_event_ar: z.string().min(1)
});

type EventFormValues = z.infer<typeof formSchema>;

interface EventFormProps {
	initialData:
	| (Event2 & {
		paragraph_event2: paragrph_event2[];
		paragraph_event_ar2: paragrph_event_ar2[];
	})
	| null;
	categories: NewsCategory[];
}
export const EventForm: React.FC<EventFormProps> = ({
	initialData,
	categories,
}) => {
	const params = useParams();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const title = initialData ? 'Edit paper' : 'Create paper';
	const description = initialData ? 'Edit a paper.' : 'Add a new paper';
	const toastMessage = initialData ? 'paper updated.' : 'paper created.';
	const action = initialData ? 'Save changes' : 'Create';
	const defaultValues = initialData
		? {
			...initialData,
		} : {
			title: '',
			title_ar: '',
			categoryId: '',
			imageUrl: '',
			date_of_event: '',
			date_of_event_ar: '',
			paragraph_event2: [],
			paragraph_event_ar2: [],
		}
	const form = useForm<EventFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});
	const { fields: paragraph_event2Fields, append: appendparagraph_event2, remove: removeparagraph_event2 } = useFieldArray({
		control: form.control,
		name: 'paragraph_event2',
	});
	const { fields: paragraph_event_ar2Fields, append: appendparagraph_event_ar2, remove: removeparagraph_event_ar2 } = useFieldArray({
		control: form.control,
		name: 'paragraph_event_ar2',
	});
	const onSubmit = async (data: EventFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/white-papers/${params.paperId}`,
					data
				);
			} else {
				await axios.post(
					`/api/${params.storeId}/white-papers`,
					data
				);
			}
			router.refresh();
			router.push(`/${params.storeId}/white-papers`);
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
			await axios.delete(`/api/${params.storeId}/white-papers/${params.paperId}`);
			router.refresh();
			router.push(`/${params.storeId}/white-papers`);
			toast.success('event deleted.');
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
				<Heading title={title} description={description} />
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
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
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
					{/* Rest of your form fields */}
					<div className="md:grid md:grid-cols-2 gap-8">
						{/* Other form fields */}
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
												<SelectItem key={category.id} value={category.id}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="title"
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
							name="title_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Arabic Title</FormLabel>
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
							name="date_of_event"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Date Of Aritcle in English</FormLabel>
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
							name="date_of_event_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Date Of Aritcle in Arabic</FormLabel>
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
					</div>
					<div>
						<Heading description='Paragraph ' title="Paragraph  (English)" />
						{paragraph_event2Fields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`paragraph_event2.${index}.text`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Paragraph ${index + 1}`}</FormLabel>
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
									className='w-1/2 mt-10'
									onClick={() => removeparagraph_event2(index)}
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
								appendparagraph_event2({
									text: ''
								})
							}
						>
							Add New Point
						</Button>
					</div>
					<hr />
					<div>
						<Heading description='Paragraph ' title="Paragraph  (Arabic)" />
						{paragraph_event_ar2Fields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`paragraph_event_ar2.${index}.text`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>{`Paragraph ${index + 1}`}</FormLabel>
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
									className='w-1/2 mt-10'
									onClick={() => removeparagraph_event_ar2(index)}
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
								appendparagraph_event_ar2({
									text: ''
								})
							}
						>
							Add New Paragraph
						</Button>
					</div>
					<Button disabled={loading} className="ml-auto" type="submit">
						{action}
					</Button>
				</form>
			</Form>
		</>
	);
};