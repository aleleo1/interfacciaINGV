import { createSignal, createEffect, For, on, Show, createResource } from 'solid-js';
import * as d3 from 'd3';
import { createStore } from 'solid-js/store';
import type { BarChartProps as ChartProps } from '../context/context.types';
import { BasicSpinner } from '../components.utils';
type D3Data = { x: number; y: number; width: number; height: number; color: any; id: number }
type MockedData = Partial<D3Data & { postId: number; comments: number }>
const DELTA_HY = 20

export default function BarChart<T extends Record<string, any>>(p: ChartProps<T>) {
    const
        width = 640,
        height = 400,
        marginTop = 20,
        marginRight = 20,
        marginBottom = 20,
        marginLeft = 20
    const x = d3.scaleLinear([0, p.data.length - 1], [marginLeft, width - marginRight]);
    const y = d3.scaleLinear(d3.extent(p.data), [height - marginBottom, marginTop]);
    const line = d3.line((d, i) => x(i), y);

    return (
        <div class='w-fit'>
            <svg width={width} height={height}>
                <path fill="none" stroke="currentColor" stroke-width="1.5" d={line(p.data)} />
                <g fill="white" stroke="currentColor" stroke-width="1.5">
                    {p.data.map((d, i) => (<circle key={i} cx={x(i)} cy={y(d)} r="2.5" />))}
                </g>
            </svg>


        </div>
    );
}
