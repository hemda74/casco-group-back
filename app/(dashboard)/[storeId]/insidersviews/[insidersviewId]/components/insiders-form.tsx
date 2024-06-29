"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { InsidersView } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import ImageUpload from "@/components/ui/image-upload"

const formSchema = z.object({
  name: z.string().min(1),
  name_ar: z.string().min(1),
  title: z.string().min(1),
  title_ar: z.string().min(1),
  text: z.string().min(1),
  text_ar: z.string().min(1),
  imageUrl: z.string().min(1),
});

type InsidersViewFormValues = z.infer<typeof formSchema>

interface InsidersViewFormProps {
  initialData: InsidersView | null;
};

export const InsidersViewForm: React.FC<InsidersViewFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit InsidersView' : 'Create InsidersView';
  const description = initialData ? 'Edit a InsidersView.' : 'Add a new InsidersView';
  const toastMessage = initialData ? 'InsidersView updated.' : 'InsidersView created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<InsidersViewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      name_ar: '',
      text: '',
      text_ar: '',
      title: '',
      title_ar: '',
      imageUrl: ''
    }
  });

  const onSubmit = async (data: InsidersViewFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/insidersviews/${params.insidersViewId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/insidersviews`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/insidersviews`);
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
      await axios.delete(`/api/${params.storeId}/insidersviews/${params.insidersViewId}`);
      router.refresh();
      router.push(`/${params.storeId}/insidersviews`);
      toast.success('InsidersView deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all categories using this InsidersView first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

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
                <FormLabel>Author Image</FormLabel>
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
          <div className="md:grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Name (English)</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="InsidersView label" {...field} />
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
                  <FormLabel>Author Name (Arabic)</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="InsidersView label" {...field} />
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
                  <FormLabel>Author title (English)</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="InsidersView label" {...field} />
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
                  <FormLabel>Author Title (Arabic)</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="InsidersView label" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text (English)</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="InsidersView label" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="text_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text (Arabic)</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="InsidersView label" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
