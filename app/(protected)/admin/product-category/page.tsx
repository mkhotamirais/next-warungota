import List from "./List";
import Create from "./Create";

export default async function ProductCategory() {
  return (
    <div className="max-w-xl">
      <h1 className="h1 mb-4">Product Category List</h1>
      <div className="space-y-4">
        <Create />
        <List />
      </div>
    </div>
  );
}
