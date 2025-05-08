"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SearchSelector } from "@/components/search-selector";
import StockChart from "@/components/stock-chart";
import { ThemeSwitch } from "@/components/theme-switch";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSymbols } from "@/hooks/use-api";
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
    const { data, isLoading, isError } = useSymbols();
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
            <div className="w-full h-full">
                <StockChart
                    symbol={symbol}
                    multiplier={5}
                    timeSpan={"minute"}
                />
            </div>
        </AppSidebar>
    );
}
