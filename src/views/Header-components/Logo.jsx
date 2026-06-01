"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import logo from "../img/white-logo.svg";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center space-x-3 group"
      aria-label="DuSofi homepage"
      title="DuSofi homepage"
    >
      <div className="bg-zinc-950 p-2 rounded-full transition-transform duration-300 transform group-hover:scale-105 group-hover:ring-2 group-hover:ring-indigo-500">
        <Image
          src={logo}
          alt="DuSofi Philosophy Logo"
          width={40}
          height={40}
          className="h-10 w-10 object-contain rounded-full"
          priority
        />
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
