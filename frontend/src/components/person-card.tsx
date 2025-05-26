import { Person } from "@/lib/interfaces";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";

export default function PersonCard({
    person,
    deletePerson,
}: {
    person: Person;
    deletePerson: (person: Person) => void;
}) {

    return (
        <div className="rounded-lg border p-4">
            <div className="flex gap-3 items-center">
                <Image
                    className="rounded-full"
                    height={60}
                    width={60}
                    alt="Image"
                    src={person.imgUrl}
                />
                <div className="flex gap-4 w-full">
                    <div>
                        <p className="font-medium">{person.profileName}</p>
                        <p className="opacity-50">{person.username}</p>
                    </div>
                    <Button
                        className="ml-auto hover:bg-red-500 hover:text-white"
                        onClick={() => {
                            deletePerson(person);
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </div>
            <p className="mt-2 text-sm">
                {person.description
                    ? person.description
                    : "No profile description."}
            </p>
        </div>
    );
}
