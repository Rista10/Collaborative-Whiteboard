 "use client"

import { UserButton } from "@clerk/nextjs";

 export const Navbar = () => {
   return (
     <nav className="bg-gray-800 flex items-center justify-between p-5 gap-x-4">
        Navbar
        <UserButton/>
     </nav>
   );
 }