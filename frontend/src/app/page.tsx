import QuoteChart from "@/components/quote-chart";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

export default async function Page() {
    return (
        <>
            <AppSidebar activepage="Dashboard">
                <QuoteChart />
            </AppSidebar>
        </>
    );
}
