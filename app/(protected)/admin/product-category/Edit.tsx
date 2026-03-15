"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductCategory } from "@/hooks/tanstack/useProductCategory";
import { ProductCategory } from "@/lib/generated/prisma";
import { productCategorySchema } from "@/lib/schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { FaCheck, FaSpinner, FaXmark } from "react-icons/fa6";
import { toast } from "sonner";
import z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useProductGlobal } from "@/hooks/zustand/useProductGlobal";
// import { Spinner } from "@/components/ui/spinner";

type inferSchema = z.infer<typeof productCategorySchema>;

interface Props {
  category: ProductCategory;
}

export default function Edit({ category }: Props) {
  const form = useForm<inferSchema>({
    resolver: zodResolver(productCategorySchema),
    defaultValues: { name: category.name },
  });
  const { setIsEditProdCat } = useProductGlobal();
  const router = useRouter();
  const { updateCategory, isUpdating: pending } = useProductCategory();

  const cancelEdit = () => {
    setIsEditProdCat(null);
    form.reset({ name: category.name });
  };

  const onSubmit = async (data: inferSchema) => {
    const result = await updateCategory({ id: category.id, name: data.name });

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    form.reset();

    setIsEditProdCat(null);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    toast.success(result?.message);
    router.refresh();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-center w-full">
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name" className="sr-only">
                Name
              </FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="category name"
                autoComplete="off"
                autoFocus
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex gap-2">
        <Button size="icon" type="submit" disabled={pending} aria-label="Save" onMouseDown={(e) => e.preventDefault()}>
          {pending ? <FaSpinner className="animate-spin" /> : <FaCheck />}
        </Button>
        <Button
          size="icon"
          variant="destructive"
          type="button"
          onClick={cancelEdit}
          onMouseDown={(e) => e.preventDefault()}
          aria-label="Cancel"
        >
          <FaXmark />
        </Button>
      </div>
    </form>
  );
}
