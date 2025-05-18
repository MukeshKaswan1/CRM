"use client";
import * as React from "react";
import {
    Filter as FilterIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const Filter = ({
    selectedFilter,
    setSelectedFilter,
    filters,
}: {
    selectedFilter: string;
    setSelectedFilter: (filter: string) => void;
    filters: { label: string }[];
}) => {
    const [open, setOpen] = React.useState(false);

    const toggleFilter = (filter: string) => {
        const newFilter = selectedFilter === filter ? "" : filter;
        setSelectedFilter(newFilter);
    };

    return (
        <div className="flex items-center space-x-4">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className={`w-fit justify-start  ${selectedFilter ? "text-slate-900 border-slate-900" : "text-slate-500 border-slate-300"}`}
                    >
                        <div className="flex items-center w-fit">
                            <FilterIcon className="h-4 w-4 mr-2" />
                            {selectedFilter || "Filter"}
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="right" align="start">
                    <Command>
                        <CommandInput placeholder="Change filter..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {filters.map((filter) => {
                                    return (
                                        <CommandItem
                                            
                                            key={filter.label}
                                            value={filter.label}
                                            onSelect={() => {
                                                toggleFilter(filter.label);
                                                setOpen(false);
                                            }}
                                        >
                                            <span
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedFilter === filter.label ? "opacity-100" : "opacity-40"
                                                )}
                                            >
                                            </span>
                                            <span>{filter.label}</span>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default Filter;
