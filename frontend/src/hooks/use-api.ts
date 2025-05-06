import { SymbolData } from "@/lib/stock-data/finnhub";
import { BarData, Timespan } from "@/lib/stock-data/polygon";
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from "swr";

const axiosGet = (url: string) => axios.get(url).then((res) => res.data);

// --- 
export function useOHCL(
    symbol: string,
    multiplier: number,
    timespan: Timespan
) {
    const { data, error, isLoading } = useSWR(
        `/api/stock/ohcl?symbol=${symbol}&multiplier=${multiplier}&timespan=${timespan}f`,
        axiosGet
    );

    return {
        data: data as BarData,
        isLoading,
        isError: error,
    };
}

export function useSymbols() {
    const { data, error, isLoading } = useSWR(`/api/stock/symbols`, axiosGet);

    return {
        data: data as SymbolData,
        isLoading,
        isError: error,
    };
}

interface Data {
    p: number;
    s: string;
    t: number;
    v: number;
}
export function useTrades(symbol: string) {
    const [data, setData] = useState<Data[]>([]);

    useEffect(() => {
        setData([]);

        const socket = new WebSocket(
            "wss://ws.finnhub.io?token=cve2j0hr01qujfbq48p0cve2j0hr01qujfbq48pg"
        );

        // Connection opened -> Subscribe
        socket.addEventListener("open", () => {
            socket.send(JSON.stringify({ type: "subscribe", symbol: symbol }));
        });

        // Listen for messages
        socket.addEventListener("message", (event) => {
            console.log(event.data);
        });

        return () => {
            socket.close();
        };
    }, [symbol]);

    return data;
}
