import { SymbolData } from "@/lib/stock-data/finnhub";
import { BarData, Timespan } from "@/lib/stock-data/polygon";
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from "swr";

const axiosGet = (url: string) => axios.get(url).then((res) => res.data);

interface Candle {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
}

interface Volume {
    time: string;
    value: number;
}

export function useOHCL(
    symbol: string,
    multiplier: number,
    timespan: Timespan
) {
    const { data, error, isLoading } = useSWR<BarData>(
        `/api/stock/ohcl?symbol=${symbol}&multiplier=${multiplier}&timespan=${timespan}`,
        axiosGet
    );

    // Convert data to type that the lightweight chart library can use
    const volumeData: Volume[] = [];
    const candleData: Candle[] = [];
    data?.results.forEach((item) => {
        const date = new Date(item.t);
        const dateString = date.toISOString().slice(0, 10); // yyyy-mm-dd
        volumeData.push({ time: dateString, value: item.v });
        candleData.push({
            time: dateString,
            open: item.o,
            high: item.h,
            low: item.l,
            close: item.c,
        });
    });

    return {
        volumeData: volumeData,
        candleData: candleData,
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
