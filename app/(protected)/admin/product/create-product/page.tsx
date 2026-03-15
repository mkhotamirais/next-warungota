import CreateProductWrapper from "./CreateProductWrapper";
import AuthTitleHeader from "@/app/(protected)/AuthTitleHeader";

export default async function CreateProduct() {
  return (
    <>
      <AuthTitleHeader title="Create Product" url="/admin/product" label="Product List" />
      <CreateProductWrapper />
    </>
  );
}
