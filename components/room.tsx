"use client"
import { Layer } from "@/types/canvas";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
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

export const Room = ({children,roomId,fallback}:RoomProps)=>(
  <LiveblocksProvider
    authEndpoint="/api/liveblocks-auth">
    <RoomProvider
      id={roomId || "default-room"}
      initialPresence={{
        cursor: null,
        selection: [],
        pencilDraft: null,
        pencilColor: null
      }}
      initialStorage={{
        layers: new LiveMap<string, LiveObject<Layer>>(),
        layerIds: new LiveList<string>([]),
      }}
    >
      <ClientSideSuspense fallback={fallback}>
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  </LiveblocksProvider>
)