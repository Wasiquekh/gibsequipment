"use client"; // This marks this component for client-side rendering

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface Product {
  id: number;
  name: string;
  description: string;
  // price: number;
  image_url: string | null;
  created_at: string; // ISO string format
  updated_at: string; // ISO string format
  user_id: string; // Assuming UUID format
}

export default function Home() {
  const [data, setData] = useState<Product[] | null>(null);
  console.log("FFFFFFFFFFFFFFFFFFFFFFFFF", data);
  const [hitApi, setHitApi] = useState<boolean>(false);
  const searchParams = useSearchParams(); // Get the search params (query parameters)
  const id = searchParams.get("id"); // Access the 'id' query parameter
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://gibs-equipment-backend.dynsimulation.com/api/v1/gibsequipment/allproducts",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        // Check if the response is OK
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Parse the JSON body from the response
        const data = await response.json();
        setData(data.data);
        // Log the parsed response body (actual data)
        console.log("Fetched data:", data);
      } catch (error) {
        console.error("An error occurred during the fetch:", error);
      }
    };

    fetchData();
  }, [hitApi]); // Empty dependency array ensures this runs once when the component mounts
  const productId = (id: number) => {
    router.push(`/product-details?id=${id}`);
  };
  return (
    <>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Map through the data and render each product */}
          {data?.map((product) => (
            <div
              onClick={() => productId(product.id)}
              key={product.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
            >
              <img
                src={product.image_url || "/images/noimage.jpg"} // Use default if image_url is null
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold text-xl capitalize">
                  {product.name}
                </h2>
                <p className="text-gray-600 text-sm">{product.description}</p>
                {/* Flex container for price and button */}
                <div className="flex justify-between items-center mt-2">
                  {/* <p className="font-bold text-lg">${product.price}</p> */}
                  <button
                    onClick={() => productId(product.id)}
                    className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
