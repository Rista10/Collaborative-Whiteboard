import { Canvas } from "./_components/canvas";

interface BoardPageProps {
  params: {
    boardId: string;
  };
}

export default function BoardPage({ params }: BoardPageProps) {
    return(
        <Canvas boardId={params.boardId} />
    )
}