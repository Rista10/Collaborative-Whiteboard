"use client"
import React from 'react'
import { BoardList } from './_components/boardList'
import { useOrganization } from '@clerk/nextjs'

export default function DashboardPage() {
  const {organization} = useOrganization();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
      {organization ? (
        <BoardList orgId={organization.id} />
      ) : (
        <p>Please select an organization to view boards.</p>
      )}
    </div>
  )
}
