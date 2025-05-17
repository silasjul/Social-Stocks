"use client";

import { AppSidebar } from "@/components/app-sidebar";
import PostCard from "@/components/post-card";
import QuoteCard from "@/components/quote-card";
import StockChart from "@/components/stock-chart";
import { usePosts } from "@/contexts/post-context";
import { useFAANG } from "@/hooks/use-api";
import { dummyPeople } from "@/lib/dummy-data";
import { Post } from "@/lib/interfaces";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
    const [symbol, setSymbol] = useState("");
    const faangData = useFAANG(120); // arg: Seconds between each fetch
    const { filteredPosts } = usePosts();

    const recentTweets = (posts: Post[]) => {
        const personTweets = posts.filter((p) => {
            return p.username == dummyPeople[1].username;
        });
        return personTweets.splice(0, 2);
    };

    return (
        <>
            <AppSidebar activepage="Dashboard">
                <div className="flex-col mx-16 my-6">
                    <header>
                        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                            Overview
                        </h1>
                        <p className="text-xl text-muted-foreground mt-1">
                            Stay informed with recent market data and expert
                            social commentary.
                        </p>
                    </header>
                    <section className="mt-8 flex gap-8">
                        <div className="flex flex-col">
                            <div>
                                <h3 className="mb-2 scroll-m-20 text-xl font-semibold tracking-tight">
                                    Recent tweets
                                </h3>
                                <div className="flex flex-col gap-4 mb-4">
                                    {recentTweets(filteredPosts).map(
                                        (p, idx) => (
                                            <PostCard
                                                key={idx}
                                                post={p}
                                                person={dummyPeople[1]}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col flex-grow mt-1">
                                <div className="flex gap-2 items-center">
                                    <h3 className="mb-2 scroll-m-20 text-xl font-semibold tracking-tight">
                                        Chart
                                    </h3>
                                    <div>
                                        {faangData.map((f) => (
                                            <button
                                                key={f.symbol}
                                                className="ml-2"
                                                onClick={() =>
                                                    setSymbol(f.symbol)
                                                }
                                            >
                                                <Image
                                                    className={`rounded-full duration-200 active:scale-125 hover:scale-110 ${
                                                        f.symbol == symbol &&
                                                        "border border-blue-500"
                                                    }`}
                                                    width={26}
                                                    height={26}
                                                    src={`/logos/${f.symbol}.svg`}
                                                    alt={"logo"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="border rounded-lg flex-grow flex justify-center items-center">
                                    {symbol ? (
                                        <StockChart
                                            symbol={symbol}
                                            multiplier={1}
                                            timeSpan={"day"}
                                            resize={false}
                                        />
                                    ) : (
                                        <p className="opacity-80">
                                            Select stock
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-2 scroll-m-20 text-xl font-semibold tracking-tight">
                                Market data
                            </h3>
                            <div className="flex flex-col gap-4">
                                {faangData.map((q) => (
                                    <QuoteCard key={q.symbol} quote={q} />
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </AppSidebar>
        </>
    );
}
