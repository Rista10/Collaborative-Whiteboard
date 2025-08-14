"use client"

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import React from "react";

import type { LsonObject } from "@liveblocks/client";

interface Layer extends LsonObject {
  id: string;
  type: string;
  data?: any;
}

interface RoomProps {
  children?: React.ReactNode;
  roomId?: string;
  fallback: NonNullable<React.ReactNode> | null;
}

export const Room = ({children,roomId,fallback}:RoomProps)=>{
    return (
        <RoomProvider
        id={roomId || "default-room"}
        initialPresence={{ user: null }}
        initialStorage={{
          layers: new LiveMap<string, LiveObject<Layer>>(),
          layerIds: new LiveList<string>([]),
        }}
        >
            <ClientSideSuspense fallback={fallback}>
                {()=> children}
                </ClientSideSuspense>
        </RoomProvider>
    )

}