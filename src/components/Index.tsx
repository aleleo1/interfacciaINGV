import { DataProvider } from "./context";
import { Container } from "./ChartContainer";

export default function Index() {

    return (
        <div>

            <DataProvider>
                <Container type="BAR" />
                {/* <ChartContainer type="PIE" /> */}
            </DataProvider>

        </div >
    )
}