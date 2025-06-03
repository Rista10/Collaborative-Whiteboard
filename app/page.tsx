"use client";

import { UserButton } from "@clerk/nextjs";


export default function Home() {
  

  return (
    <div className="flex flex-col gap-y-48">
      <div>
        This is a screen for authenticated users
      </div>
      <div>
        <UserButton/>
      </div>
    </div>
  );
}
