import axios from "axios";
import { z } from "zod";

// Note: Polygon's free plan allows up to 5 api calls / minute :// (idea: Create a bunch of free tier accounts and rotate keys every 5 calls)

const api_key = process.env.POLYGON_API_KEY;
if (!api_key) {
    throw new Error(
        "POLYGON_API_KEY is not found in the environment variables."
    );
}

const polygon = axios.create({
    baseURL: "https://api.polygon.io/v2/aggs",
    params: {
        apikey: api_key,
    },
});

export const timespans = [
    "second",
    "minute",
    "hour",
    "day",
    "week",
    "month",
] as const;

export type Timespan = (typeof timespans)[number];

const BarSchema = z.object({
    results: z.array(
        z.object({
            v: z.number(), // volume
            vw: z.number(), // volume weighted avr. price
            o: z.number(), // opening price
            c: z.number(), // closing price
            h: z.number(), // highest price
            l: z.number(), // lowest price
            t: z.number(), // starting time Unix
            n: z.number(), // number of transactions
        })
    ),
    count: z.number(), // amount of bar objects
});

export type BarData = z.infer<typeof BarSchema>;

/**
 * Fetches historical Open/High/Low/Close (OHLC) data for a given stock symbol
 * from the Polygon.io API.
 *
 * @param {string} symbol - The stock ticker symbol to fetch data for (e.g., "AAPL", "MSFT").
 * @param {number} multiplier - The size of the time window multiplier (e.g., 1, 5).
 * @param {Timespan} timespan - The type of time window ('second', 'minute', 'hour', 'day', 'week', 'month').
 * Used in combination with the multiplier (e.g., 1 day, 5 minute).
 * @returns {Promise<BarData>} A promise that resolves with the validated OHLC data
 * for the specified symbol over the past year.
 * @throws {Error} Throws an error if the data received from the Polygon API fails
 * validation against BarSchema (message: "Invalid data structure...").
 * @throws {Error} Throws an error if the Axios request to the Polygon API fails
 * (e.g., network error, 4xx/5xx status codes) (message: "Axios error...").
 * @throws {Error} Throws an error for any other unexpected issues during execution
 * (message: "Failed to fetch OHLC...").
 */
export async function getOHLC(
    symbol: string,
    multiplier: number,
    timespan: Timespan
): Promise<BarData> {
    // Return a year of data
    const now = new Date();
    const toDate = now.toISOString().slice(0, 10); // formats current date to yyyy-mm-dd
    now.setFullYear(now.getFullYear() - 1);
    const fromDate = now.toISOString().slice(0, 10); // formats date a year back

    try {
        const response = await polygon.get(
            `/ticker/${symbol}/range/${multiplier}/${timespan}/${fromDate}/${toDate}`,
            { params: { sort: "asc" } }
        );
        const validatedData = BarSchema.parse(response.data);
        return validatedData;
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw new Error(
                `Invalid data structure received from Polygon API for OHLC.`
            );
        } else if (axios.isAxiosError(error)) {
            throw new Error("Axios error fetching OHCL: " + error.message);
        } else {
            throw new Error(`Failed to fetch OHLC: ${error.message}`);
        }
    }
}
