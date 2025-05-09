"use client";

import { AppSidebar } from "@/components/app-sidebar";
import PostCard from "@/components/post-card";
import { SearchSelector } from "@/components/search-selector";
import StockChart from "@/components/stock-chart";
import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { dummyPeople, dummyPosts } from "@/lib/dummy-data";
import { defaultSymbols, timeFrames } from "@/lib/chart-configs";
import { Person, Post } from "@/lib/interfaces";

export default function Charts() {
    const { theme } = useTheme();
    const [symbol, setSymbol] = useState("");
    const [person, setPerson] = useState("");
    const [selectedPerson, setSelectedPerson] = useState<Person>();
    const [posts, setPosts] = useState<Post[]>([]);
    const [timeFrame, setTimeFrame] = useState(timeFrames[0]); // 5-minute as defdault

    useEffect(() => {
        setPosts(dummyPosts);
        setSelectedPerson(dummyPeople.find((p) => p.username == person));
    }, [person]);

    return (
        <AppSidebar activepage="Charts" includeHeader={false}>
            <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 z-10">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                </div>
                <div className="flex gap-4">
                    <SearchSelector
                        options={dummyPeople.map((p) => p.username)}
                        category={"Person"}
                        value={person}
                        setValue={setPerson}
                        imageFolder={"none"}
                    />
                    <SearchSelector
                        options={defaultSymbols}
                        category={"Symbol"}
                        value={symbol}
                        setValue={setSymbol}
                        imageFolder={"logos"}
                    />
                </div>
                <div className="flex gap-1">
                    {timeFrames.map((tf) => (
                        <Button
                            suppressHydrationWarning
                            key={tf.name}
                            className={clsx("w-8 h-8", {
                                "bg-black text-white hover:bg-black":
                                    theme == "dark" &&
                                    tf.name == timeFrame.name,
                                "bg-white text-black hover:bg-white":
                                    theme == "light" &&
                                    tf.name == timeFrame.name,
                            })}
                            onClick={() => {
                                setTimeFrame(tf);
                            }}
                        >
                            {tf.name}
                        </Button>
                    ))}
                </div>
                <div className="ml-auto m-4">
                    <ThemeSwitch />
                </div>
            </header>
            <section>
                {symbol ? (
                    <div
                        className={`w-screen h-full absolute bottom-0 right-0`}
                    >
                        <StockChart
                            symbol={symbol}
                            multiplier={timeFrame.multiplier}
                            timeSpan={timeFrame.time}
                        />
                    </div>
                ) : (
                    <div className="flex-col justify-center ml-16 mt-4 mb-6">
                        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                            Charts
                        </h1>
                        <p className="text-xl text-muted-foreground mt-1">
                            Select from options to get started.
                        </p>
                    </div>
                )}
            </section>
            <section>
                {person &&
                    posts.map((post, idx) => {
                        if (selectedPerson)
                            return (
                                <PostCard
                                    key={idx}
                                    posts={post}
                                    person={selectedPerson}
                                />
                            );
                    })}
            </section>
        </AppSidebar>
    );
}
