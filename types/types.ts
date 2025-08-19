import { Prisma } from "@prisma/client";

export type BlogProps = Prisma.BlogGetPayload<{
  include: { BlogCategory: { select: { name: true } }; User: { select: { name: true } } };
}>;

export type UserProps = Prisma.UserGetPayload<{
  select: { role: true; id: true; name: true; email: true; phone: true };
}>;
