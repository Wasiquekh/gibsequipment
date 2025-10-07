"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CgCloseR } from "react-icons/cg";
import { toast } from "react-toastify";

interface Product {
  id: number;
  name: string;
  description: string;
  // price: number;
  user_id: string;
  image_url: string;
}

const Page = () => {
  const searchParams = useSearchParams(); // Get the search params (query parameters)
  const id = searchParams.get("id"); // Access the 'id' query parameter
  const [product, setProduct] = useState<Product | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobile, setMobile] = useState("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleSave = async () => {
    if (!/^[0-9]{10}$/.test(mobile)) {
      // Show toast for invalid mobile number
      toast.warn("Mobile number is invalid"); // Simple alert used as a toast
      return; // Return to stop further execution if the mobile number is invalid
    }
    setSubmitting(true);
    // Create URLSearchParams for application/x-www-form-urlencoded
    const formData = new URLSearchParams();

    if (mobile) formData.append("mobileNumber", mobile); // Only append if mobile is defined
    if (product?.name) formData.append("name", product?.name); // Only append if name is defined
    if (product?.description)
      formData.append("description", product?.description); // Only append if description is defined
    if (product?.image_url) formData.append("image", product?.image_url); // Only append if image_url is defined

    try {
      const response = await fetch(
        "https://gibs-equipment-backend.dynsimulation.com/api/v1/gibsequipment/sendqoute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Make sure to set the Content-Type
          },
          body: formData.toString(), // Convert the URLSearchParams to a string
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

  useEffect(() => {
    if (!id) return; // Ensure 'id' exists before making the API request
    const fetchProduct = async () => {
      const response = await fetch(
        `https://gibs-equipment-backend.dynsimulation.com/api/v1/gibsequipment/singleproduct`, // API URL without the query string
        {
          method: "POST", // Use POST method
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Correct content type for your API
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
  }, [id]); // Run the effect whenever 'id' changes

  return (
    <div>
      <section className="overflow-hidden">
        <div className="container mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            {/* Product Image */}
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
              src={product?.image_url || "/images/noimage.jpg"} // Dynamically set image URL from product data
            />
            {/* Product Info */}
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              {/* Brand Name and Product Name */}
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                Brand Name
                {/* Dynamically set brand name */}
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {product?.name || "Product Name"}{" "}
                {/* Dynamically set product name */}
              </h1>

              {/* Product Description */}
              <p className="leading-relaxed mt-4">
                {product?.description || "Product description goes here."}{" "}
                {/* Dynamically set description */}
              </p>

              {/* Price */}
              <span className="title-font font-medium text-2xl text-gray-900">
                {/* ${product?.price || "0.00"}{" "} */}
                {/* Dynamically set product price */}
              </span>

              {/* Get Quotes Button */}
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

      {/* Modal Popup with Overlay */}
      {isModalOpen && (
        <div
          //  onClick={closeModal}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <CgCloseR
              onClick={closeModal}
              className=" absolute top-2 right-2 text-xl cursor-pointer"
            />
            <h2 className="text-lg font-semibold mb-4 text-center">
              Enter Mobile Number
            </h2>

            {/* Mobile Number Input */}
            <div className="mt-4">
              <input
                type="number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)} // Update mobile number state
                className="w-full px-4 py-2 border border-gray-300 rounded"
                placeholder="Enter Mobile Number"
                required
              />
            </div>

            {/* Save Button */}
            <div className="mt-4 text-center">
              <button
                onClick={() => handleSave()} // Save the number and close the modal
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

export default Page;
