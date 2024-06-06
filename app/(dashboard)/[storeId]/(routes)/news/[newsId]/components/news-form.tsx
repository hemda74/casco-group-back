// 'use client';

// import * as z from 'zod';
// import axios from 'axios';
// import { useState } from 'react';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { toast } from 'react-hot-toast';
// import { Trash, PlusCircle } from 'lucide-react';
// import { News, Image5, NewsCategory, paragrph } from '@prisma/client';
// import { useParams, useRouter } from 'next/navigation';

// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import {
// 	Form,
// 	FormControl,
// 	FormDescription,
// 	FormField,
// 	FormItem,
// 	FormLabel,
// 	FormMessage,
// 	Textarea,
// } from '@/components/ui/form';
// import { Separator } from '@/components/ui/separator';
// import { Heading } from '@/components/ui/heading';
// import { AlertModal } from '@/components/modals/alert-modal';
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from '@/components/ui/select';
// import ImageUpload from '@/components/ui/image-upload';

// const formSchema = z.object({
// 	images: z.object({ url: z.string() }).array(),
// 	title: z.string().min(1),
// 	title_ar: z.string().min(1),
// 	paragraph_1: z.string().min(1),
// 	paragraph_1_ar: z.string().min(1),
// 	paragraph_2: z.string().min(1),
// 	paragraph_2_ar: z.string().min(1),
// 	paragraph_3: z.string().min(1),
// 	paragraph_3_ar: z.string().min(1),
// 	paragraph_4: z.string().min(1),
// 	paragraph_4_ar: z.string().min(1),
// 	paragraph_5: z.string().min(1),
// 	paragraph_5_ar: z.string().min(1),
// 	categoryId: z.string().min(1),
// 	paragraph: z.array(z.string().min(1)), // Add paragraph field
// });

// type NewsFormValues = z.infer<typeof formSchema>;

// interface NewsFormProps {
// 	initialData:
// 	| (News & {
// 		images: Image5[];
// 		paragraph: paragrph[];
// 	})
// 	| null;
// 	categories: NewsCategory[];
// }

// export const NewsForm: React.FC<NewsFormProps> = ({
// 	initialData,
// 	categories,
// }) => {
// 	const params = useParams();
// 	const router = useRouter();

// 	const [open, setOpen] = useState(false);
// 	const [loading, setLoading] = useState(false);
// 	const [paragraph, setParagraph] = useState<string[]>(
// 		initialData?.paragraph.map((p) => p.d) || ['']
// 	);

// 	const title = initialData ? 'Edit News' : 'Create News';
// 	const description = initialData ? 'Edit a News.' : 'Add a new News';
// 	const toastMessage = initialData ? 'News updated.' : 'News created.';
// 	const action = initialData ? 'Save changes' : 'Create';

// 	const form = useForm<NewsFormValues>({
// 		resolver: zodResolver(formSchema),
// 		defaultValues: initialData || {
// 			title: '',
// 			title_ar: '',
// 			categoryId: '',
// 			paragraph_1: '',
// 			paragraph_1_ar: '',
// 			paragraph_2: '',
// 			paragraph_2_ar: '',
// 			paragraph_3: '',
// 			paragraph_3_ar: '',
// 			paragraph_4: '',
// 			paragraph_4_ar: '',
// 			paragraph_5: '',
// 			paragraph_5_ar: '',
// 			images: [],
// 			paragraph: [],
// 		},
// 	});

// 	const handleAddParagraph = () => {
// 		setParagraph([...paragraph, '']);
// 	};

// 	const handleParagraphChange = (index: number, value: string) => {
// 		const newParagraph = [...paragraph];
// 		newParagraph[index] = value;
// 		setParagraph(newParagraph);
// 	};

// 	const onSubmit = async (data: NewsFormValues) => {
// 		try {
// 			setLoading(true);
// 			data.paragraph = paragraph.map((d) => ({ d })); // Include paragraph data
// 			if (initialData) {
// 				await axios.patch(`/api/${params.storeId}/news/${params.NewsId}`, data);
// 			} else {
// 				await axios.post(`/api/${params.storeId}/news`, data);
// 			}
// 			router.refresh();
// 			router.push(`/${params.storeId}/news`);
// 			toast.success(toastMessage);
// 		} catch (error: any) {
// 			toast.error('Something went wrong.');
// 			console.log(error);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const onDelete = async () => {
// 		try {
// 			setLoading(true);
// 			await axios.delete(`/api/${params.storeId}/news/${params.NewsId}`);
// 			router.refresh();
// 			router.push(`/${params.storeId}/news`);
// 			toast.success('News deleted.');
// 		} catch (error: any) {
// 			toast.error('Something went wrong.');
// 		} finally {
// 			setLoading(false);
// 			setOpen(false);
// 		}
// 	};

// 	return (
// 		<>
// 			<AlertModal
// 				isOpen={open}
// 				onClose={() => setOpen(false)}
// 				onConfirm={onDelete}
// 				loading={loading}
// 			/>
// 			<div className="flex items-center justify-between">
// 				<Heading title={title} description={description} />
// 				{initialData && (
// 					<Button
// 						disabled={loading}
// 						variant="destructive"
// 						size="sm"
// 						onClick={() => setOpen(true)}
// 					>
// 						<Trash className="h-4 w-4" />
// 					</Button>
// 				)}
// 			</div>
// 			<Separator />
// 			<Form {...form}>
// 				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
// 					<FormField
// 						control={form.control}
// 						name="images"
// 						render={({ field }) => (
// 							<FormItem>
// 								<FormLabel>Images</FormLabel>
// 								<FormControl>
// 									<ImageUpload
// 										value={field.value.map((image) => image.url)}
// 										disabled={loading}
// 										onChange={(url) =>
// 											field.onChange([...field.value, { url }])
// 										}
// 										onRemove={(url) =>
// 											field.onChange(
// 												field.value.filter(
// 													(current) => current.url !== url
// 												)
// 											)
// 										}
// 									/>
// 								</FormControl>
// 								<FormMessage />
// 							</FormItem>
// 						)}
// 					/>
// 					<div className="md:grid md:grid-cols-3 gap-8">
// 						{/* Other form fields */}
// 						<FormField
// 							control={form.control}
// 							name="title"
// 							render={({ field }) => (
// 								<FormItem>
// 									<FormLabel>Title</FormLabel>
// 									<FormControl>
// 										<Textarea
// 											disabled={loading}
// 											placeholder="Enter a Value"
// 											{...field}
// 										/>
// 									</FormControl>
// 									<FormMessage />
// 								</FormItem>
// 							)}
// 						/>
// 						<FormField
// 							control={form.control}
// 							name="title_ar"
// 							render={({ field }) => (
// 								<FormItem>
// 									<FormLabel>Arabic Name</FormLabel>
// 									<FormControl>
// 										<Textarea
// 											disabled={loading}
// 											placeholder="Enter a Value"
// 											{...field}
// 										/>
// 									</FormControl>
// 									<FormMessage />
// 								</FormItem>
// 							)}
// 						/>
// 						<FormField
// 							control={form.control}
// 							name="paragraph_1"
// 							render={({ field }) => (
// 								<FormItem>
// 									<FormLabel>First paragraph</FormLabel>
// 									<FormControl>
// 										<Textarea
// 											disabled={loading}
// 											placeholder="Enter a Value"
// 											{...field}
// 										/>
// 									</FormControl>
// 									<FormMessage />
// 								</FormItem>
// 							)}
// 						/>
// 						<FormField
// 							control={form.control}
// 							name="paragraph_1_ar"
// 							render={({ field }) => (
// 								<FormItem>
// 									<FormLabel>First paragraph in Arabic</FormLabel>
// 									<FormControl>
// 										<Textarea
// 											disabled={loading}
// 											placeholder="Enter a Value"
// 											{...field}
// 										/>
// 									</FormControl>
// 									<FormMessage />
// 								</FormItem>
// 							)}
// 						/>
// 						<FormField
// 							control={form.control}
// 							name="paragraph_2"
// 							render={({ field }) => (
// 								<FormItem>
// 									<FormLabel>Second paragraph</FormLabel>
// 									<FormControl>
// 										<Textarea
// 											disabled={loading}
// 											placeholder="Enter a Value"
// 											{...field}
// 										/>
// 									</FormControl>
// 									<FormMessage />
// 								</FormItem>
// 							)}
// 						/>
// 						<FormField
// 							control={form.control}
// 							name="paragraph_2_ar"
// 							render={({ field }) => (
// 								<FormItem>
// 									<FormLabel>Second paragraph in Arabic</FormLabel>
// 									<FormControl>
// 										<Textarea
// 											disabled={loading}
// 											placeholder="Enter a Value"
// 											{...field}
// 										/>
// 									</FormControl>
// 									<FormMessage />
// 								</FormItem>
// 							)}
// 						/>
// 						<FormField
// 							control={form.control}
// 							name="paragraph_3"
// 							render={({ field }) => (
// 								<FormItem>
// 									<FormLabel>Third paragraph</FormLabel>
// 									<FormControl>
// 										<Textarea
// 											disabled={loading}
// 											placeholder="Enter a Value"
// 											{...field}
// 										/>
// 									</FormControl>
// 									<FormMessage />
// 								</FormItem>
// 							)}
// 						/>
// 						<FormField
// 							control={form.control}
// 							name="paragraph_3_ar"
// 							render={({ field }) => (
// 								<FormItem>
// 									<FormLabel>Third paragraph in Arabic</FormLabel>
// 									<FormControl>
// 										<Textarea
// 											disabled={loading}
// 											placeholder="Enter a Value"
// 											{...field}
// 										/>
// 									</FormControl>
// 									<FormMessage />
// 								</FormItem>
// 							)}
// 						/>
// 						<FormField
// 							control={form.control}
// 							name="paragraph_4"
// 							render={({ field }) => (
// 								<FormItem>
// 									<FormLabel>Fourth paragraph</FormLabel>
// 									<FormControl>
// 										<Textarea
// 											disabled={loading}
// 											placeholder="Enter a Value"
// 											{...field}
// 										/>
// 									</FormControl>
// 									<FormMessage />
// 								</FormItem>
// 							)}
// 						/>
// 						<FormField
// 							control={form.control}
// 							name="paragraph_4_ar"
// 							render={({ field }) => (
// 								<FormItem>
// 									<FormLabel>Fourth paragraph in Arabic</FormLabel>
// 									<FormControl>
// 										<Textarea
// 											disabled={loading}
// 											placeholder="Enter a Value"
// 											{...field}
// 										/>
// 									</FormControl>
// 									<FormMessage />
// 								</FormItem>
// 							)}
// 						/>
// 						<FormField
// 							control={form.control}
// 							name="paragraph_5"
// 							render={({ field }) => (
// 								<FormItem>
// 									<FormLabel>Fifth paragraph</FormLabel>
// 									<FormControl>
// 										<Textarea
// 											disabled={loading}
// 											placeholder="Enter a Value"
// 											{...field}
// 										/>
// 									</FormControl>
// 									<FormMessage />
// 								</FormItem>
// 							)}
// 						/>
// 						<FormField
// 							control={form.control}
// 							name="paragraph_5_ar"
// 							render={({ field }) => (
// 								<FormItem>
// 									<FormLabel>Fifth paragraph in Arabic</FormLabel>
// 									<FormControl>
// 										<Textarea
// 											disabled={loading}
// 											placeholder="Enter a Value"
// 											{...field}
// 										/>
// 									</FormControl>
// 									<FormMessage />
// 								</FormItem>
// 							)}
// 						/>
// 						<FormField
// 							control={form.control}
// 							name="categoryId"
// 							render={({ field }) => (
// 								<FormItem>
// 									<FormLabel>Category</FormLabel>
// 									<Select
// 										disabled={loading}
// 										onValueChange={field.onChange}
// 										value={field.value}
// 										defaultValue={field.value}
// 									>
// 										<FormControl>
// 											<SelectTrigger>
// 												<SelectValue
// 													defaultValue={field.value}
// 													placeholder="Select a category"
// 												/>
// 											</SelectTrigger>
// 										</FormControl>
// 										<SelectContent>
// 											{categories.map((category) => (
// 												<SelectItem key={category.id} value={category.id}>
// 													{category.name}
// 												</SelectItem>
// 											))}
// 										</SelectContent>
// 									</Select>
// 									<FormMessage />
// 								</FormItem>
// 							)}
// 						/>
// 					</div>

// 					{/* Paragraph Field */}
// 					<div className="md:grid md:grid-cols-3 gap-8">
// 						<FormField
// 							control={form.control}
// 							name="paragraph"
// 							render={() => (
// 								<FormItem>
// 									<FormLabel>Paragraph</FormLabel>
// 									<FormControl>
// 										{paragraph.map((paragraph, index) => (
// 											<div key={index} className="flex items-center space-x-2">
// 												<Textarea
// 													disabled={loading}
// 													placeholder="Enter a paragraph"
// 													value={paragraph}
// 													onChange={(e) =>
// 														handleParagraphChange(index, e.target.value)
// 													}
// 												/>
// 												{index === paragraph.length - 1 && (
// 													<Button
// 														type="button"
// 														variant="ghost"
// 														onClick={handleAddParagraph}
// 													>
// 														<PlusCircle className="h-6 w-6 text-gray-600" />
// 													</Button>
// 												)}
// 											</div>
// 										))}
// 									</FormControl>
// 									<FormMessage />
// 								</FormItem>
// 							)}
// 						/>
// 					</div>

// 					<Button disabled={loading} className="ml-auto" type="submit">
// 						{action}
// 					</Button>
// 				</form>
// 			</Form>
// 		</>
// 	);
// };
'use client';
import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash, PlusCircle } from 'lucide-react';
import { News, Image5, NewsCategory, paragrph } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation'; // Corrected from 'next/navigation'

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

const formSchema = z.object({
	images: z.object({ url: z.string() }).array(),
	title: z.string().min(1),
	title_ar: z.string().min(1),
	paragraph_1: z.string().min(1),
	paragraph_1_ar: z.string().min(1),
	paragraph_2: z.string().min(1),
	paragraph_2_ar: z.string().min(1),
	paragraph_3: z.string().min(1),
	paragraph_3_ar: z.string().min(1),
	paragraph_4: z.string().min(1),
	paragraph_4_ar: z.string().min(1),
	paragraph_5: z.string().min(1),
	paragraph_5_ar: z.string().min(1),
	categoryId: z.string().min(1),
	paragraph: z.array(z.string()),
});

type NewsFormValues = z.infer<typeof formSchema>;

interface NewsFormProps {
	initialData:
	| (News & {
		images: Image5[];
		paragraph: paragrph[];
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
	const [paragraph, setParagraph] = useState<string[]>(
		initialData?.paragraph.map((p) => p.text) || ['']
	);

	const title = initialData ? 'Edit News' : 'Create News';
	const description = initialData ? 'Edit a News.' : 'Add a new News';
	const toastMessage = initialData ? 'News updated.' : 'News created.';
	const action = initialData ? 'Save changes' : 'Create';

	const form = useForm<NewsFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			title: '',
			title_ar: '',
			categoryId: '',
			paragraph_1: '',
			paragraph_1_ar: '',
			paragraph_2: '',
			paragraph_2_ar: '',
			paragraph_3: '',
			paragraph_3_ar: '',
			paragraph_4: '',
			paragraph_4_ar: '',
			paragraph_5: '',
			paragraph_5_ar: '',
			images: [],
			paragraph: [],
		},
	});

	const handleAddParagraph = () => {
		setParagraph([...paragraph, '']);
	};

	const handleParagraphChange = (index: number, value: string) => {
		const newParagraph = [...paragraph];
		newParagraph[index] = value;
		setParagraph(newParagraph);
	};

	const onSubmit = async (data: NewsFormValues) => {
		try {
			setLoading(true);
			data.paragraph = paragraph.map((text) => ({ text })); // Include paragraph data
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
					<div className="md:grid md:grid-cols-3 gap-8">
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
									<FormLabel>Arabic Name</FormLabel>
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
							name="paragraph_1"
							render={({ field }) => (
								<FormItem>
									<FormLabel>First paragraph</FormLabel>
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
							name="paragraph_1_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>First paragraph in Arabic</FormLabel>
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
							name="paragraph_2"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Second paragraph</FormLabel>
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
							name="paragraph_2_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Second paragraph in Arabic</FormLabel>
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
							name="paragraph_3"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Third paragraph</FormLabel>
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
							name="paragraph_3_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Third paragraph in Arabic</FormLabel>
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
							name="paragraph_4"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fourth paragraph</FormLabel>
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
							name="paragraph_4_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fourth paragraph in Arabic</FormLabel>
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
							name="paragraph_5"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fifth paragraph</FormLabel>
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
							name="paragraph_5_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fifth paragraph in Arabic</FormLabel>
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
						{paragraph.map((p, index) => (
							<FormItem key={index}>
								<FormLabel>Paragraph {index + 1}</FormLabel>
								<FormControl>
									<Textarea
										disabled={loading}
										placeholder="Enter a Value"
										value={p}
										onChange={(e) => handleParagraphChange(index, e.target.value)}
									/>
								</FormControl>
								<FormMessage />
								{index === paragraph.length - 1 && (
									<Button
										type="button"
										variant="ghost"
										onClick={handleAddParagraph}
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