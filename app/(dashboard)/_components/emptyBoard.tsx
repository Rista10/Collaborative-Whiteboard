"use client";

import { useOrganization } from "@clerk/nextjs";
import { NewBoardButton } from "./siderbar/newBoardButton";
import Image from "next/image";

export function EmptyBoards() {
  const { organization } = useOrganization();
  
  return (
    <div className=" min-h-dvh flex flex-col items-center justify-center text-center p-4">
      <Image src="/empty-board.png" width={350} height={250} alt="Board" />  
      <h2 className="text-2xl font-semibold mt-6">Create your first board</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Start by creating a board for your organization
      </p>
      <div className="mt-6">
        {organization && <NewBoardButton orgId={organization.id} />}
      </div>
    </div>
  );
}