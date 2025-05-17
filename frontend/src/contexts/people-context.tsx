"use client";

import { dummyPeople } from "@/lib/dummy-data";
import { Person } from "@/lib/interfaces";
import React, { createContext, useContext, useEffect, useState } from "react";

interface PeopleProviderProps {
    people: Person[];
    addPerson: (person: Person) => void;
    deletePerson: (person: Person) => void;
}

export const PeopleContext = createContext<PeopleProviderProps>({
    people: [],
    addPerson: () => {},
    deletePerson: () => {},
});

export default function PeopleProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [people, setPeople] = useState<Person[]>([...dummyPeople]);

    const addPerson = (person: Person) => {
        setPeople([...people, person]);
    };

    const deletePerson = (person: Person) => {
        setPeople(people.filter((p) => p !== person));
    };

    return (
        <PeopleContext.Provider value={{ people, addPerson, deletePerson }}>
            {children}
        </PeopleContext.Provider>
    );
}

export function usePeople() {
    const { people, addPerson, deletePerson } = useContext(PeopleContext);
    return { people, addPerson, deletePerson };
}
