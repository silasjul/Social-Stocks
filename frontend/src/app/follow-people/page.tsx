"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { FollowDialog } from "@/components/follow-dialog";
import PersonCard from "@/components/person-card";
import { usePeople } from "@/hooks/use-people";

export default function FollowPeople() {
    const { people } = usePeople();

    return (
        <AppSidebar activepage="People">
            <div className="flex-col mx-16 my-6">
                <header>
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                        People
                    </h1>
                    <p className="text-xl text-muted-foreground mt-1">
                        Follow influential figures to see their posts.
                    </p>
                </header>
                <div className="mt-8">
                    <FollowDialog />
                    <div className="flex flex-wrap gap-4 mt-4">
                        {people.map((p) => (
                            <PersonCard key={p.username} person={p} />
                        ))}
                    </div>
                </div>
            </div>
        </AppSidebar>
    );
}
