import React from "react";
import image404 from "../images/UnderConst.png"; // adjust path if needed

export default function Error404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-sm w-full">
        <img
          src={image404}
          alt="Page not found"
          className="w-full h-auto"
        />
      </div>

      <h1 className="text-2xl font-semibold mt-6">
        Oops! Page Not Found
      </h1>

      <p classname="text-gray-600 mt-2">
        The page you are looking for doesn’t exist or has been moved.
      </p>
    </div>
  );
}
