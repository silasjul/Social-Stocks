"use client";

import { Button } from "@/components/ui/button";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { z } from "zod";
import { Person } from "@/lib/interfaces";
import { useScraper } from "@/hooks/use-scraper";

const twitterUsernameSchema = z
    .string()
    .min(4, { message: "Username must be at least 4 characters long." })
    .regex(/^@[a-zA-Z0-9_]+$/, {
        message:
            "Username can only contain letters, numbers, underscores and starts with @.",
    });

export function FollowDialog({
    people,
    addPerson,
}: {
    people: Person[];
    addPerson: (person: Person) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [username, setUsername] = useState("");
    const [searchValidation, setSearchValidation] = useState("");
    const { isLoading, error, scrapeProfile } = useScraper();

    const handleSubmit = async () => {
        // Validate input
        const result = twitterUsernameSchema.safeParse(username);
        if (!result.success) {
            setSearchValidation(result.error.issues[0].message);
            return;
        }
        setSearchValidation("");

        // Check if you already follow the person
        for (const person of people) {
            if (
                username.toLocaleLowerCase() ===
                person.username.toLocaleLowerCase()
            ) {
                console.log("already followed");
                setSearchValidation("You already follow this person.");
                return;
            }
        }

        // Search for a profile
        const person_data = await scrapeProfile(username.slice(1)); // removes @
        if (person_data) {
            addPerson(person_data);
            setUsername("");
        }
    };

    // Searching animation
    const searchBtnRef = useRef(null);
    useGSAP(() => {
        const searchBtn = searchBtnRef.current;

        if (isLoading) {
            gsap.to(searchBtn, {
                opacity: 0.1,
                duration: 0.5,
                scale: 1.1,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1,
            });
        } else {
            gsap.killTweensOf(searchBtn);
            gsap.to(searchBtn, {
                opacity: 1,
                scale: 1,
            });
        }
    }, [isLoading]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Add person
                    <PlusIcon className="h-20 w-20" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add person</DialogTitle>
                    <DialogDescription>
                        Provide the username of the person you wish to follow.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div className="flex gap-4">
                        <Label
                            htmlFor="username"
                            className="text-right row-span-2 flex items-center gap-1"
                        >
                            <p>Username</p>
                            <a href="https://x.com" target="_blanc">
                                <div className="w-5 h-5">
                                    <div className="absolute bg-white w-4 h-4 z-[-1] translate-x-0.5 translate-y-0.5" />
                                    <Image
                                        className="rounded-sm min-w-5 min-h-5"
                                        height={20}
                                        width={20}
                                        src={"/logos/twitter.png"}
                                        alt="twitter"
                                    />
                                </div>
                            </a>
                        </Label>
                        <Input
                            ref={inputRef}
                            id="username"
                            placeholder="@example"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    {searchValidation && (
                        <p className="text-red-500 text-sm">
                            {searchValidation}
                        </p>
                    )}
                    {error && (
                        <p className="text-red-500 text-sm mt-0.5">
                            {error.response?.data?.detail || error?.message}
                        </p>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        ref={searchBtnRef}
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Searching..." : "Start search"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
