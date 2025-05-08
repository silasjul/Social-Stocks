"use client";

import { AppSidebar } from "@/components/app-sidebar";
import StockChart from "@/components/stock-chart";

export default function Charts() {
    return (
        <AppSidebar activepage="Charts">
            <div className="w-full h-full">
                <StockChart symbol={"TSLA"} multiplier={1} timeSpan={"day"} /> 
            </div>
        </AppSidebar>
    );
}
