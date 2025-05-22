"use client"
import React, { useEffect, useState } from "react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface Lead {
    name: string
    email: string
    linkedin: string
    company: string
    notes: string
    tags: string[]
    status: string
}

interface LeadFormProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    isEdit?: boolean;
    setIsEdit?: (value: boolean) => void;
    selectedId?: string;
}

export default function LeadForm({ isOpen, setIsOpen, isEdit, setIsEdit, selectedId }: LeadFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        linkedin: "",
        company: "",
        notes: "",
        tags: "",
        status: "new",
    })
    const router = useRouter();

    useEffect(() => {
        const fetchLead = async () => {
            if (isEdit && selectedId) {
                try {
                    const response = await axios.get(`http://localhost:8001/leads/getLead/${selectedId}`);
                    const leadData = response.data;
                    setFormData({
                        name: leadData.name,
                        email: leadData.email,
                        linkedin: leadData.linkedin,
                        company: leadData.company,
                        notes: leadData.notes,
                        tags: leadData.tags.join(", "),
                        status: leadData.status,
                    });
                } catch (error) {
                    console.error("Error fetching lead data:", error);
                }
            }
        };

        fetchLead();
    }, [isEdit, selectedId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const tagsArray = formData.tags
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        const payload = {
            ...formData,
            tags: tagsArray,
        };

        if (isEdit) {
            try {
                const response = await axios.put(`http://localhost:8001/leads/updateLead/${selectedId}`, payload);
                if (response.status === 200) {
                    alert("Lead updated successfully!");
                    setIsOpen(false);
                }
            } catch (error) {
                console.error("Error updating lead form:", error);
                alert("Failed to update lead.");
            }
        }
        else {
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
    }


    return (
        <div className="absolute left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-slate-50 bg-opacity-80">
            <Card className="w-[42vw] max-h-[80vh] overflow-y-auto">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-xl">{!isEdit ? "Add a Lead" : "Edit the Lead"} </CardTitle>
                    <Button
                        onClick={() => {
                            router.push(`/lead?id=${selectedId}`);
                        }}
                    >Show Conversations</Button>
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

                        <div>
                            <Label className="mb-2" htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="contacted">Contacted</SelectItem>
                                    <SelectItem value="converted">Converted</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </CardContent>

                    <CardFooter className="flex justify-end space-x-4">
                        <Button type="submit">{!isEdit ? "Create" : "Update"} </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
