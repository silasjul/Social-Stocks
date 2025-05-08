"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SearchSelector } from "@/components/search-selector";
import StockChart from "@/components/stock-chart";
import { ThemeSwitch } from "@/components/theme-switch";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
];

export default function Charts() {
    const { theme } = useTheme();
    const [symbol, setSymbol] = useState("");
    const [person, setPerson] = useState("");

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
                <div className="ml-auto m-4">
                    <ThemeSwitch />
                </div>
            </header>
            <div className="">
                {symbol && (
                    <div
                        className={`w-screen h-full absolute bottom-0 right-0`}
                    >
                        <StockChart
                            symbol={symbol}
                            multiplier={5}
                            timeSpan={"minute"}
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
            </div>
        </AppSidebar>
    );
}
