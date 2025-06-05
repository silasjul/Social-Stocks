"use client";

import { AppSidebar } from "@/components/app-sidebar";
import PostCard from "@/components/post-card";
import { SearchSelector } from "@/components/search-selector";
import StockChart from "@/components/stock-chart";
import { ThemeSwitch } from "@/components/theme-switch";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { defaultSymbols, timeFrames } from "@/lib/configs";
import { Person, Post } from "@/lib/interfaces";
import TimeFrameButton from "@/components/timeframe-btn";
import { usePeople } from "@/hooks/use-people";
import { usePosts } from "@/hooks/use-posts";
import { LucideMinus, LucidePlus} from "lucide-react";
import PostAmountBtn from "@/components/ui/postAmountBtn";


function postsByPerson(person: Person, posts: Post[]) {
    return posts.filter((post) => person.id == post.personId);
}

export default function Charts() {
    const [symbol, setSymbol] = useState("");
    const [person, setPerson] = useState("");
    const [selectedPerson, setSelectedPerson] = useState<Person>();
    const [hoveredPost, setHoveredPost] = useState<Post>();
    const [timeFrame, setTimeFrame] = useState(timeFrames[0]);
    const { people } = usePeople();
    const { posts, fetchPosts } = usePosts();
    const [amountOfPosts, setAmountOfPosts] = useState(1);

    useEffect(() => {
        setSelectedPerson(people.find((p) => p.username.slice(1) == person));
        fetchPosts();
    }, [person]);

    const incrementBtn = () => {
        setAmountOfPosts((p) => p + 1);
    };

    const decrementBtn = () => {
        setAmountOfPosts((p) => Math.max(1,p - 1));
    };


    return (
        <AppSidebar activepage="Charts" includeHeader={false}>
            <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 z-20">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                </div>
                <div className="flex gap-4">
                    <SearchSelector
                        options={people.map((p) => ({
                            value: p.username.slice(1),
                            img: p.imgUrl,
                        }))}
                        category={"Person"}
                        state={person}
                        setState={setPerson}
                    />
                    <SearchSelector
                        options={defaultSymbols.map((s) => ({
                            value: s,
                            img: `/logos/${s}.svg`,
                        }))}
                        category={"Symbol"}
                        state={symbol}
                        setState={setSymbol}
                    />
                </div>
                <div className="flex gap-1">
                    {timeFrames.map((tf) => (
                        <TimeFrameButton
                            key={tf.name}
                            tf={tf}
                            onClick={() => setTimeFrame(tf)}
                            selectedTf={timeFrame.name}
                        />
                    ))}
                </div>

                                <div className="flex items-center gap-2">
                    <span className="mr-2">Posts To Show</span>
                    <PostAmountBtn onClick={decrementBtn}>
                        <LucideMinus size={20} />
                    </PostAmountBtn>
                    <span className="w-6 text-center">{ amountOfPosts }</span>
                     <PostAmountBtn onClick={incrementBtn}>
                        <LucidePlus size={20} />
                    </PostAmountBtn>
                </div>


                <div className="ml-auto m-4">
                    <ThemeSwitch />
                </div>
            </header>
            <div className="mx-16">
                <section>
                    {symbol ? (
                        <div
                            className={`w-screen h-full absolute bottom-0 right-0`}
                        >
                            <StockChart
                                symbol={symbol}
                                multiplier={timeFrame.multiplier}
                                timeSpan={timeFrame.time}
                                post={hoveredPost}
                            />
                        </div>
                    ) : (
                        <div className="flex-col my-6">
                            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                                Charts
                            </h1>
                            <p className="text-xl text-muted-foreground mt-1">
                                Select a symbol to get started.
                            </p>
                        </div>
                    )}
                </section>
                <section className="absolute flex flex-col gap-4 z-10 mr-16 pb-4">
                    {selectedPerson &&
                        (symbol
                            ? postsByPerson(selectedPerson, posts).slice(0, amountOfPosts)
                            : postsByPerson(selectedPerson, posts)
                        ).map((post, idx) => (
                            <PostCard
                                key={idx}
                                post={post}
                                person={selectedPerson}
                                onHover={setHoveredPost}
                            />
                        ))}
                </section>
            </div>
        </AppSidebar>
    );
}
