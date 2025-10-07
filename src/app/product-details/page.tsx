"use client"; // Ensure this is at the top for client-side rendering

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react"; // Import Suspense and hooks
import { CgCloseR } from "react-icons/cg";
import { toast } from "react-toastify";

interface Product {
  id: number;
  name: string;
  description: string;
  user_id: string;
  image_url: string;
}

const Page = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobile, setMobile] = useState("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const [id, setId] = useState<string | null>(null);

  // Get product id from the query string
  useEffect(() => {
    if (typeof window !== "undefined") {
      const productId = searchParams.get("id");
      setId(productId); // Set the id from query params
    }
  }, [searchParams]);

  // Fetch product details from the API
  useEffect(() => {
    if (!id) return; // Ensure 'id' exists before making the API request
    const fetchProduct = async () => {
      const response = await fetch(
        `https://gibs-equipment-backend.dynsimulation.com/api/v1/gibsequipment/singleproduct`, // API URL without the query string
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ id: id.toString() }), // Send 'id' in the body as form data
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProduct(data.data); // Assuming the response contains the product details in a 'data' object
      } else {
        console.error("Failed to fetch product data");
      }
    };

    fetchProduct();
  }, [id]);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleSave = async () => {
    if (!/^[0-9]{10}$/.test(mobile)) {
      toast.warn("Mobile number is invalid");
      return;
    }
    setSubmitting(true);

    const formData = new URLSearchParams();
    if (mobile) formData.append("mobileNumber", mobile);
    if (product?.name) formData.append("name", product?.name);
    if (product?.description)
      formData.append("description", product?.description);
    if (product?.image_url) formData.append("image", product?.image_url);

    try {
      const response = await fetch(
        "https://gibs-equipment-backend.dynsimulation.com/api/v1/gibsequipment/sendqoute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      toast.success("Quote sent successfully");
      closeModal();
      setSubmitting(false);
      setMobile("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <section className="overflow-hidden">
          <div className="container mx-auto">
            <div className="lg:w-4/5 mx-auto flex flex-wrap">
              <img
                alt="ecommerce"
                className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
                src={product?.image_url || "/images/noimage.jpg"}
              />
              <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                <h2 className="text-sm title-font text-gray-500 tracking-widest">
                  Brand Name
                </h2>
                <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                  {product?.name || "Product Name"}
                </h1>

                <p className="leading-relaxed mt-4">
                  {product?.description || "Product description goes here."}
                </p>

                <span className="title-font font-medium text-2xl text-gray-900">
                  {/* ${product?.price || "0.00"} */}
                </span>

                <button
                  onClick={openModal}
                  className="flex mt-6 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded cursor-pointer"
                >
                  Get Quotes
                </button>
              </div>
            </div>
          </div>
        </section>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <CgCloseR
                onClick={closeModal}
                className="absolute top-2 right-2 text-xl cursor-pointer"
              />
              <h2 className="text-lg font-semibold mb-4 text-center">
                Enter Mobile Number
              </h2>

              <div className="mt-4">
                <input
                  type="number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                  placeholder="Enter Mobile Number"
                  required
                />
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => handleSave()}
                  className="w-full py-2 bg-indigo-500 text-white rounded cursor-pointer"
                >
                  {submitting ? "Sending..." : "Send Quotes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default Page;
