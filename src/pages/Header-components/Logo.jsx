import React from "react";
import { Link } from "react-router-dom";
import logo from "../img/white-logo.svg"; 

export default function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-3 group">
      <div className="bg-zinc-950 p-2 rounded-full transition-transform duration-300 transform group-hover:scale-105 group-hover:ring-2 group-hover:ring-indigo-500">
        <img src={logo} alt="2Philosophers Logo" className="h-10 w-10 object-contain rounded-full" />
      </div>
      <span
        className="hidden sm:inline-block text-xl sm:text-2xl md:text-3xl font-medium tracking-widest text-gray-900 dark:text-gray-100 uppercase animate-fadeIn"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        DuSofi
      </span>
    </Link>
  );
}
