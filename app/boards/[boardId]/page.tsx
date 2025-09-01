import { Room } from "@/components/room";
import { Canvas } from "./_components/canvas";



export type paramsType = Promise<{ boardId: string }>;


export default async function BoardPage(props: { params: paramsType }) {

  const { boardId } = await props.params;
  return (
    <Room
      roomId={boardId}
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
  );
}