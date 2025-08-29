'use client';
import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { News, NewsCategory, paragrph_news, paragrph_news_ar } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation'; // Corrected from 'next/navigation'
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
	categoryid: z.string().min(1),
	paragraph_news: z.array(z.any()),
	paragraph_news_ar: z.array(z.any()),
	date_of_news: z.string().min(1),
	date_of_news_ar: z.string().min(1)
});

type NewsFormValues = z.infer<typeof formSchema>;

interface NewsFormProps {
	initialData:
	| (News & {
		paragraph_news: paragrph_news[];
		paragraph_news_ar: paragrph_news_ar[];
	})
	| null;
	categories: NewsCategory[];
}

export const NewsForm: React.FC<NewsFormProps> = ({
	initialData,
	categories,
}) => {
	const params = useParams();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const title = initialData ? 'Edit News' : 'Create News';
	const description = initialData ? 'Edit a News.' : 'Add a new News';
	const toastMessage = initialData ? 'News updated.' : 'News created.';
	const action = initialData ? 'Save changes' : 'Create';
	const defaultValues = initialData
		? {
			...initialData,
		} : {
			title: '',
			title_ar: '',
			categoryid: '',
			imageUrl: '',
			date_of_news: '',
			date_of_news_ar: '',
			paragraph_news: [],
			paragraph_news_ar: [],
		}
	const form = useForm<NewsFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});
	const { fields: paragraph_newsFields, append: appendparagraph_news, remove: removeparagraph_news } = useFieldArray({
		control: form.control,
		name: 'paragraph_news',
	});
	const { fields: paragraph_news_arFields, append: appendparagraph_news_ar, remove: removeparagraph_news_ar } = useFieldArray({
		control: form.control,
		name: 'paragraph_news_ar',
	});

	const onSubmit = async (data: NewsFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/news/${params.newsid}`,
					data
				);
			} else {
				await axios.post(
					`/api/${params.storeId}/news`,
					data
				);
			}
			router.refresh();
			router.push(`/${params.storeId}/news`);
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
			await axios.delete(`/api/${params.storeId}/news/${params.NewsId}`);
			router.refresh();
			router.push(`/${params.storeId}/news`);
			toast.success('News deleted.');
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
						<FormField
							control={form.control}
							name="categoryid"
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
						{/* Other form fields */}
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
							name="date_of_news"
							render={({ field }) => (
								<FormItem>
									<FormLabel>News Date In English</FormLabel>
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
						/>	<FormField
							control={form.control}
							name="date_of_news_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>News Date in Arabic</FormLabel>
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
						{paragraph_newsFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`paragraph_news.${index}.text`}
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
								<Button
									disabled={loading}
									variant="destructive"
									className='w-1/2 mt-10'
									onClick={() => removeparagraph_news(index)}
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
								appendparagraph_news({
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
						{paragraph_news_arFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`paragraph_news_ar.${index}.text`}
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
								<Button
									disabled={loading}
									variant="destructive"
									className='w-1/2 mt-10'
									onClick={() => removeparagraph_news_ar(index)}
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
								appendparagraph_news_ar({
									text: ''
								})
							}
						>
							Add New Point
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