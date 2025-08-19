"use client"

import { useOthers, useSelf } from "@liveblocks/react/suspense";

const MAX_VISIBLE_USER = 3;

export const Participants = () => {
    const otherUsers = useOthers();
    const currentUsers = useSelf();
    
    return (
        <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md">
            <div className="flex gap-x-2"> 
                {currentUsers && (
                    <>
                        <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold border-2 border-white">
                            {currentUsers.info?.name?.[0] || "U"}
                        </span>
                        {otherUsers.slice(0, MAX_VISIBLE_USER).map((user) => (
                            <span
                                key={user.connectionId}
                                className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold border-2 border-white"
                                title={user.info?.name}
                            >
                                {user.info?.name?.[0] || "U"}
                            </span>
                        ))}
                        {otherUsers.length > MAX_VISIBLE_USER && (
                            <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold border-2 border-white">
                                +{otherUsers.length - MAX_VISIBLE_USER}
                            </span>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}