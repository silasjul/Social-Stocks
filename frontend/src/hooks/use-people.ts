"use client";

import { PeopleContext } from "@/contexts/people-context";
import { useContext } from "react";

export function usePeople() {
    const { people, addPerson, deletePerson } = useContext(PeopleContext);
    return { people, addPerson, deletePerson };
}
