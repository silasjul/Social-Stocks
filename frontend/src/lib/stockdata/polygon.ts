import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/*
Polygon's free plan allows up to 5 api calls / minute :// (idea: Create a bunch of free tier accounts and rotate keys every 5 calls)

Use to get historic data
*/

const api_key = process.env.POLYGON_API_KEY;
if (!api_key) {
    throw new Error(
        "POLYGON_API_KEY is not defined in the environment variables."
    );
}

const polygon = axios.create({
    baseURL: "https://api.polygon.io/v2/aggs",
    params: {
        apikey: api_key,
    },
});

type Timespan = "second" | "minute" | "hour" | "day" | "week" | "month";

interface BarData {
    results: {
        v: number; // volume
        vw: number; // volume weighted avr. price
        o: number; // opening price
        c: number; // closing price
        h: number; // highest price
        l: number; // lowest price
        t: number; // starting time Unix
        n: number; // number of transactions
    }[];
    count: number; // amount of bars
}

async function getOHLC(
    symbol: string,
    multiplier: number,
    timespan: Timespan
): Promise<BarData | null> {
    // Getting a year of data
    const now = new Date();
    const toDate = now.toISOString().slice(0, 10);
    now.setFullYear(now.getFullYear() - 1);
    const fromDate = now.toISOString().slice(0, 10);

    // Send request
    let result = null;
    try {
        const response = await polygon.get(
            `/ticker/${symbol}/range/${multiplier}/${timespan}/${fromDate}/${toDate}`,
            { params: { sort: "asc" } }
        );
        result = response.data;
    } catch (error) {
        console.error("Error fetching OHLC: ", error);
    }
    return result;
}

async function getMonthly(symbol: string) {
    return await getOHLC(symbol, 1, "month");
}

async function getDaily(symbol: string) {
    return await getOHLC(symbol, 1, "day");
}

async function getHourly(symbol: string) {
    return await getOHLC(symbol, 1, "hour");
}

async function getMinutes(symbol: string, minutes: number) {
    return await getOHLC(symbol, minutes, "minute");
}
