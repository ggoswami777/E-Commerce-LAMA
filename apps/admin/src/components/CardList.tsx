import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { OrderType, productsType } from "@repo/types";
import { auth } from "@clerk/nextjs/server";


async function safeFetch(url: string, options?: RequestInit): Promise<Response | null> {
  try {
    const res = await fetch(url, { ...options, cache: "no-store" });
    return res;
  } catch (error) {
    console.error(`[safeFetch] Network error for ${url}:`, error);
    return null;
  }
}

const CardList = async({ title }: { title: string }) => {
  let products:productsType=[];
  let orders:OrderType[]=[];

  const {getToken}=await auth();
  const token=await getToken();

  if(title==="Popular Products"){
    const res = await safeFetch(`${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products?limit=4&popular=true`);
    if (res?.ok) {
      try {
        const data = await res.json();
        if (Array.isArray(data)) {
          products = data;
        }
      } catch (e) {
        console.error("Failed to parse products response:", e);
      }
    }
  }else{
    const res = await safeFetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders?limit=5`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
    if (res?.ok) {
      try {
        const data = await res.json();
        if (Array.isArray(data)) {
          orders = data;
        }
      } catch (e) {
        console.error("Failed to parse orders response:", e);
      }
    }
  }
  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className="flex flex-col gap-2">
        {title=== "Popular Products"?products.map((item) => (
          <Card key={item.id} className="flex-row items-center justify-between gap-4 p-4">
            <div className="w-12 h-12 rounded-sm relative overflow-hidden">
              <Image
                src={Object.values(item.images as Record<string,string>)[0] || ""}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="flex-1 p-0">
              <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
              
            </CardContent>
            <CardFooter className="p-0">${item.price / 1000}K</CardFooter>
          </Card>
        )):orders.map(item=>(
          <Card key={item._id} className="flex-row items-center justify-between gap-4 p-4">
            
            <CardContent className="flex-1 p-0">
              <CardTitle className="text-sm font-medium">{item.email}</CardTitle>
              <Badge variant="secondary">{item.status}</Badge>
            </CardContent>
            <CardFooter className="p-0">${item.amount / 100}</CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CardList;
