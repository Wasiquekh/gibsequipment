"use client"; // This marks the component for client-side rendering

import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"; // <-- Correct import for client-side navigation

// 1. Define the Yup validation schema first
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// 2. Infer the TypeScript type from the validation schema
type LoginFormValues = Yup.InferType<typeof validationSchema>;

const Page = () => {
  const router = useRouter(); // Use the correct router hook

  // 3. Use the inferred type for initialValues and handleSubmit
  const initialValues: LoginFormValues = { email: "", password: "" };

  // Handle form submission
  const handleSubmit = async (values: LoginFormValues) => {
    console.log(values); // log the values to the console

    // Prepare the request payload
    const payload = new URLSearchParams({
      email: values.email,
      password: values.password,
    });

    try {
      const response = await fetch(
        "https://gibs-equipment-backend.dynsimulation.com/api/v1/gibsequipment/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: payload,
        }
      );
      const data = await response.json();

      console.log("Response Data:", data);

      // Check for successful login response
      if (data?.data?.user) {
        const userEmail = data.data.user.email;
        const userId = data.data.user.id;

        // Save user details in localStorage
        localStorage.setItem("userEmail", userEmail);
        localStorage.setItem("userId", userId);

        toast.success("Login Success");
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);  // Redirect with a small delay
        console.log("Redirecting to dashboard...", data);
      } else {
        // If no user data exists, show an error
        toast.error("Invalid username or password.");
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      toast.error("Login Failed. Please try again.");
    }
  };

  return (
    <div>
      {/* NOTE: The <header> component here should ideally be moved 
        to your global app/layout.tsx file if you want it on every page.
      */}
      <header>
        <div className="p-4 text-white text-center" style={{ backgroundColor: "#e60000" }}>
          <h1 className="text-xl">Welcome Ranjeet Kumar</h1>
        </div>
      </header>

      {/* Login Form */}
      <div className="max-w-md mx-auto mt-10">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="bg-white p-8 rounded shadow-md border" style={{ borderColor: "#e60000" }}>
              <div className="mb-4">
                <label htmlFor="email" className="block" style={{ color: "#e60000" }}>
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full p-2 border rounded mt-1"
                  style={{ borderColor: "#e60000" }}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block" style={{ color: "#e60000" }}>
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full p-2 border rounded mt-1"
                  style={{ borderColor: "#e60000" }}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="mb-4">
                <button
                  type="submit"
                  className="w-full text-white p-2 rounded disabled:opacity-50 hover:bg-opacity-90 transition duration-150"
                  disabled={isSubmitting}
                  style={{ backgroundColor: "#e60000" }}
                >
                  {isSubmitting ? "Logging In..." : "Login"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Page;
