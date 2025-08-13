"use client";
import { useQuery } from "convex/react";
import { NewBoardButton } from "./siderbar/newBoardButton";
import { api } from "@/convex/_generated/api";

interface BoardListProps {
  orgId: string;
}

export function BoardList({ orgId }: BoardListProps) {
    const data = useQuery(api.board.getBoardList, { orgId });
  return (
    <div className="flex flex-col gap-y-2">
     <NewBoardButton orgId={orgId} />
        {data && data.length > 0 ? (
            <ul className="space-y-2">
            {data.map((board) => (
                <li key={board._id} className="p-2 border rounded hover:bg-gray-100">
                <a href={`/boards/${board._id}`} className="text-blue-600 hover:underline">
                    {board.title}
                </a>
                </li>
            ))}
            </ul>
        ) : (
            <p className="text-gray-500">No boards found.</p>
        )}
    </div>
  );
}