import React from "react";
import {
  Wrench,
  Zap,
  Paintbrush,
  Car,
  Home,
  Scissors,
  Bath,
  Laptop,
} from "lucide-react";

const categories = [
  { name: "Plumbing", icon: <Wrench className="w-5 h-5" /> },
  { name: "Electrical", icon: <Zap className="w-5 h-5" /> },
  { name: "Painting", icon: <Paintbrush className="w-5 h-5" /> },
  { name: "Automotive", icon: <Car className="w-5 h-5" /> },
  { name: "Home Repair", icon: <Home className="w-5 h-5" /> },
  { name: "Salon", icon: <Scissors className="w-5 h-5" /> },
  { name: "Cleaning", icon: <Bath className="w-5 h-5" /> },
  { name: "IT Services", icon: <Laptop className="w-5 h-5" /> },
];

const Categories = () => {
  return (
    <div className="w-full px-4 py-5 bg-slate-800/30 backdrop-blur-md border border-slate-700 rounded-xl shadow-inner hidden md:block">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((category, index) => (
          <button
            key={index}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-700/40 text-slate-200 hover:bg-blue-600/30 hover:text-white transition-all duration-300 shadow hover:shadow-lg"
          >
            <div className="mb-2 text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
              {category.icon}
            </div>
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;

