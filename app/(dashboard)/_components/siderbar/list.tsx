"use client"

import { useOrganizationList } from "@clerk/nextjs"
import { Item } from "./item";

export const List = () => {
    const { userMemberships } = useOrganizationList({
        userMemberships: {
            infinite: true
        }
    });

    return (
        <ul className="space-y-2">
            {userMemberships.data?.map((membership) => (
                <li key={membership.id}>
                    <Item
                        id={membership.organization.id}
                        name={membership.organization.name}
                        imageUrl={membership.organization.imageUrl}
                    />
                </li>
            ))}
        </ul>
    );
}