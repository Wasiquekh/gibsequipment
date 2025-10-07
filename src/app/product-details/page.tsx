"use client";  // Ensure that the component is client-side

import { useState, useEffect } from "react"; // Import hooks
import axios from "axios"; // Import axios
import { CgCloseR } from "react-icons/cg";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import { Suspense } from "react"; // Import Suspense

interface Product {
  id: number;
  name: string;
  description: string;
  user_id: string;
  image_url: string;
}

const ProductPage = () => {
  const searchParams = useSearchParams(); // Get search params
  const [product, setProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobile, setMobile] = useState("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const id = searchParams.get("id"); // Access searchParams using `.get("id")`

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.post(
          "https://gibs-equipment-backend.dynsimulation.com/api/v1/gibsequipment/singleproduct", 
          new URLSearchParams({ id: id.toString() }) // Send 'id' in the body as form data
        );
        
        if (response.status === 200) {
          setProduct(response.data.data); // Assuming the response contains the product details in a 'data' object
        } else {
          console.error("Failed to fetch product data");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
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
    if (product?.description) formData.append("description", product?.description);
    if (product?.image_url) formData.append("image", product?.image_url);

    try {
      const response = await axios.post(
        "https://gibs-equipment-backend.dynsimulation.com/api/v1/gibsequipment/sendqoute",
        formData.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Quote sent successfully");
        closeModal();
        setSubmitting(false);
        setMobile("");
      } else {
        toast.error("Failed to send quote");
      }
    } catch (error) {
      console.error("Error sending quote:", error);
      toast.error("Failed to send quote");
      setSubmitting(false);
    }
  };

  return (
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
  );
};

export default ProductPage;
