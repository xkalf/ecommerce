"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { commonTypeEnum } from "@/db/schema";
import { createCommon, updateCommon } from "@/lib/actions/common.actions";
import { UploadButton } from "@/lib/uploadthing";
import { insertCommonSchema, updateCommonSchema } from "@/lib/validator";
import { Common } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CommonForm({
  type,
  common,
  commonId,
}: {
  type: "Create" | "Update";
  common?: Common;
  commonId?: string;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof insertCommonSchema>>({
    resolver:
      type === "Update"
        ? zodResolver(updateCommonSchema)
        : zodResolver(insertCommonSchema),
    defaultValues: common && type === "Update" ? common : {},
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof insertCommonSchema>) {
    if (type === "Create") {
      const res = await createCommon(values);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      } else {
        toast({
          description: res.message,
        });
        router.push(`/admin/commons`);
      }
    }
    if (type === "Update") {
      if (!commonId) {
        router.push(`/admin/commons`);
        return;
      }
      const res = await updateCommon({ ...values, id: commonId });
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      } else {
        toast({
          description: res.message,
        });
        router.push(`/admin/commons`);
      }
    }
  }

  const image = form.watch("image");

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {commonTypeEnum.enumValues.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase()}
                        {type.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter common name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Image</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex flex-wrap gap-2">
                      {image && (
                        <div className="relative">
                          <Image
                            src={image}
                            width={100}
                            height={100}
                            className="w-20 h-20 object-cover object-center rounded-sm"
                            alt="common image"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex justify-center items-center"
                            onClick={() => {
                              form.setValue("image", null);
                            }}
                          >
                            -
                          </button>
                        </div>
                      )}
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            form.setValue("image", res[0].url);
                          }}
                          onUploadError={(error) => {
                            toast({
                              variant: "destructive",
                              description: `ERROR! ${error.message}`,
                            });
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
