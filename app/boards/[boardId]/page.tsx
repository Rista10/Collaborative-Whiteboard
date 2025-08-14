import { Room } from "@/components/room";
import { Canvas } from "./_components/canvas";

interface BoardPageProps {
  params: {
    boardId: string;
  };
}

export default function BoardPage({ params }: BoardPageProps) {
    return(
        <Room roomId={params.boardId} fallback={<div>Loading...</div>}>
          {/* <Canvas /> */}
        </Room>
    )
}