'use client';
import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash, PlusCircle } from 'lucide-react';
import { News, Image5, NewsCategory, paragrph_news, paragrph_news_ar } from '@prisma/client';
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
	images: z.object({ url: z.string() }).array(),
	title: z.string().min(1),
	title_ar: z.string().min(1),
	categoryId: z.string().min(1),
	paragraph_news: z.array(z.string()),
	paragraph_news_ar: z.array(z.string())
});

type NewsFormValues = z.infer<typeof formSchema>;

interface NewsFormProps {
	initialData:
	| (News & {
		images: Image5[];
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
	const [paragraph_news, setParagraph_news] = useState<string[]>(
		initialData?.paragraph_news.map((p) => p.text) || ['']
	);
	const [paragraph_news_ar, setParagraph_news_ar] = useState<string[]>(
		initialData?.paragraph_news_ar.map((p) => p.text) || ['']
	);

	const title = initialData ? 'Edit News' : 'Create News';
	const description = initialData ? 'Edit a News.' : 'Add a new News';
	const toastMessage = initialData ? 'News updated.' : 'News created.';
	const action = initialData ? 'Save changes' : 'Create';

	const form = useForm<NewsFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData ? {
			title: '',
			title_ar: '',
			categoryId: '',
			images: [],
			paragraph_news: initialData.paragraph_news.map(p => ({ text: p.text })),
			paragraph_news_ar: initialData.paragraph_news_ar.map(p => ({ text: p.text })),
		} : {
			title: '',
			title_ar: '',
			categoryId: '',
			images: [],
			paragraph_news: [],
			paragraph_news_ar: [],
		},
	});

	const handleAddParagraphNews = () => {
		setParagraph_news([...paragraph_news, '']);
	};
	const handleAddParagraphNewsAr = () => {
		setParagraph_news_ar([...paragraph_news_ar, '']);
	};

	const handleParagraphChangeNews = (index: number, value: string) => {
		const newParagraphNews = [...paragraph_news];
		newParagraphNews[index] = value;
		setParagraph_news(newParagraphNews);
	};
	const handleParagraphChangeNewsAr = (index: number, value: string) => {
		const newParagraphNewsAr = [...paragraph_news_ar];
		newParagraphNewsAr[index] = value;
		setParagraph_news_ar(newParagraphNewsAr);
	};
	const onSubmit = async (data: NewsFormValues) => {
		try {
			setLoading(true);
			data.paragraph_news = paragraph_news.map(text => ({ text }));
			data.paragraph_news_ar = paragraph_news_ar.map(text => ({ text }));
			if (initialData) {
				await axios.patch(`/api/${params.storeId}/news/${params.NewsId}`, data);
			} else {
				await axios.post(`/api/${params.storeId}/news`, data);
			}
			router.refresh();
			router.push(`/${params.storeId}/news`);
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
						name="images"
						render={({ field }) => (
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
					{/* Rest of your form fields */}
					<div className="md:grid md:grid-cols-1 gap-8">
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
						{paragraph_news.map((p, index) => (
							<FormItem key={index}>
								<FormLabel>Paragraph {index + 1}</FormLabel>
								<FormControl>
									<Textarea
										disabled={loading}
										placeholder="Enter a Value"
										value={p}
										onChange={(e) => handleParagraphChangeNews(index, e.target.value)}
									/>
								</FormControl>
								<FormMessage />
								{index === paragraph_news.length - 1 && (
									<Button
										type="button"
										variant="ghost"
										onClick={handleAddParagraphNews}
									>
										<PlusCircle className="h-6 w-6 text-gray-600" />
									</Button>
								)}
							</FormItem>
						))}
						<hr />
						{paragraph_news_ar.map((p, index) => (
							<FormItem key={index}>
								<FormLabel>Paragraph {index + 1}</FormLabel>
								<FormControl>
									<Textarea
										disabled={loading}
										placeholder="Enter a Value"
										value={p}
										onChange={(e) => handleParagraphChangeNewsAr(index, e.target.value)}
									/>
								</FormControl>
								<FormMessage />
								{index === paragraph_news_ar.length - 1 && (
									<Button
										type="button"
										variant="ghost"
										onClick={handleAddParagraphNewsAr}
									>
										<PlusCircle className="h-6 w-6 text-gray-600" />
									</Button>
								)}
							</FormItem>
						))}
					</div>
					<Button disabled={loading} className="ml-auto" type="submit">
						{action}
					</Button>
				</form>
			</Form>
		</>
	);
};