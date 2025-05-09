"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SearchSelector } from "@/components/search-selector";
import StockChart from "@/components/stock-chart";
import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Timespan } from "@/lib/stock-data/polygon";
import { useTheme } from "next-themes";
import { useState } from "react";

const defaultSymbols = [
    "AAPL",
    "TSLA",
    "NFLX",
    "NVDA",
    "AMZN",
    "META",
    "AMD",
    "MSFT",
    "GOOGL",
    "TEST",
];

interface TimeFrame {
    name: string;
    time: Timespan;
    multiplier: number;
}

const timeFrames: TimeFrame[] = [
    {
        name: "5",
        time: "minute",
        multiplier: 5,
    },
    {
        name: "10",
        time: "minute",
        multiplier: 10,
    },
    {
        name: "15",
        time: "minute",
        multiplier: 15,
    },
    {
        name: "1H",
        time: "hour",
        multiplier: 1,
    },
    {
        name: "4H",
        time: "hour",
        multiplier: 4,
    },
    {
        name: "D",
        time: "day",
        multiplier: 1,
    },
    {
        name: "W",
        time: "week",
        multiplier: 1,
    },
    {
        name: "M",
        time: "month",
        multiplier: 1,
    },
];

export default function Charts() {
    const { theme } = useTheme();
    const [symbol, setSymbol] = useState("");
    const [person, setPerson] = useState("");
    const [timeFrame, setTimeFrame] = useState(timeFrames[0]); // 5-minute as defdault

    return (
        <AppSidebar activepage="Charts" includeHeader={false}>
            <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 z-10">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                </div>
                <div className="flex gap-4">
                    <SearchSelector
                        options={[]}
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
                            className={`w-8 h-8 ${
                                tf.name == timeFrame.name &&
                                "bg-white text-black"
                            }`}
                            key={tf.name}
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
            {symbol && (
                <div className={`w-screen h-full absolute bottom-0 right-0`}>
                    <StockChart
                        symbol={symbol}
                        multiplier={timeFrame.multiplier}
                        timeSpan={timeFrame.time}
                    />
                </div>
            )}
            {!symbol && !person && (
                <div className="flex-col justify-center ml-16 mt-4">
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                        Charts
                    </h1>
                    <p className="text-xl text-muted-foreground mt-1">
                        Select from options to get started.
                    </p>
                </div>
            )}
        </AppSidebar>
    );
}
