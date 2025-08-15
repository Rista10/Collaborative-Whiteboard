"use client";
import { useOthers, useSelf } from "@liveblocks/react/suspense";

export const Canvas = ({ boardId }: { boardId: string }) => {
  const others = useOthers();
  const currentUser = useSelf()
  
  return (
    <div className="flex-1 bg-gray-100 p-4">
      {currentUser && (
        <div className="mb-4">
          {currentUser.info.name}
          <img src={currentUser.info.imageUrl} alt={currentUser.info.name} height={30} width={30} />
        </div>
      )}
      {others.map((other) => (
        <div key={other.connectionId}>
          <img src={other.info?.imageUrl} alt={other.info?.name} height={30} width={30} />
          <p>{other.info?.name}</p>
        </div>
     ))}
    </div>
  );
};