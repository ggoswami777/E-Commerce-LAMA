import { productsType } from "@repo/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const getData = async (): Promise<productsType> => {
  try {
    const res=await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products`);
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }
    const data=await res.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid response format: data is not an array");
    }
    return data;
  } catch (error) {
    console.error("Error while fetching products:",error);
    return [];
  }
};

const ProductsPage = async () => {
  const data = await getData();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Products</h1>
      </div>
      <DataTable columns={columns} data={data || []}/>
    </div>
  );
};

export default ProductsPage;
