import { AppSidebar } from "@/components/sidebar/app-sidebar";
import StockChart from "@/components/stock-chart";

export default function Charts() {
    return (
        <AppSidebar activepage="Charts">
            <StockChart />
        </AppSidebar>
    );
}
