"use client"

import { ClerkProvider, SignIn, useAuth } from "@clerk/nextjs"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import {
    AuthLoading,
    Authenticated,
    ConvexReactClient,
    Unauthenticated
} from "convex/react"
import { Loading } from "@/components/auth/loading"

interface ConvexClientProviderProps {
    children: React.ReactNode
}
if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!

const convex = new ConvexReactClient(convexUrl)

export const ConvexClientProvider = ({
    children
}: ConvexClientProviderProps) => {
    return (
        <ClerkProvider>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                <Authenticated>
                    {children}
                </Authenticated>
                <AuthLoading>
                    <Loading/>
                </AuthLoading>
                <Unauthenticated>
                    <div className="w-full h-full flex flex-col justify-center items-center">
                        <SignIn routing="hash"/>
                    </div>
                </Unauthenticated>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}