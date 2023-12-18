import { DataProvider } from "./context/data.context";
import { Container } from "./ChartContainer";

export default function Index() {

    return (
        <DataProvider>
            <Container type="BAR" />
            {/* <Container type="PIE" /> */}
            {/* <Container type="LINE" /> */}
        </DataProvider>
    )
}