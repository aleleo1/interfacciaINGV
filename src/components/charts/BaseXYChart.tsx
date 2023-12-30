import { createSignal, createEffect, Show, on } from 'solid-js';
import * as d3 from 'd3';
import type { BarChartProps as ChartProps } from '../context/context.types';

export default function BaseChart<T extends Record<string, any>>(p: ChartProps<T>) {

    const [gx, setgx] = createSignal<any>(null),
        [gy, setgy] = createSignal<any>(null)

    const svg = (): any => (<svg
        viewBox={`-20 -10 ${p.width + 20} ${p.height + 40}`}
        width={p.width}
        height={p.height}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
    >{gx()}{gy()}{p.children}</svg>)



    const xAxis = () => d3.axisBottom(p.x).ticks(d3.timeMonth.every(0.3), d3.timeYear.every(0.5)).tickFormat(d3.timeFormat("%d %m %y"))
    createEffect(() => {
        setgx(<g
            transform={`translate(0,${p.height - p.mb})`}
            fill="none"
            font-size="10"
            font-family="sans-serif"
            text-anchor="middle">
        </g>)
        d3.select(gx()).call(xAxis()).selectAll('text').attr('transform', 'translate(-42)rotate(-45)').attr('y', 40)
    })


    const yAxis = () => (p.ylabels && Object.keys(p.ylabels).length > 0) ? d3.axisLeft(p.y).tickFormat(d => p.ylabels[d] ?? '') : d3.axisLeft(p.y)
    createEffect(() => {
        setgy(<g
            fill="none"
            font-size="10"
            font-family="sans-serif"
            text-anchor="end"
            transform={`translate(${p.ml},0)`}
        />)
        d3.select(gy()).call(yAxis())
    })

    return svg();
}
