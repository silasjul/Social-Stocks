"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
import Image from "next/image";

export function SearchSelector({
    options,
    category,
    value,
    imageFolder,
    setValue,
}: {
    category: string;
    options: string[];
    value: string;
    imageFolder: string;
    setValue: (arg0: string) => void;
}) {
    const [open, setOpen] = React.useState(false);
    const imageSize = 20;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    <div>
                        {value ? (
                            <div className="flex items-center gap-2">
                                <Image
                                    className="rounded-full"
                                    src={`/${imageFolder}/${value}.svg`}
                                    alt={"LOGO"}
                                    width={imageSize}
                                    height={imageSize}
                                />
                                {value}
                            </div>
                        ) : (
                            `Select ${category}...`
                        )}
                    </div>
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder={`Search ${category}...`}
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>No options found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option}
                                    value={option}
                                    onSelect={(currentValue) => {
                                        setValue(
                                            currentValue === value
                                                ? ""
                                                : currentValue
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <Image
                                            className="rounded-full"
                                            src={`/${imageFolder}/${option}.svg`}
                                            alt={"LOGO"}
                                            width={imageSize}
                                            height={imageSize}
                                        />
                                        {option}
                                    </div>
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === option
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
