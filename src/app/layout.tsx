import type { Metadata } from "next";
import { Montserrat } from "next/font/google"; // Import Montserrat font
import "./globals.css"; // Global styles
import Header from "./components/Header";
import { Suspense } from "react";
import ToastProvider from "./components/ToastProvider";

// Define Montserrat font
const montserrat = Montserrat({
  variable: "--font-montserrat", // Variable to use in your styles
  subsets: ["latin"], // Use Latin subset
});

export const metadata: Metadata = {
  title: "GIBS", // Title for your app
  description: "Your application description here", // Optional: add description
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <Header />
        <Suspense>{children}</Suspense>
        <ToastProvider />
      </body>
    </html>
  );
}
