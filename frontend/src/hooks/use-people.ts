import { Person } from "@/lib/interfaces";
import axios from "axios";
import { useEffect, useState } from "react";

export function usePeople() {
    const peopleURL = "http://localhost:8080/people";
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [people, setPeople] = useState<Person[]>([]);

    useEffect(() => {
        setIsLoading(true);
        setError(undefined);
        const fetchPeople = async () => {
            try {
                const res = await axios.get(peopleURL);
                const data = res.data as Person[];
                setPeople(data);
            } catch (err: any) {
                setError(err);
                console.error("Error fetching people: " + err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPeople();
    }, []);

    const addPerson = (person: Person) => {
        setPeople((prev) => [...prev, person]);
        axios.post(peopleURL, {
            profileName: person.profileName,
            username: person.username,
            description: person.description,
            imgUrl: person.imgUrl,
        });
    };

    const deletePerson = (person: Person) => {
        setPeople(people.filter((p) => p.username != person.username));
    };

    return { people, isLoading, error, addPerson, deletePerson };
}
