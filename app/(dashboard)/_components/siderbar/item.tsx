"use client"
import { cn } from "@/lib/utils"
import Image from "next/image"

import {
    useOrganization,
    useOrganizationList,
} from "@clerk/nextjs";

interface ItemProps {
    id: string;
    name: string;
    imageUrl?: string;
}

export const Item = ({ id, name, imageUrl }: ItemProps) => {
    const { organization } = useOrganization();
    const { setActive } = useOrganizationList();
    const isActive = organization?.id === id;

    const onClick = () => {
        if (!setActive) return;
        setActive({ organization: id });
    }

    return (
        <>  
            {imageUrl && (
                <Image
                    src={imageUrl}
                    alt={`${name} logo`}
                    width={30}
                    height={30}
                    className={cn(
                "cursor-pointer m-4 ",
                isActive ? "bg-blue-500 text-white opacity-100" : "bg-gray-200 text-black opacity-60"
            )}
            onClick={onClick}
                />
            )}
        </>
    );
};