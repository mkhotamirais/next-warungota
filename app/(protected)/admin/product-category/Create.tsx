"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useProductCategory } from "@/hooks/tanstack/useProductCategory";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { productCategorySchema } from "@/lib/schemas/product";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

type inferSchema = z.infer<typeof productCategorySchema>;

export default function Create() {
  const form = useForm<inferSchema>({
    resolver: zodResolver(productCategorySchema),
    defaultValues: { name: "" },
  });

  const { createCategory, isCreating: pending } = useProductCategory();
  const router = useRouter();

  const onSubmit = async (data: inferSchema) => {
    const result = await createCategory(data.name);

    if (result?.error) {
      toast.error(result.error);
      // setPending(false);
      return;
    }

    form.reset();

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // setPending(false);
    toast.success(result?.message);
    router.refresh();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="category name"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" disabled={pending} className="mt-6 w-full">
        {pending && <Spinner />}
        Create
      </Button>
    </form>
  );
}
