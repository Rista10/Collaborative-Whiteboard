"use client"

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import React from "react";

interface RoomProps {
  children?: React.ReactNode;
  roomId?: string;
  fallback: NonNullable<React.ReactNode> | null;
}

export const Room = ({children,roomId,fallback}:RoomProps)=>{
    return (
        <LiveblocksProvider
           authEndpoint="/api/liveblocks-auth">
        <RoomProvider
        id={roomId || "default-room"}>
            <ClientSideSuspense fallback={fallback}>
                {()=> children}
                </ClientSideSuspense>
        </RoomProvider>
        </LiveblocksProvider>
    )

}