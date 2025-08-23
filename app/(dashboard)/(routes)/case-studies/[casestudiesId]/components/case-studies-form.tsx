"use client"
import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { CaseStudy, Industry, CaseStudyPoint, CaseStudyPointAr } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Textarea
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
	title: z.string().min(1),
	title_ar: z.string().min(1),
	sub_title: z.string().min(1),
	sub_title_ar: z.string().min(1),
	paragraph_1: z.string().min(1),
	paragraph_1_ar: z.string().min(1),
	paragraph_2: z.string().min(1),
	paragraph_2_ar: z.string().min(1),
	industryId: z.string().min(1),
	imageUrl: z.string().min(1),
	caseStudyPoint: z.array(z.object({
		p1: z.string().min(1),
	})),
	caseStudyPointAr: z.array(z.object({
		p1: z.string().min(1),
	})),
});

type CaseFormValues = z.infer<typeof formSchema>;

interface CaseFormProps {
	initialData:
	| (CaseStudy & {
		caseStudyPoint: CaseStudyPoint[];
		caseStudyPointAr: CaseStudyPointAr[];
	})
	| null;
	industries: Industry[];
}

export const CaseForm: React.FC<CaseFormProps> = ({
	initialData,
	industries
}) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? 'Edit Service' : 'Create Service';
	const toastMessage = initialData ? 'Service updated.' : 'Service created.';
	const action = initialData ? 'Save changes' : 'Create';

	const defaultValues = initialData
		? {
			...initialData,
		}
		: {
			id: '',
			industryId: '',
			title: '',
			title_ar: '',
			sub_title: '',
			sub_title_ar: '',
			paragraph_1: '',
			paragraph_1_ar: '',
			paragraph_2: '',
			paragraph_2_ar: '',
			caseStudyPoint: [],
			caseStudyPointAr: [],
			imageUrl: '',
		};

	const form = useForm<CaseFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const { fields: caseStudyPointFields, append: appendcaseStudyPoint, remove: removecaseStudyPoint } = useFieldArray({
		control: form.control,
		name: 'caseStudyPoint',
	});
	const { fields: caseStudyPointArFields, append: appendcaseStudyPointAr, remove: removecaseStudyPointAr } = useFieldArray({
		control: form.control,
		name: 'caseStudyPointAr',
	});
	const onSubmit = async (data: CaseFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/case-studies/${params.casestudiesId}`,
					data
				);
			} else {
				await axios.post(
					`/api/${params.storeId}/case-studies`,
					data
				);
			}
			router.refresh();
			router.push(`/${params.storeId}/case-studies`);
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
				`/api/${params.storeId}/case-studies/${params.casestudiesId}`
			);
			router.refresh();
			router.push(`/${params.storeId}/case-studies`);
			toast.success('Service deleted.');
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
					description='Mange Case Studies'
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
							name="industryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Select Industry</FormLabel>
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
													placeholder="Select an industry"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{industries.map((category) => (
												<SelectItem
													key={category.id}
													value={category.id}
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
									<FormLabel>Arabic title</FormLabel>
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
							name="sub_title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>sub_Title</FormLabel>
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
							name="sub_title_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Arabic sub_title</FormLabel>
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
									<FormLabel>First Paragraph</FormLabel>
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
									<FormLabel>Arabic First Paragraph</FormLabel>
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
						/><FormField
							control={form.control}
							name="paragraph_2"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Second Paragraph</FormLabel>
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
									<FormLabel>Arabic Second Paragraph</FormLabel>
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
						<Heading description='Case Study Points' title="Points (English)" />
						{caseStudyPointFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`caseStudyPoint.${index}.p1`}
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
									onClick={() => removecaseStudyPoint(index)}
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
								appendcaseStudyPoint({
									p1: ''
								})
							}
						>
							Add New Point
						</Button>
					</div>
					<div>
						<Heading description='Case Study Points' title="Points (Arabic)" />
						{caseStudyPointArFields.map((field, index) => (
							<div key={field.id} className="grid grid-cols-2 gap-8">
								<FormField
									control={form.control}
									name={`caseStudyPointAr.${index}.p1`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Title (Arabic)</FormLabel>
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
									onClick={() => removecaseStudyPointAr(index)}
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
								appendcaseStudyPointAr({
									p1: '',
								})
							}
						>
							Add New Point (Arabic)
						</Button>
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

export default CaseForm;
