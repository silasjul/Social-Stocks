"use client";

import { AppSidebar } from "@/components/app-sidebar";
import StockChart from "@/components/stock-chart";

export default function Charts() {
    return (
        <AppSidebar activepage="Charts">
            <StockChart symbol={"TSLA"} multiplier={1} timeSpan={"day"} />
        </AppSidebar>
    );
}
