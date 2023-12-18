import { createSignal, createEffect, For, on, Show, createResource, onMount } from 'solid-js';
import * as d3 from 'd3';
import { createStore } from 'solid-js/store';
import type { BarChartProps as ChartProps } from '../context/context.types';
import { BasicSpinner } from '../components.utils';


export default function BarChart<T extends Record<string, any>>(p: ChartProps<T>) {
    const [svgRef, setSvgRef] = createSignal(null)
    
    let x = d3.scaleLinear()
        .rangeRound([0, p.width]);

    let y = d3.scaleLinear()
        .rangeRound([p.height, 0]);
    let xAxis = d3.axisBottom(x),
        yAxis = d3.axisLeft(y);

    onMount(()=>{
        d3.select(svgRef())
    })

    return (
        <svg ref={svg} viewBox={`0 0 ${p.width} ${p.height}`}>
            <For each={[xAxis, yAxis]}>
                {(axis) =>
                    <g class="axis" transform={axis === xAxis ? `translate(0,${p.height})` : ''}>
                        {axis.map((d, i) =>
                            <line x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} stroke="black" />
                        )}
                    </g>
                }
            </For>
        </svg>
    );
}
