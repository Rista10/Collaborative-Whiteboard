import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CreateOrganization } from "@clerk/nextjs";
import { Plus } from "lucide-react";

export const NewButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="aspect-square">
                    <button className="w-full h-full flex items-center justify-center bg-white/25 p-3rounded-md opacity-50">
                        <Plus className="text-white" />
                    </button>
                </div>
            </DialogTrigger>
            <DialogContent className="p-0 bg-transparent border-none max-[480px]:">
                <DialogHeader>
                    <DialogTitle className="sr-only">Create Organization</DialogTitle>
                </DialogHeader>
                <CreateOrganization />
            </DialogContent>
        </Dialog>
    );
};