import List from "./List";
import Create from "./Create";
import AuthTitleHeader from "../../AuthTitleHeader";
import { Separator } from "@/components/ui/separator";

export default async function ProductCategory() {
  return (
    <>
      <AuthTitleHeader title="Product Category" url="/admin/product" label="Product List" />
      <div className="space-y-4">
        <Create />
        <Separator className="my-2" />
        <List />
      </div>
    </>
  );
}
