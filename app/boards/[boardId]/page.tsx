import { Room } from "@/components/room";
import { Canvas } from "./_components/canvas";

interface BoardPageProps {
  params: {
    boardId: string;
  };
}

export default function BoardPage({ params }: BoardPageProps) {
    return(
        <Room 
          roomId={params.boardId} 
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-medium">Loading...</div>
              </div>
            </div>
          }
        >
          <Canvas />
        </Room>
    )
}