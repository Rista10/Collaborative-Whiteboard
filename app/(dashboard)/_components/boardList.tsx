"use client";
import { useQuery } from "convex/react";
import { NewBoardButton } from "./siderbar/newBoardButton";
import { api } from "@/convex/_generated/api";
import { EmptyBoards } from "./emptyBoard";
import { BoardCard } from "./boardCard";

interface BoardListProps {
  orgId: string;
}

export function BoardList({ orgId }: BoardListProps) {
  const data = useQuery(api.board.getBoardList, { orgId });

  if (!data || data.length === 0) {
    return <EmptyBoards />;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Team Boards</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <NewBoardButton orgId={orgId} />
        {data.map((board) => (
          <BoardCard
            key={board._id}
            id={board._id}
            title={board.title}
            authorName={board.authorName}
            imageUrl={board.imageUrl || ""}
          />
        ))}
      </div>
    </div>
  );
}
