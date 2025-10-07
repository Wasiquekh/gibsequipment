// components/Header.tsx
import React from "react";
import Image from "next/image";
import { PiShoppingBagBold } from "react-icons/pi";

const Header = () => {
  return (
    <header className="">
      <div className=" max-w-7xl m-auto mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Image
          src="/images/gibslogo.jpg"
          alt="Site Logo"
          width={90}
          height={90}
        />
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center font-medium">
          <a className="mr-5 ">HOME</a>
          <a className="mr-5 ">ABOUT US</a>
          <a className="mr-5 ">SERVICES</a>
          <a className="mr-5 ">CONTACT US</a>
        </nav>
        <button className="inline-flex gap-2 items-center bg-[#170f0d] text-white border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
          SHOP
          <PiShoppingBagBold />
        </button>
      </div>
    </header>
  );
};

export default Header;
