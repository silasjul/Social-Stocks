"use client";

import { useTrades } from "@/hooks/use-api";

export default function StockChart() {
    const data = useTrades("TSLA");

    return <div>{data[0]?.p}</div>;
}
