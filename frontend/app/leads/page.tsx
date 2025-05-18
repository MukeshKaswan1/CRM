"use client"
import React, { useState, useEffect, useRef } from 'react'
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
import { Input } from "@/components/ui/input"
import { Search, X, ChevronRight } from "lucide-react"
import Filter from "./components/Filter"
import { CSVLink } from "react-csv";
import { Download } from "lucide-react";


interface Lead {
  _id: string
  name: string
  email: string
  linkedin: string
  company: string
  notes: string
  tags: string[]
  status: string
}

const Page = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const filters = [
    { label: "new" },
    { label: "contacted" },
    { label: "converted" },
    { label: "closed" },
  ];
  const [filter, setFilter] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const [leadsForCSV, setLeadsForCSV] = useState<any[]>([]);

  const csvHeaders = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "LinkedIn", key: "linkedin" },
    { label: "Company", key: "company" },
    { label: "Notes", key: "notes" },
    { label: "Tags", key: "tags" },
    { label: "Status", key: "status" },
  ];


  const [isMounted, setIsMounted] = useState(false);
  const csvLinkRef = useRef<any>(null);

  const handleDownload = () => {
    if (csvLinkRef.current) {
      csvLinkRef.current.link.click();
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);


  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(`http://localhost:8001/leads?search=${encodeURIComponent(search)}&filter=${encodeURIComponent(filter)}`);
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()
        setLeads(data)
      } catch (error) {
        console.error('Error fetching leads:', error)
      }
    }

    fetchLeads();
    if (!isOpen) {
      setIsEdit(false);
      setSelectedId("");
    }
  }, [isOpen, search, filter]);

  useEffect(() => {
    const leadsForCsv = leads.map((lead) => ({
      ...lead,
      tags: lead.tags.join(", "),
    }));

    setLeadsForCSV(leadsForCsv)
  }, [leads])

  useEffect(() => {
    if (isEdit && selectedId) {
      setIsOpen(true);
    }
  }, [isEdit, selectedId]);

  useEffect(() => {
    console.log(isEdit)
  }, [isEdit])

  if (!isMounted) {
    return null;
  }


  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 px-6 py-10 font-sans">
      <div className="flex items-center justify-between mb-10 max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">🚀 Leads Dashboard</h1>
        <div className="flex gap-3 justify-end">
          <Button onClick={handleDownload} >
            <Download />
            <CSVLink
              ref={csvLinkRef}
              headers={csvHeaders}
              filename="leads.csv"
              data={leadsForCSV}
              className="hidden"
            />
            Export Leads
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsOpen(true)}>
            + Add a Lead
          </Button>
        </div>
      </div>

      <div className="relative flex w-full justify-between mb-3 px-28">
        <Search
          className="absolute left-32 top-2.5 h-4 w-3 text-slate-400"
          strokeWidth={2}
        />
        <Input
          type="search"
          placeholder="Search by name/company/tags"
          className="bg-background appearance-none pl-8 shadow-none md:w-1/4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center space-x-2">
          <Filter
            filters={filters}
            selectedFilter={filter}
            setSelectedFilter={setFilter}
          />
        </div>
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
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead, index) => (
              <TableRow key={index} className="hover:bg-slate-50 transition"
                onClick={() => {
                  setIsEdit(true);
                  setSelectedId(lead?._id);
                }}
              >
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
                <TableCell>
                  <span className={`text-sm font-semibold rounded-xl px-2 py-0.5 ${lead.status === 'new' ? 'text-green-600 bg-green-100' : lead.status === 'contacted' ? 'text-yellow-600 bg-yellow-100' : lead.status === 'converted' ? 'text-blue-600 bg-blue-100' : 'text-red-600 bg-red-100'}`}>
                    {lead.status}
                  </span>
                </TableCell>
                <TableCell>
                  <ChevronRight className="h-4 w-4" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center">
          <LeadForm isOpen={isOpen} setIsOpen={setIsOpen} isEdit={isEdit} setIsEdit={setIsEdit} selectedId={selectedId} />
        </div>
      )}
    </div>
  )
}

export default Page
