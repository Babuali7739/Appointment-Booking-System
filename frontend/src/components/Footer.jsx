import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="logo" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>

        <div>
          <p className="text-xl mb-5 font-medium">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600 cursor-pointer">
            <li>Home</li>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl mb-5 font-medium">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600 cursor-pointer">
            <li>+91 7739067097</li>
            <li>babu.ali.dev@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center text-gray-700">
          Copyright © 2025 Altaf - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
