import { DataProviderV2 } from "./context/data.context.v2";
import { DataProvider } from "./context/data.context";
import ChartContainer from "./ChartContainer";
import Container from './container'
import Test from "./charts/TestForNanostores";
export default function Index() {

    return (
        <DataProvider>
            <DataProviderV2>
                <Test />
                <Container chartType="BAR" />
                {/* <Container type="PIE" /> */}
                {/* <Container type="LINE" /> */}
            </DataProviderV2>
        </DataProvider>
    )
}