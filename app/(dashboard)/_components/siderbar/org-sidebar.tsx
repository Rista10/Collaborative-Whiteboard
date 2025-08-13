"use client"
import { OrganizationSwitcher } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export const OrgSidebar = () => {
  return (
   <div className="hidden lg:flex flex-col space-y-6 w-[200px] pl-5 pt-5 bg-red-500">
          <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            },
            organizationSwitcherTrigger: {
              padding: "6px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #E5E7EB",
              justifyContent: "space-between",
              backgroundColor: "white",
            },
          },
        }}
      />
      <Link href="/">
        <button className="w-full h-10 bg-white rounded-md text-gray-800 hover:bg-gray-100 transition-colors">
          Boards List
        </button>
      </Link>
   </div>

  );
}