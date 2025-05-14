"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
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
import axios from "axios"

interface LeadFormProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

export default function LeadForm({ isOpen, setIsOpen }: LeadFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        linkedin: "",
        company: "",
        notes: "",
        tags: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Convert tags string to array (trimmed and filtered)
        const tagsArray = formData.tags
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        // Prepare the final data payload
        const payload = {
            ...formData,
            tags: tagsArray,
        };

        try {
            const response = await axios.post("http://localhost:8001/leads", payload);
            if (response.status === 200) {
                alert("Lead created successfully!");
                setIsOpen(false);
            }
        } catch (error) {
            console.error("Error submitting lead form:", error);
            alert("Failed to create lead.");
        }
    }


    return (
        <div className="absolute left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-slate-50 bg-opacity-80">
            <Card className="w-[42vw] max-h-[80vh] overflow-y-auto">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-xl">Add a Lead</CardTitle>
                    <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
                </CardHeader>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="mb-2" htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter full name"
                            />
                        </div>

                        <div>
                            <Label className="mb-2" htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter email"
                            />
                        </div>

                        <div>
                            <Label className="mb-2" htmlFor="linkedin">LinkedIn</Label>
                            <Input
                                id="linkedin"
                                value={formData.linkedin}
                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                placeholder="LinkedIn profile URL"
                            />
                        </div>

                        <div>
                            <Label className="mb-2" htmlFor="company">Company</Label>
                            <Input
                                id="company"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                placeholder="Company name"
                            />
                        </div>

                        <div>
                            <Label className="mb-2" htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Any notes about this lead"
                            />
                        </div>

                        <div>
                            <Label className="mb-2" htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="Comma-separated tags"
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end space-x-4">
                        <Button type="submit">Create</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
