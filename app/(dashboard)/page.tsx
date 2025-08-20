"use client"
import React from 'react'
import { BoardList } from './_components/boardList'
import { useOrganization } from '@clerk/nextjs'
import { EmptyOrg } from './_components/emptyOrg';

export default function DashboardPage() {
  const {organization} = useOrganization();
  return (
    <div>
      {organization ? (
        <BoardList orgId={organization.id || "new-board"} />
      ) : (
        <EmptyOrg />
      )}
    </div>
  )
}
