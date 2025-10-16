"use client"; // This marks this component for client-side rendering

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CgCloseR } from "react-icons/cg";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Page = () => {
  interface Product {
    id: string;
    name: string;
    description: string;
    // price: number;
    image_url: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    meta_title: string;
    meta_description: string;
  }
  const router = useRouter();
  const [data, setData] = useState<Product[] | null>(null);
   console.log("FETCHED DAATTTTTTTTTTTTTTTTTTTTTTTT", data);
   const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
   const [iscreate, setIsCreate] = useState<boolean>(false);
   const [isUpdate, setIsUpdate] = useState<boolean>(false);
 const [userEmail, setUserEmail] = useState<string | null>(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userEmail");
  }
  return null;
});

   const [userId, setUserId] = useState<string | null>(null);
   const [hitApi, setHitApi] = useState<boolean>(false);
   const [productEditObject, setProductEditObject] = useState<any | null>(null);

   //console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOO", productEditObject);

   const closeFlyout = () => {
     setIsFlyoutOpen(false);
     setIsCreate(false);
     setIsUpdate(false);
   };
   useEffect(() => {
     const email = localStorage.getItem("userEmail");
     const id = localStorage.getItem("userId");
    // setUserEmail(email);
     setUserId(id);
   }, []);
   // console.log(
   //   "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL",
   //   userEmail,
   //   userId
   // );
   useEffect(() => {
     // Retrieve the user email and ID from localStorage
     //const email = localStorage.getItem("userEmail");
     const id = localStorage.getItem("userId");
     //setUserEmail(email);
     setUserId(id);

     // If userEmail is null, or not the admin email, redirect to login.
     if (!userEmail || userEmail !== "wasiquekhan90@gmail.com") {
       router.push("/");
       return; // Stop execution of the effect
     }

     // Set a timeout to clear localStorage after 12 hours (12 hours = 43200000 ms)
     const timeout = setTimeout(() => {
       localStorage.clear(); // Clears the entire localStorage
       console.log("localStorage cleared after 12 hours");
     }, 43200000); // 12 hours in milliseconds

     // Clean up the timeout when the component is unmounted
     return () => clearTimeout(timeout);
   }, [userEmail, router]);

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

   const validationSchema = Yup.object({
     name: Yup.string().required("Name is required"),
     description: Yup.string().required("Description is required"),
     user_id: Yup.string().required("User ID is required"),
     image: Yup.mixed()
       .required("Image is required")
       .test(
         "fileType",
         "Only PNG, JPG, and WEBP formats are supported",
         (value) => {
           if (value && value instanceof File) {
             return ["image/png", "image/jpeg", "image/webp"].includes(
               value.type
             );
           }
           return false;
         }
       ),
     meta_title: Yup.string()
       .required("Meta Title is required")
       .max(60, "Meta Title should be at most 60 characters long"),
     meta_description: Yup.string()
       .required("Meta Description is required")
       .max(160, "Meta Description should be at most 160 characters long"),
     category_id: Yup.string().required("Category is required"), // Added validation for category
   });

   const validationSchemaUpdate = Yup.object({
     name: Yup.string().required("Name is required"),
     description: Yup.string().required("Description is required"),
     user_id: Yup.string().required("User ID is required"),
     image_url: Yup.string().nullable(), // Allow image_url to be nullable
     image: Yup.mixed()
       .nullable() // Allow 'image' to be null
       .test(
         "fileType",
         "Only PNG, JPG, and WEBP formats are supported",
         (value) => {
           if (!value) return true; // No new file selected, valid as is
           if (value instanceof File) {
             return ["image/png", "image/jpeg", "image/webp"].includes(
               value.type
             );
           }
           return true;
         }
       ),
     meta_title: Yup.string()
       .required("Meta Title is required")
       .max(60, "Meta Title should be at most 60 characters long"),
     meta_description: Yup.string()
       .required("Meta Description is required")
       .max(160, "Meta Description should be at most 160 characters long"),
     category_id: Yup.string().required("Category is required"), // Added validation for category
   });

   // Handle Add Function to log values (no API call here)

   const openEditProduct = (productobj: Product) => {
     setIsFlyoutOpen(true);
     setIsUpdate(true); // Set to false for editing
     setProductEditObject(productobj); // Populate product data for editing
   };
   const handleDelete = (id: string) => {
     Swal.fire({
       title: "Are you sure?",
       text: "You won't be able to revert this!",
       icon: "warning",
       showCancelButton: true,
       confirmButtonColor: "#3085d6",
       cancelButtonColor: "#d33",
       confirmButtonText: "Yes, delete it!",
     }).then(async (result) => {
       if (result.isConfirmed) {
         try {
           const response = await fetch(
             "https://gibs-equipment-backend.dynsimulation.com/api/v1/gibsequipment/deleteproduct",
             {
               method: "DELETE",
               headers: {
                 "Content-Type": "application/x-www-form-urlencoded",
               },
               body: new URLSearchParams({
                 id: id.toString(), // Convert id to string as required in the request
               }),
             }
           );

           if (response.ok) {
             console.log(`Deleted product with ID: ${id}`);
             toast.success("The product is deleted");
             setHitApi(!hitApi);
           } else {
             Swal.fire(
               "Error!",
               "There was a problem deleting the product.",
               "error"
             );
           }
         } catch (error) {
           console.error("Error deleting product:", error);
           Swal.fire("Error!", "There was an error with the request.", "error");
         }
       }
     });
   };

   const handleAdd = async (values: any) => {
     console.log("FORM VALUEs", values);

     const formData = new FormData();
     formData.append("name", values.name);
     formData.append("description", values.description);
     // formData.append("price", values.price);
     formData.append("user_id", values.user_id);
     formData.append("image", values.image);
     formData.append("meta_title", values.meta_title);
     formData.append("meta_description", values.meta_description);
     formData.append("category_id", values.category_id);

     try {
       const response = await fetch(
         "https://gibs-equipment-backend.dynsimulation.com/api/v1/gibsequipment/products",
         {
           method: "POST",
           body: formData, // Using FormData here
         }
       );

       if (response.ok) {
         const result = await response.json();
         console.log(result); // You can log the result to check the response
         toast.success("Product created successfully!");
         setHitApi(!hitApi);
         closeFlyout();
       } else {
         toast.error("Failed to create product");
       }
     } catch (error) {
       console.error("Error:", error);
       toast.error("An error occurred while creating the product");
     }
   };

   const openAddProduct = () => {
     setIsFlyoutOpen(true);
     setIsCreate(true);
   };
   const handleUpdate = async (values: any) => {
     console.log("Updated Product:", values);

     const formData = new FormData();
     formData.append("id", values.id);
     formData.append("name", values.name);
     formData.append("description", values.description);
     // formData.append("price", values.price);
     formData.append("user_id", values.user_id);
     formData.append("meta_title", values.meta_title);
     formData.append("meta_description", values.meta_description);
     formData.append("category_id", values.category_id);

     // Only append the image if a new one is selected
     if (values.image) {
       formData.append("image", values.image);
     }

     try {
       const response = await fetch(
         "https://gibs-equipment-backend.dynsimulation.com/api/v1/gibsequipment/updateproduct",
         {
           method: "PUT",
           body: formData,
         }
       );

       if (response.ok) {
         const result = await response.json();
         console.log(result);
         toast.success("Product updated successfully!");
         closeFlyout();
         setHitApi(!hitApi);
       } else {
         toast.error("Failed to update product");
       }
     } catch (error) {
       console.error("Error:", error);
       toast.error("An error occurred while updating the product");
     }
   };

   const handleLogout = () => {
     if (typeof window !== "undefined") {
       localStorage.clear(); // Clear all items from localStorage
       toast.info("You have been logged out.");
     }
     router.push("/"); // Redirect to the home page
   };

   return (
     <>
       <div className="overflow-x-auto p-6 container">
         {/* Add Button */}
         <div className="mb-4 flex justify-between">
           <button
             style={{ backgroundColor: '#e60000' }}
             onClick={openAddProduct}
             className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200">
             Add Product
           </button>
           <button
             style={{ backgroundColor: '#e60000' }}
             onClick={handleLogout}
             className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200">
             Logout
           </button>
         </div>

         {/* Table */}
         <table className="min-w-full table-auto border-collapse shadow-lg rounded-lg overflow-hidden">
           <thead>
             <tr className="bg-gray-200">
               <th className="px-6 py-3 text-left text-gray-700">Name</th>
               <th className="px-6 py-3 text-left text-gray-700">
                 Description
               </th>
               {/* <th className="px-6 py-3 text-left text-gray-700">Price</th> */}
               <th className="px-6 py-3 text-left text-gray-700">Image</th>
               <th className="px-6 py-3 text-left text-gray-700">Actions</th>
             </tr>
           </thead>
           <tbody>
             {data && data.length > 0 ? (
               data.map((product, index) => (
                 <tr
                   key={product.id}
                   className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                 >
                   <td className="px-6 py-4">{product.name}</td>
                   <td className="px-6 py-4">{product.description}</td>
                   {/* <td className="px-6 py-4">{product.price}</td> */}
                   <td className="px-6 py-4">
                     <img
                       src={
                         product.image_url
                           ? product.image_url
                           : "/images/noimage.jpg"
                       } // Default image if no image_url
                       alt={product.name}
                       className="w-16 h-16 object-cover rounded-md"
                     />
                   </td>
                   <td className="px-6 py-4 space-x-2">
                     <button
                       style={{ backgroundColor: '#003366' }}
                       onClick={() => openEditProduct(product)}
                       className="text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                      >
                       Update
                     </button>
                     <button
                        style={{ backgroundColor: '#e60000' }}
                       onClick={() => handleDelete(product.id)}
                       className="text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                     >
                       Delete
                     </button>
                   </td>
                 </tr>
               ))
             ) : (
               <tr>
                 <td colSpan={5} className="text-center py-4 text-gray-500">
                   No data available
                 </td>
               </tr>
             )}
           </tbody>
         </table>
       </div>

       {/* Background Overlay */}
       {isFlyoutOpen && (
         <div
           className="fixed inset-0 bg-black opacity-50 z-40 transition-opacity duration-300"
           onClick={closeFlyout} // Close flyout when overlay is clicked
         />
       )}
       {/* Flyout */}
       <div
         className={`fixed top-0 right-0 w-full sm:w-[560px] h-full bg-white transform transition-transform duration-300 z-50 ${
           isFlyoutOpen ? "translate-x-0" : "translate-x-full"
         }`}
         >
         <div className="p-4">
           <div onClick={() => closeFlyout()} className=" flex justify-end">
             <CgCloseR className=" text-3xl" />
           </div>
           <div className="border-t border-gray-300 my-4"></div>

           {iscreate && (
             <div className="max-w-4xl mx-auto mt-8 h-[calc(100vh-100px)] overflow-y-auto">
               <Formik
                 initialValues={{
                   name: "",
                   description: "",
                   user_id: userId, // Setting user_id with the userId value
                   image: null,
                   meta_title: "",
                   meta_description: "",
                   category_id: "", // Initialize category_id
                 }}
                 validationSchema={validationSchema}
                 onSubmit={handleAdd} // Log values on submit
               >
                 {({ setFieldValue, isSubmitting }) => (
                   <Form className="grid grid-cols-1 gap-6 bg-white p-8 rounded-lg shadow-md">
                     {/* Name Input */}
                     <div className="flex flex-col w-full">
                       <label
                         htmlFor="name"
                         className="mb-2 text-lg font-semibold text-gray-700"
                       >
                         Name
                       </label>
                       <Field
                         name="name"
                         type="text"
                         className="border border-gray-300 bg-white px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                       />
                       <ErrorMessage
                         name="name"
                         component="div"
                         className="text-red-500 mt-1"
                       />
                     </div>
                     {/* Category Select Dropdown */}
                     <div className="flex flex-col w-full">
                       <label
                         htmlFor="category_id"
                         className="mb-2 text-lg font-semibold text-gray-700"
                       >
                         Category
                       </label>
                       <Field
                         name="category_id"
                         as="select"
                         className="border border-gray-300 bg-white px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                       >
                         <option value="">Select Category</option>
                         <option value="123e4567-e89b-12d3-a456-426614174000">
                           Construction equipment
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174001">
                           Civil Lab Equipment
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174002">
                           BIS Lab test equipment
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174003">
                           Laboratory setup
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174004">
                           School
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174005">
                           Engineering College
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174006">
                           Pharmacy college
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174007">
                           Hospital
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174008">
                           Pathology Lab
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174009">
                           Chemical & Apparatus
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174010">
                           Smart board Interactive panel
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174011">
                           Full HD / 4K camera
                         </option>
                       </Field>
                       <ErrorMessage
                         name="category_id"
                         component="div"
                         className="text-red-500 mt-1"
                       />
                     </div>

                     {/* Image Upload */}
                     <div className="flex flex-col w-full">
                       <label
                         htmlFor="image"
                         className="mb-2 text-lg font-semibold text-gray-700"
                       >
                         Image
                       </label>
                       <input
                         name="image"
                         type="file"
                         accept="image/png, image/jpeg, image/webp"
                         className="border border-gray-300 bg-white px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                         onChange={(event) => {
                           if (event.target.files) {
                             setFieldValue("image", event.target.files[0]);
                           }
                         }}
                       />
                       <ErrorMessage
                         name="image"
                         component="div"
                         className="text-red-500 mt-1"
                       />
                     </div>

                     {/* Description Input */}
                     <div className="flex flex-col w-full">
                       <label
                         htmlFor="description"
                         className="mb-2 text-lg font-semibold text-gray-700"
                       >
                         Description
                       </label>
                       <Field
                         name="description"
                         as="textarea"
                         className="border border-gray-300 bg-white px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-32"
                       />
                       <ErrorMessage
                         name="description"
                         component="div"
                         className="text-red-500 mt-1"
                       />
                     </div>

                     {/* Meta Title Input */}
                     <div className="flex flex-col w-full">
                       <label
                         htmlFor="meta_title"
                         className="mb-2 text-lg font-semibold text-gray-700"
                       >
                         Meta Title
                       </label>
                       <Field
                         name="meta_title"
                         type="text"
                         className="border border-gray-300 bg-white px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                       />
                       <ErrorMessage
                         name="meta_title"
                         component="div"
                         className="text-red-500 mt-1"
                       />
                     </div>

                     {/* Meta Description Input */}
                     <div className="flex flex-col w-full">
                       <label
                         htmlFor="meta_description"
                         className="mb-2 text-lg font-semibold text-gray-700"
                       >
                         Meta Description
                       </label>
                       <Field
                         name="meta_description"
                         as="textarea"
                         className="border border-gray-300 bg-white px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-32"
                       />
                       <ErrorMessage
                         name="meta_description"
                         component="div"
                         className="text-red-500 mt-1"
                       />
                     </div>

                     {/* Submit Button */}
                     <div className="flex flex-col w-full mt-4">
                       <button
                         type="submit"
                         disabled={isSubmitting}
                         className="text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                         style={{backgroundColor: '#003366'}}
                       >
                         {isSubmitting ? "Submitting..." : "Add Product"}
                       </button>
                     </div>
                   </Form>
                 )}
               </Formik>
             </div>
           )}
           {isUpdate && (
             <div className="max-w-4xl mx-auto mt-8 h-[calc(100vh-100px)] overflow-y-auto">
               <Formik
                 initialValues={{
                   id: productEditObject.id,
                   name: productEditObject.name,
                   description: productEditObject.description,
                   user_id: productEditObject.user_id,
                   image_url: productEditObject.image_url,
                   image: null, // Image is null unless a new file is selected
                   meta_title: productEditObject.meta_title || "", // Set initial meta_title
                   meta_description: productEditObject.meta_description || "", // Set initial meta_description
                   category_id: productEditObject.category.id || "", // Set initial category_id
                 }}
                 validationSchema={validationSchemaUpdate}
                 onSubmit={handleUpdate}
               >
                 {({ setFieldValue, isSubmitting, values }) => (
                   <Form className="grid grid-cols-1 gap-6 bg-white p-8 rounded-lg shadow-md">
                     {/* Name Input */}
                     <div className="flex flex-col w-full">
                       <label
                         htmlFor="name"
                         className="mb-2 text-lg font-semibold text-gray-700"
                       >
                         Name
                       </label>
                       <Field
                         name="name"
                         type="text"
                         className="border border-gray-300 bg-white px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                       />
                       <ErrorMessage
                         name="name"
                         component="div"
                         className="text-red-500 mt-1"
                       />
                     </div>
                     {/* Category Select Dropdown */}
                     <div className="flex flex-col w-full">
                       <label
                         htmlFor="category_id"
                         className="mb-2 text-lg font-semibold text-gray-700"
                       >
                         Category
                       </label>
                       <Field
                         name="category_id"
                         as="select"
                         className="border border-gray-300 bg-white px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                       >
                         <option value="">Select Category</option>
                         <option value="123e4567-e89b-12d3-a456-426614174000">
                           Construction equipment
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174001">
                           Civil Lab Equipment
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174002">
                           BIS Lab test equipment
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174003">
                           Laboratory setup
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174004">
                           School
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174005">
                           Engineering College
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174006">
                           Pharmacy college
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174007">
                           Hospital
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174008">
                           Pathology Lab
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174009">
                           Chemical & Apparatus
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174010">
                           Smart board Interactive panel
                         </option>
                         <option value="123e4567-e89b-12d3-a456-426614174011">
                           Full HD / 4K camera
                         </option>
                       </Field>
                       <ErrorMessage
                         name="category_id"
                         component="div"
                         className="text-red-500 mt-1"
                       />
                     </div>

                     {/* Current Image */}
                     <div className="flex flex-col w-full">
                       <label
                         htmlFor="image_url"
                         className="mb-2 text-lg font-semibold text-gray-700"
                       >
                         Current Image
                       </label>
                       <img
                         src={
                           productEditObject.image_url || "images/noimage.jpg"
                         }
                         alt="Product Image"
                         className="mb-4 rounded-lg"
                         style={{ maxWidth: "150px", maxHeight: "150px" }}
                       />
                     </div>

                     {/* Image Upload (Optional) */}
                     <div className="flex flex-col w-full">
                       <label
                         htmlFor="image"
                         className="mb-2 text-lg font-semibold text-gray-700"
                       >
                         Image (Optional)
                       </label>
                       <input
                         name="image"
                         type="file"
                         accept="image/png, image/jpeg, image/webp"
                         className="border border-gray-300 bg-white px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                         onChange={(event) => {
                           if (
                             event.target.files &&
                             event.target.files.length > 0
                           ) {
                             setFieldValue("image", event.target.files[0]);
                           } else {
                             setFieldValue("image", null);
                           }
                         }}
                       />
                       <ErrorMessage
                         name="image"
                         component="div"
                         className="text-red-500 mt-1"
                       />
                     </div>

                     {/* Description Input */}
                     <div className="flex flex-col w-full">
                       <label
                         htmlFor="description"
                         className="mb-2 text-lg font-semibold text-gray-700"
                       >
                         Description
                       </label>
                       <Field
                         name="description"
                         as="textarea"
                         className="border border-gray-300 bg-white px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-32"
                       />
                       <ErrorMessage
                         name="description"
                         component="div"
                         className="text-red-500 mt-1"
                       />
                     </div>

                     {/* Meta Title Input */}
                     <div className="flex flex-col w-full">
                       <label
                         htmlFor="meta_title"
                         className="mb-2 text-lg font-semibold text-gray-700"
                       >
                         Meta Title
                       </label>
                       <Field
                         name="meta_title"
                         type="text"
                         className="border border-gray-300 bg-white px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                       />
                       <ErrorMessage
                         name="meta_title"
                         component="div"
                         className="text-red-500 mt-1"
                       />
                     </div>

                     {/* Meta Description Input */}
                     <div className="flex flex-col w-full">
                       <label
                         htmlFor="meta_description"
                         className="mb-2 text-lg font-semibold text-gray-700"
                       >
                         Meta Description
                       </label>
                       <Field
                         name="meta_description"
                         as="textarea"
                         className="border border-gray-300 bg-white px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-32"
                       />
                       <ErrorMessage
                         name="meta_description"
                         component="div"
                         className="text-red-500 mt-1"
                       />
                     </div>

                     {/* Submit Button */}
                     <div className="flex flex-col w-full mt-4">
                       <button
                         style={{ backgroundColor: '#003366' }}
                         type="submit"
                         disabled={isSubmitting}
                         className="text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                       >
                         {isSubmitting ? "Submitting..." : "Update Product"}
                       </button>
                     </div>
                   </Form>
                 )}
               </Formik>
             </div>
           )}
         </div>
       </div>
     </>
   );
};

export default Page;
