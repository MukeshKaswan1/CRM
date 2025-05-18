"use client"
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CalendarDays, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import ConversationForm from './components/conversationForm'
import axios from 'axios'

interface Conversation {
    _id: string
    leadId: string
    type: "email" | "call" | "meeting" | "linkedin" | "other"
    summary: string
    followUp?: {
        date?: string
        message?: string
    }
    createdAt: string
}

const ConversationList: React.FC = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [showConversationForm, setShowConversationForm] = useState(false)
    const [leadId, setLeadId] = useState<string>("")
    const [suggestion, setSuggestion] = useState<string>("")
    const [showSuggestion, setShowSuggestion] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const id = params.get("id") || ""
        setLeadId(id)
    }, [])

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await axios.get(`http://localhost:8001/conversation/getLogs/${leadId}`)
                setConversations(response.data)
            } catch (error) {
                console.error('Error fetching conversations:', error)
            }
        }

        if (leadId) fetchConversations()
    }, [leadId, showConversationForm])

    useEffect(() => {
        const fetchAiSuggestions = async () => {
            try {
                const aiSuggestions = await axios.get(`http://localhost:8001/ai/suggestion/${leadId}`)
                if (aiSuggestions.status === 200) {
                    console.log("AI Suggestions:", aiSuggestions.data)
                } else {
                    console.error("Error fetching AI suggestions")
                }
                setSuggestion(aiSuggestions.data.suggestion)
            } catch (error) {
                console.error("Error fetching AI suggestions:", error)
            }
        }

        if (leadId) fetchAiSuggestions()
    }, [leadId])

    return (
        <div className="w-full max-w-6xl mx-auto rounded-xl bg-white shadow-lg p-6 mt-10">
            <div className="flex items-center justify-between mb-10 max-w-6xl mx-auto">
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">🚀 Conversations Dashboard</h1>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowConversationForm(true)}>
                    + Add Conversation
                </Button>
            </div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">💬 Conversations</h2>
            <Table>
                <TableCaption className="text-gray-500">All interactions related to this lead</TableCaption>
                <TableHeader>
                    <TableRow className="bg-slate-100 text-gray-700">
                        <TableHead>Type</TableHead>
                        <TableHead>Summary</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Follow-Up</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {conversations.map((conv) => (
                        <TableRow key={conv._id} className="hover:bg-slate-50 transition">
                            <TableCell className="capitalize font-medium">
                                <div className="flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4 text-slate-600" />
                                    {conv.type}
                                </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-700">{conv.summary}</TableCell>
                            <TableCell className="text-sm text-gray-500">
                                {new Date(conv.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                                {conv.followUp?.date ? (
                                    <div className="flex flex-col">
                                        <span className="flex items-center gap-1 text-blue-600">
                                            <CalendarDays className="h-4 w-4" />
                                            {new Date(conv.followUp.date).toLocaleDateString()}
                                        </span>
                                        {conv.followUp.message && (
                                            <span className="text-xs mt-1 text-gray-500 italic">
                                                “{conv.followUp.message}”
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-400 italic">None</span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {showConversationForm && (
                <ConversationForm leadId={leadId} onClose={() => setShowConversationForm(false)} />
            )}
            {/* Floating AI Suggestion Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <div className="relative">
                    <Button
                        className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
                        onClick={() => setShowSuggestion((prev) => !prev)}
                    >
                        <MessageCircle className="w-5 h-5" />
                    </Button>

                    {showSuggestion && (
                        <div className="absolute bottom-16 right-0 w-72 bg-white shadow-xl rounded-xl p-4 border text-sm">
                            <div className="mb-2 font-semibold text-gray-800">🤖 AI Suggestion</div>
                            <div className="text-gray-600 whitespace-pre-line">
                                {suggestion || "No suggestions available."}
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default ConversationList
