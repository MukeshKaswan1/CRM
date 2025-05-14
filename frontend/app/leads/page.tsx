"use client"
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import LeadForm from './leadForm'

const Page = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])

  interface Lead {
    name: string
    email: string
    linkedin: string
    company: string
    notes: string
    tags: string[]
  }

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(`http://localhost:8001/leads`)
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()
        setLeads(data)
      } catch (error) {
        console.error('Error fetching leads:', error)
      }
    }
    fetchLeads()
  }, [isOpen])

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 px-6 py-10 font-sans">
      <div className="flex items-center justify-between mb-10 max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">🚀 Leads Dashboard</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsOpen(true)}>
          + Add a Lead
        </Button>
      </div>

      <div className="w-full max-w-6xl mx-auto rounded-xl bg-white shadow-lg p-6">
        <Table>
          <TableCaption className="text-gray-500">Manage and track your leads</TableCaption>
          <TableHeader>
            <TableRow className="bg-slate-100 text-gray-700">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>LinkedIn</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead, index) => (
              <TableRow key={index} className="hover:bg-slate-50 transition">
                <TableCell className="font-medium">{lead?.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>
                  <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Profile
                  </a>
                </TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell className="text-sm text-gray-600">{lead.notes}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {lead.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center">
          <LeadForm isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      )}
    </div>
  )
}

export default Page
