import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

export const getBlogCategories = unstable_cache(
  async () => {
    console.log("Fetching blog categories...");
    const categories = await prisma.blogCategory.findMany({
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return categories;
  },
  // Kunci unik untuk cache ini (harus string)
  ["blog-categories-list"],
  // Tag yang akan kita gunakan untuk revalidasi
  { tags: ["blog-categories"] }
);
