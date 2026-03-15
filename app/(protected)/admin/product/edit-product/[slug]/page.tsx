import { Button } from "@/components/ui/button";
import Link from "next/link";
import EditProductWrapper from "./EditProductWrapper";

export default async function EditProduct() {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="h1">Edit Product</h1>
        <Button asChild>
          <Link href="/admin/product">Go to Product List</Link>
        </Button>
      </div>
      <EditProductWrapper />
    </>
  );
}
