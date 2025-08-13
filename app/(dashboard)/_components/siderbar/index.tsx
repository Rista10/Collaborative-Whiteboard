import { List } from "./list";
import { NewButton } from "./newButton";

export const Sidebar = () => {
  return (
    <aside className="fixed x-1 bg-blue-950 font-sans text-white h-full w-[60px]">
        <List/>
        <NewButton/>



    </aside>
  );
};