import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center">
      {/* Left Section */}
      <div className="text-white font-semibold text-lg">
        Prediction Analysis
      </div>

      {/* Right Section */}
      <div className="space-x-4">
        <button className="bg-white text-blue-500 py-2 px-4 rounded hover:bg-gray-100">
          Contact
        </button>
        <button className="bg-white text-blue-500 py-2 px-4 rounded hover:bg-gray-100">
          Support
        </button>
        <button className="bg-white text-blue-500 py-2 px-4 rounded hover:bg-gray-100">
          Help
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
