'use client';
import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash, PlusCircle } from 'lucide-react';
import { Event, Image6, NewsCategory, paragrph_event, paragrph_event_ar } from '@prisma/client';
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
	paragraph_event: z.array(z.string()),
	paragraph_event_ar: z.array(z.string())
});

type EventFormValues = z.infer<typeof formSchema>;

interface EventFormProps {
	initialData:
	| (event & {
		images: Image6[];
		paragraph_event: paragrph_event[];
		paragraph_event_ar: paragrph_event_ar[];
	})
	| null;
	categories: newsCategory[];
}

export const EventForm: React.FC<EventFormProps> = ({
	initialData,
	categories,
}) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [paragraph_event, setParagraph_event] = useState<string[]>(
		initialData?.paragraph_event.map((p) => p.text) || ['']
	);
	const [paragraph_event_ar, setParagraph_event_ar] = useState<string[]>(
		initialData?.paragraph_event_ar.map((p) => p.text) || ['']
	);

	const title = initialData ? 'Edit event' : 'Create event';
	const description = initialData ? 'Edit a event.' : 'Add a new event';
	const toastMessage = initialData ? 'event updated.' : 'event created.';
	const action = initialData ? 'Save changes' : 'Create';

	const form = useForm<EventFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData ? {
			title: '',
			title_ar: '',
			categoryId: '',
			images: [],
			paragraph_event: initialData.paragraph_event.map(p => ({ text: p.text })),
			paragraph_event_ar: initialData.paragraph_event_ar.map(p => ({ text: p.text })),
		} : {
			title: '',
			title_ar: '',
			categoryId: '',
			images: [],
			paragraph_event: [],
			paragraph_event_ar: [],
		},
	});

	const handleAddParagraphevent = () => {
		setParagraph_event([...paragraph_event, '']);
	};
	const handleAddParagrapheventAr = () => {
		setParagraph_event_ar([...paragraph_event_ar, '']);
	};

	const handleParagraphChangeevent = (index: number, value: string) => {
		const newParagraphevent = [...paragraph_event];
		newParagraphevent[index] = value;
		setParagraph_event(newParagraphevent);
	};
	const handleParagraphChangeeventAr = (index: number, value: string) => {
		const newParagrapheventAr = [...paragraph_event_ar];
		newParagrapheventAr[index] = value;
		setParagraph_event_ar(newParagrapheventAr);
	};
	const onSubmit = async (data: EventFormValues) => {
		try {
			setLoading(true);
			data.paragraph_event = paragraph_event.map(text => ({ text }));
			data.paragraph_event_ar = paragraph_event_ar.map(text => ({ text }));
			if (initialData) {
				await axios.patch(`/api/${params.storeId}/event/${params.eventId}`, data);
			} else {
				await axios.post(`/api/${params.storeId}/event`, data);
			}
			router.refresh();
			router.push(`/${params.storeId}/events`);
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
			await axios.delete(`/api/${params.storeId}/event/${params.eventId}`);
			router.refresh();
			router.push(`/${params.storeId}/event`);
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
						{paragraph_event.map((p, index) => (
							<FormItem key={index}>
								<FormLabel>Paragraph {index + 1}</FormLabel>
								<FormControl>
									<Textarea
										disabled={loading}
										placeholder="Enter a Value"
										value={p}
										onChange={(e) => handleParagraphChangeevent(index, e.target.value)}
									/>
								</FormControl>
								<FormMessage />
								{index === paragraph_event.length - 1 && (
									<Button
										type="button"
										variant="ghost"
										onClick={handleAddParagraphevent}
									>
										<PlusCircle className="h-6 w-6 text-gray-600" />
									</Button>
								)}
							</FormItem>
						))}
						<hr />
						{paragraph_event_ar.map((p, index) => (
							<FormItem key={index}>
								<FormLabel>Paragraph {index + 1}</FormLabel>
								<FormControl>
									<Textarea
										disabled={loading}
										placeholder="Enter a Value"
										value={p}
										onChange={(e) => handleParagraphChangeeventAr(index, e.target.value)}
									/>
								</FormControl>
								<FormMessage />
								{index === paragraph_event_ar.length - 1 && (
									<Button
										type="button"
										variant="ghost"
										onClick={handleAddParagrapheventAr}
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