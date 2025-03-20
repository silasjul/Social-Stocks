"use client";

import { useEffect, useState } from "react";

export interface Data {
    p: number;
    s: string;
    t: number;
    v: number;
}

export default function Home() {
    const [data, setData] = useState<Data[]>([]);

    useEffect(() => {
        const getData = async () => {
            let tsla: Data[];

            const socket = new WebSocket(
                "wss://ws.finnhub.io?token=cve3031r01qujfbq6q30cve3031r01qujfbq6q3g"
            );

            // Connection opened -> Subscribe
            socket.addEventListener("open", function (event) {
                socket.send(
                    JSON.stringify({ type: "subscribe", symbol: "TSLA" })
                );
            });

            // Listen for messages
            socket.addEventListener("message", (event) => {
                tsla = JSON.parse(event.data).data;
                if (tsla) setData((prevData) => [...prevData, ...tsla]);
            });
        };

        getData();
    }, []);

    return (
        <div>
            {data.map((el, idx) => (
                <div key={idx}>
                    <p>Symbol: {el.s}</p>
                    <p>Price: {el.p}</p>
                    <p>Time: {Math.floor(el.t/1000/60)}</p>
                    <p>Volume: {el.v}</p>
                </div>
            ))}
        </div>
    );
}
