"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { FollowDialog } from "@/components/follow-dialog";
import PersonCard from "@/components/person-card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePeople } from "@/hooks/use-people";

export default function FollowPeople() {
    const { people, isLoading, error, addPerson, deletePerson } = usePeople();

    return (
        <AppSidebar activepage="People">
            <div className="mx-18 my-6">
                <header>
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                        People
                    </h1>
                    <p className="text-xl text-muted-foreground mt-1">
                        Follow influential figures to see their posts.
                    </p>
                </header>
                <div className="mt-8">
                    <FollowDialog people={people} addPerson={addPerson} />
                    {!isLoading && (
                        <div className="flex flex-wrap gap-4 mt-4">
                            {people.map((p) => (
                                <PersonCard
                                    key={p.username}
                                    person={p}
                                    deletePerson={deletePerson}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppSidebar>
    );
}
