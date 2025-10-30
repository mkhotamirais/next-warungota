import { VariantSchema } from "@/lib/zod";
import { Prisma, ProductCategory } from "@prisma/client";
import z from "zod";

export type BlogProps = Prisma.BlogGetPayload<{
  include: { BlogCategory: { select: { name: true; slug: true } }; User: { select: { name: true } } };
}>;

export type ProductVariantProps = {
  include: { Options: { include: { VariationOption: { include: { VariationType: true } } } }; Product: true };
};

export type ProductProps = Prisma.ProductGetPayload<{
  include: {
    ProductCategory: { select: { name: true; slug: true } };
    User: { select: { name: true } };
    ProductVariant: { select: { price: true } };
  };
}>;

export type SingleProductProps = Prisma.ProductGetPayload<{
  include: {
    ProductCategory: { select: { name: true; slug: true } };
    User: { select: { name: true } };
    VariationType: { select: { id: true; name: true } };
    ProductVariant: ProductVariantProps;
  };
}> & { quantity?: number };

export type UserProps = Prisma.UserGetPayload<{
  select: { role: true; id: true; name: true; email: true; phone: true };
}>;

export type CartItemProps = Prisma.CartItemGetPayload<{
  include: { ProductVariant: ProductVariantProps };
}> & { quantity: number };

// Variants
// export type Variant = z.infer<typeof VariantSchema> & { id: number };
export type Variant = Omit<z.infer<typeof VariantSchema>, "price" | "stock"> & {
  id: number;
  dbId?: string;
  options: VariantOption[];
  price: string; // Tipe string untuk konsistensi state dengan input
  stock: number; // Tipe number, hasil dari coerce.number
  variantImageFile: File | null;
  variantImageUrl?: string | null;
  // sku?: string | null;
};

export type VariantOption = {
  typeName: string;
  optionValue: string;
};

export type VariationTypeState = {
  name: string;
  options: string[];
  dbId?: string;
};

export interface CreateProductFormProps {
  productCategories: ProductCategory[];
}

export interface EditProductFormProps extends CreateProductFormProps {
  product: SingleProductProps;
}

export interface ProductVariantDbId {
  id: string;
  variantImageUrl: string | null;
}

export interface VariantDataWithDbId extends z.infer<typeof VariantSchema> {
  dbId?: string;
  sku?: string | null | undefined;
}
