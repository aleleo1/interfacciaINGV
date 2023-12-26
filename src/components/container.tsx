import type { ContainerProps } from "./context/context.types";
import ChartContainer from "./ChartContainer";
import { DataProviderV2 as DataProvider } from "./context/data.context.v2";

export default function Container<T extends Record<string, any>>(p: ContainerProps<T>) {
    return (
        <DataProvider  src={p.src}><ChartContainer type={p.chartType} circle={p.circle} oblique={p.oblique} nolines={p.nolines}/></DataProvider>)
}