'use client';
import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { TeamMember, Team, Image } from '@prisma/client';
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
	name: z.string().min(2),
	name_ar: z.string().min(2),
	title: z.string().min(2),
	title_ar: z.string().min(2),
	teamId: z.string().min(1),
	brief_1: z.string().min(1),
	brief_2: z.string().min(1),
	brief_3: z.string().min(1),
	brief_1_ar: z.string().min(1),
	brief_2_ar: z.string().min(1),
	brief_3_ar: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
	initialData:
	| (TeamMember & {
		images: Image[];
	})
	| null;
	teams: Team[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
	initialData,
	teams,
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
	const onSubmit = async (data: CategoryFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(`/api/${params.storeId}/team-members/${params.teammemberId}`, data);
			} else {
				await axios.post(`/api/${params.storeId}/team-members`, data); // Ensure there's a POST handler
			}
			router.refresh();
			router.push(`/${params.storeId}/team-members`);
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
			await axios.delete(`/api/${params.storeId}/team-members/${params.teammemberId}`);
			router.refresh();
			router.push(`/${params.storeId}/team-members`);
			toast.success('Team member deleted.');
		} catch (error: any) {
			toast.error('Make sure you removed all products using this team first.');
		} finally {
			setLoading(false);
			setOpen(false);
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
							name="teamId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										team
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
													placeholder="Select a Team"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{teams.map(
												(
													team
												) => (
													<SelectItem
														key={
															team.id
														}
														value={
															team.id
														}
													>
														{
															team.name
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
										<Input
											disabled={
												loading
											}
											placeholder="Member name"
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
											placeholder="Member name"
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
										Member Title
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												loading
											}
											placeholder="Member Title"
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
										Member Title in Arabic
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												loading
											}
											placeholder="Member Title in Arabic"
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
										First Brief
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
							name="brief_1_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										First Brief in Arabic
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												loading
											}
											placeholder="First Brief in Arabic"
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
										Second Brief
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												loading
											}
											placeholder="Second Brief"
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
										Second Brief in Arabic
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												loading
											}
											placeholder="Second Brief in Arabic"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="brief_3"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Third Brief
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												loading
											}
											placeholder="Third Brief"
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
										Third Brief in Arabic
									</FormLabel>
									<FormControl>
										<Input
											disabled={
												loading
											}
											placeholder="Third Brief in Arabic"
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
