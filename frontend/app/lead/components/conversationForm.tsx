"use client"
import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ConversationFormProps {
  leadId: string
  onClose: () => void
}

export default function ConversationForm({ leadId, onClose }: ConversationFormProps) {

  const [id, setId] = useState(leadId)
  const [formData, setFormData] = useState({
    type: "email",
    summary: "",
    followUpDate: null as Date | null,
    followUpMessage: "",
  })
  console.log("leadId", leadId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      leadId,
      type: formData.type,
      summary: formData.summary,
      followUp: {
        date: formData.followUpDate || undefined,
        message: formData.followUpMessage || undefined,
      },
    }

    try {
      const res = await axios.post("http://localhost:8001/conversation/createLog", payload)
      if (res.status === 200) {
        alert("Conversation logged successfully!")
        onClose()
      }
    } catch (error) {
      console.error("Error submitting conversation:", error)
      alert("Failed to log conversation.")
    }
  }

  return (
    <div className="absolute left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-slate-50 bg-opacity-80">
      <Card className="w-[40vw] max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-xl">🗣️ Log New Conversation</CardTitle>
          <X className="cursor-pointer" onClick={onClose} />
        </CardHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2" htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2" htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Write a short summary of the conversation"
                required
              />
            </div>

            <div>
              <Label className="mb-2" htmlFor="followUpDate">Follow-up Date (optional)</Label>
              <Input
                id="followUpDate"
                type="date"
                value={formData.followUpDate ? formData.followUpDate.toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    followUpDate: e.target.value ? new Date(e.target.value) : null,
                  })
                }
              />

            </div>

            <div>
              <Label className="mb-2" htmlFor="followUpMessage">Follow-up Message (optional)</Label>
              <Textarea
                id="followUpMessage"
                value={formData.followUpMessage}
                onChange={(e) => setFormData({ ...formData, followUpMessage: e.target.value })}
                placeholder="E.g., Remind them about the demo call"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit">Log Conversation</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
