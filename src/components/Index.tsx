import { DataProvider } from "./context/data.context";
import { Container } from "./ChartContainer";

export default function Index() {

    return (
        <DataProvider>
            <Container type="BAR" />
            {/* <ChartContainer type="PIE" /> */}
        </DataProvider>
    )
}