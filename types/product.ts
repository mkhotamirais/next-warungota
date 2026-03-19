import { Prisma } from "@/lib/generated/prisma";

export type ProductProps = Prisma.ProductGetPayload<{
  include: { ProductCategory: { select: { name: true; slug: true } }; User: { select: { name: true } } };
}>;

export type SingleProductProps = Prisma.ProductGetPayload<{
  include: {
    ProductCategory: { select: { name: true; slug: true } };
    User: { select: { name: true } };
  };
}> & { quantity?: number };

export type CartItemProps = Prisma.CartItemGetPayload<{
  include: { Product: true };
}> & { quantity: number };
