'use client';

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { Billboard, Team, Image4 } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import ImageUpload from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
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

const formSchema = z.object({
	images: z.object({ url: z.string() }).array(),
	name: z.string().min(1),
	address: z.string().min(1),
	name_ar: z.string().min(1),
	address_ar: z.string().min(1),
	billboardId: z.string().min(1),
	linkedin: z.string().min(1),
	phone: z.string().min(1),
});
type CategoryFormValues = z.infer<typeof formSchema>;
interface CategoryFormProps {
	initialData: | (Team & {
		images: Image4[];
	}) | null;
	billboards: Billboard[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
	initialData,
	billboards,
}) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? 'Edit team' : 'Create team';
	const description = initialData
		? 'Edit a team.'
		: 'Add a new team';
	const toastMessage = initialData
		? 'team updated.'
		: 'team created.';
	const action = initialData ? 'Save changes' : 'Create';

	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: '',
			name_ar: '',
			billboardId: '',
			address: '',
			linkedin: '',
			phone: '',
			address_ar: '',
			images: [],
		},
	});

	const onSubmit = async (data: CategoryFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/teams/${params.teamId}`,
					data
				);
			} else {
				await axios.post(
					`/api/${params.storeId}/teams`,
					data
				);
			}
			router.refresh();
			router.push(`/${params.storeId}/teams`);
			toast.success(toastMessage);
		} catch (error: any) {
			toast.error('Something went wrong.');
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(
				`/api/${params.storeId}/teams/${params.teamId}`
			);
			router.refresh();
			router.push(`/${params.storeId}/teams`);
			toast.success('team deleted.');
		} catch (error: any) {
			toast.error(
				'Make sure you removed all products using this team first.'
			);
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
											placeholder="team name"
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
											placeholder="team name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Team Phone
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												loading
											}
											placeholder="team phone"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>	<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Team Address
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												loading
											}
											placeholder="team address"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>	<FormField
							control={form.control}
							name="address_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Address in
										Arabic
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												loading
											}
											placeholder="Address in Arabic"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>	<FormField
							control={form.control}
							name="linkedin"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										LinkedIn Link
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												loading
											}
											placeholder="linkedin"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="billboardId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Billboard
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
													placeholder="Select a billboard"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{billboards.map(
												(
													billboard
												) => (
													<SelectItem
														key={
															billboard.id
														}
														value={
															billboard.id
														}
													>
														{
															billboard.label
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
