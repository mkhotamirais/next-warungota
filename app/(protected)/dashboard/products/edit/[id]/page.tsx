"use client";

import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ProductSchema } from "@/lib/rules";
import { firestore } from "@/lib/firebase";
import { useFetchProductById } from "@/lib/hooks/useFetchProductById";
import PendingPage from "@/components/PendingPage";

type ProductType = z.infer<typeof ProductSchema>;

export default function EditProduct() {
  const [pending, setPending] = useState(false);
  const params = useParams();
  const { id } = params;
  const { product, pendingProduct } = useFetchProductById(id?.toString());
  const router = useRouter();

  const form = useForm<ProductType>({
    resolver: zodResolver(ProductSchema),
    defaultValues: { name: "", price: "" },
  });

  useEffect(() => {
    if (product) {
      form.setValue("name", product.name);
      form.setValue("price", product.price.toString());
    }
  });

  const onSubmit = async (values: ProductType) => {
    setPending(true);
    try {
      await updateDoc(doc(firestore, "products", id?.toString() ?? ""), values);
      toast.success("Update product success");
      router.push("/dashboard/products");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setPending(false);
    }
  };

  if (pendingProduct) {
    return <PendingPage />;
  }

  return (
    <section className="py-4 min-h-y">
      <div className="container">
        <div className="max-w-xl">
          <h1 className="h1">Update Product</h1>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input disabled={pending} placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          disabled={pending}
                          placeholder="Price"
                          {...field}
                          onChange={(e) => {
                            const input = e.target.value;

                            // Hanya izinkan angka
                            if (/^\d*$/.test(input)) {
                              field.onChange(input);
                            } else {
                              // Tampilkan peringatan dan hapus input tidak valid
                              toast.error("Harus berupa angka");
                              field.onChange(""); // Kosongkan input
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">
                  {pending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
