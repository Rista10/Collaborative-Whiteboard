"use client";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface BoardCardProps {
  id: Id<"boards">;
  title: string;
  imageUrl: string;
  authorName: string;
}
export function BoardCard({ id, title, imageUrl, authorName }: BoardCardProps) {
  const deleteBoard = useMutation(api.board.deleteBoard)

  const handleDelete = async () => {
    try {
      await deleteBoard({ id });
      console.log("Board deleted:", id);
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

console.log(imageUrl)
  return (
    <div className="border rounded-lg overflow-hidden flex flex-col">
      <div className="relative h-48 w-full">
       {imageUrl?<Image src={imageUrl} alt={title} fill className="object-cover" />: <div className="bg-gray-200 h-full w-full flex items-center justify-center">No Image</div>}
      </div>
      <div className="flex justify-between items-center p-2">
        <Link href={`/boards/${id}`}>
          <div className="p-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-500">{authorName}</p>
          </div>
        </Link>
       <Trash2 onClick={handleDelete} className="cursor-pointer text-gray-500 hover:text-red-500" />
      </div>
    </div>
  );
}