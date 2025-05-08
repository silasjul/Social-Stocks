"use client";

import { useOHCL } from "@/hooks/use-api";
import { Timespan } from "@/lib/stock-data/polygon";
import {
    CandlestickSeries,
    createChart,
    ColorType,
    HistogramSeries,
    CrosshairMode,
    createSeriesMarkers,
    SeriesMarkerShape,
    SeriesMarkerBarPosition,
} from "lightweight-charts";
import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";

interface StockChartProps {
    symbol: string;
    multiplier: number;
    timeSpan: Timespan;
}

export default function StockChart({
    symbol,
    multiplier,
    timeSpan,
}: StockChartProps) {
    const { volumeData, candleData, isLoading, isError } = useOHCL(
        symbol,
        multiplier,
        timeSpan
    );
    const { theme } = useTheme();
    const isDark = () => theme == "dark";
    const [lockScale, setLockScale] = useState(true);

    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleResize = () => {
            chart.applyOptions({
                width: ref.current?.clientWidth,
                height: ref.current?.clientHeight,
            });
        };
        if (!ref.current) return;

        // --- Settign up the chart
        const chart = createChart(ref.current, {
            width: ref.current.clientWidth,
            height: ref.current.clientHeight,
            layout: {
                textColor: isDark() ? "#DDD" : "black",
                background: {
                    type: ColorType.Solid,
                    color: isDark() ? "#0a0a0a" : "white",
                },
                attributionLogo: false,
            },
            rightPriceScale: {
                borderVisible: false,
            },
            grid: isDark()
                ? {
                      vertLines: { color: "#444" },
                      horzLines: { color: "#444" },
                  }
                : undefined,
            crosshair: {
                // Allows the crosshair to move freely without snapping to datapoints
                mode: CrosshairMode.Normal,

                vertLine: isDark()
                    ? {
                          color: "#9B7DFF",
                          labelBackgroundColor: "#9B7DFF",
                      }
                    : undefined,
                horzLine: isDark()
                    ? {
                          color: "#9B7DFF",
                          labelBackgroundColor: "#9B7DFF",
                      }
                    : undefined,
            },
        });
        chart.timeScale().fitContent();

        // --- Candle chart
        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: "#26a69a",
            downColor: "#ef5350",
            borderVisible: false,
            wickUpColor: "#26a69a",
            wickDownColor: "#ef5350",
        });
        candleSeries.priceScale().applyOptions({
            autoScale: lockScale,
        });

        isDark() &&
            candleSeries.applyOptions({
                wickUpColor: "rgb(54, 116, 217)",
                upColor: "rgb(54, 116, 217)",
                wickDownColor: "rgb(225, 50, 85)",
                downColor: "rgb(225, 50, 85)",
                borderVisible: false,
            });

        // --- Volume chart
        const volumeSeries = chart.addSeries(HistogramSeries, {
            color: "#26a69a",
            priceFormat: {
                type: "volume",
            },
            priceScaleId: "", // set as an overlay by setting a blank priceScaleId
        });
        volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.9, // highest point of the series will be 90% away from the top
                bottom: 0,
            },
        });

        // --- Markers
        const markers = [
            {
                time: { year: 2025, month: 3, day: 25 },
                position: "aboveBar" as SeriesMarkerBarPosition,
                color: "black",
                shape: "arrowDown" as SeriesMarkerShape,
                text: "Trump said some stupid shit here.",
                price: 0,
            },
        ];
        createSeriesMarkers(candleSeries, markers);

        // --- Setting data from api
        candleSeries.setData(candleData);
        volumeSeries.setData(volumeData);

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);

            chart.remove();
        };
    }, [candleData, volumeData, theme]);

    if (isLoading) return <div>Loading...</div>;

    if (isError) return <div>Error loading data.</div>;

    return <div className="w-full h-full cursor-crosshair" ref={ref} />;
}
