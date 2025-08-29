"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Recognition } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
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
  title: z.string().min(1),
  title_ar: z.string().min(1),
  imageUrl: z.string().min(1),
});

type recognitionFormValues = z.infer<typeof formSchema>

interface recognitionFormProps {
  initialData: Recognition | null;
};

export const RecognitionForm: React.FC<recognitionFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit recognition' : 'Create recognition';
  const description = initialData ? 'Edit a recognition.' : 'Add a new recognition';
  const toastMessage = initialData ? 'recognition updated.' : 'recognition created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<recognitionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: '',
      title_ar: '',
      imageUrl: ''
    }
  });

  const onSubmit = async (data: recognitionFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/recognitions/${params.recognitionid}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/recognitions`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/recognitions`);
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
      await axios.delete(`/api/${params.storeId}/recognitions/${params.recognitionid}`);
      router.refresh();
      router.push(`/${params.storeId}/recognitions`);
      toast.success('recognition deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all categories using this recognition first.');
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
                <FormLabel>Company Image</FormLabel>
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company title (English)</FormLabel>
                  <FormControl>
                    <Textarea disabled={loading} placeholder="" {...field} />
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
                  <FormLabel>Company Title (Arabic)</FormLabel>
                  <FormControl>
                    <Textarea disabled={loading} placeholder="" {...field} />
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
