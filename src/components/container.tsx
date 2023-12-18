import type { ContainerProps } from "./context/context.types";
import ChartContainer from "./ChartContainer";
import { Image } from 'astro:assets';
import myImage from '../assets/test.jpg'

export default function Container<T extends Record<string, any>>(p: ContainerProps<T>) {
    return <><ChartContainer type={p.chartType} /></>
}