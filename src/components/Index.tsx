import { DataProvider } from "./data.context";
import { Container } from "./ChartContainer";

export default function Index() {

    return (
        <DataProvider>
            <Container type="BAR" />
            <Container type="PIE" />
            {/* <ChartContainer type="PIE" /> */}
        </DataProvider>
    )
}