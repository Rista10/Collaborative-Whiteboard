'use client';

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NewBoardButtonProps {
  orgId: string;
  disabled?: boolean;
}

export function NewBoardButton({ orgId, disabled }: NewBoardButtonProps) {
    const router = useRouter();
    const createBoard = useMutation(api.board.createBoard);

    const handleClick = () =>{
        createBoard({ orgId, title: "New Board" })
        .then((id) => {
            toast.success("Board created successfully");
            router.push(`/board/${id}`);
        })
        .catch((error) => {
            console.error("Error creating board:", error);
            toast.error("Failed to create board");
        });
    }

   return (
       <button onClick={handleClick} disabled={disabled}>
           Create New Board
       </button>
   );
}
