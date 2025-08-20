"use client";

import { OrganizationProfile, OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"; // assuming you have shadcn/ui
import { Dialog, DialogContent,  DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 h-20">

      <div className="flex items-center gap-4">
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
      </div>

      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        Collaborative Whiteboard
      </h1>

      <div className="flex items-center gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Invite Members</Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-transparent border-none max-w-[880px]">
            <DialogTitle>
              <VisuallyHidden>Organization Settings</VisuallyHidden>
            </DialogTitle>
            <OrganizationProfile routing="hash" />
          </DialogContent>
        </Dialog>


        <UserButton />
      </div>
    </nav>
  );
};


