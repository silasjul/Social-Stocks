import axios from "axios";
import useSWR from "swr";
import { UTCTimestamp } from "lightweight-charts";
import { BarData } from "@/lib/stock-data/polygon";

const axiosGet = (url: string) => axios.get(url).then((res) => res.data);

export interface Candle {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Volume {
  time: UTCTimestamp;
  value: number;
}

interface UseOHLCRangeResult {
  volumeData: Volume[];
  candleData: Candle[];
  isLoading: boolean;
  isError: any;
}

/**
 * Henter OHLC (candlestick + volume) for et præcist interval [fromSec, toSec].
 * 
 * @param symbol    Aktiesymbol (f.eks. "AAPL")
 * @param multiplier  Interval‐multiplier (f.eks. 1, 5, 15 osv.)
 * @param fromSec   Unix‐tid i sekunder (f.eks. 1749059323)
 * @param toSec     Unix‐tid i sekunder (f.eks. 1749062923)
 */
export function useOHLCRange(
  symbol: string,
  multiplier: number,
  fromSec: number,
  toSec: number
): UseOHLCRangeResult {
  // Omdan parametrene til query string
  const endpoint = `/api/stock/ohlc?symbol=${encodeURIComponent(symbol)}&multiplier=${multiplier}&from=${fromSec}&to=${toSec}`;

  // Brug SWR til at hente data fra ovenstående endpoint
  const { data, error, isLoading } = useSWR<BarData>(endpoint, axiosGet);

  const volumeData: Volume[] = [];
  const candleData: Candle[] = [];

  if (data?.results) {
    data.results.forEach((item) => {
      // Polygon API returnerer item.t i millisekunder, så vi omregner til sekunder ved at / 1000
      // (BarData.item.t er normalt i millisekunder fra Polygon)
      const tsSec = Math.floor(item.t / 1000) as UTCTimestamp;

      volumeData.push({
        time: tsSec,
        value: item.v,
      });
      candleData.push({
        time: tsSec,
        open: item.o,
        high: item.h,
        low: item.l,
        close: item.c,
      });
    });
  }

  return {
    volumeData,
    candleData,
    isLoading,
    isError: error,
  };
}
