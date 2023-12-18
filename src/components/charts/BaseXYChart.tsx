import { createSignal, createEffect, For, on, Show, createResource } from 'solid-js';
import * as d3 from 'd3';
import { createStore } from 'solid-js/store';
import type { BarChartProps as ChartProps } from '../context/context.types';

type D3Data = { x: number; y: number; width: number; height: number; color: any; id: number }

export default function BaseChart<T extends Record<string, any>>(p: ChartProps<T>) {



    const [svg, setSvg] = createSignal<SVGSVGElement | null>(null);
    const [gx, setGx] = createSignal<SVGGElement | null>(null)
    const [gy, setGy] = createSignal<SVGGElement | null>(null)

    const xAxis = () => d3.axisBottom(p.x)
    const yAxis = () => d3.axisLeft(p.y)

    createEffect(() => { d3.select(gx()).call(xAxis()); d3.select(gy()).call(yAxis()) })

    return (
        <div class='w-fit'>

            <svg ref={setSvg}
                viewBox={`-20 -10 ${p.width + 20} ${p.height + 40}`}
                width={p.width}
                height={p.height}
                preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                <g ref={setGx} transform={`translate(0,${p.height - p.mb})`} fill="none" font-size="10" font-family="sans-serif" text-anchor="middle">
                </g>
                <g ref={setGy} fill="none" font-size="10" font-family="sans-serif" text-anchor="end" transform={`translate(${p.ml},0)`}>
                </g>
                {p.children}
            </svg>




        </div >
    );
}
