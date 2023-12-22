import { createSignal, createEffect, For, Show } from 'solid-js';
import BaseChart from './BaseXYChart'
import * as d3 from 'd3';
import { createStore } from 'solid-js/store';
import type { BarChartProps as ChartProps } from '../context/context.types';
import { useData } from '../context/data.context.v2';
import * as C from '../constants'
import { BasicSpinner, BasicError } from '../components.utils';

type D3Data = { x: number; y: number; width: number; height: number; color: any; id: number }
type MockedData = Partial<D3Data & { x: number; y: number }>

export default function BarChart<T extends Record<string, any>>(p: ChartProps<T>) {
    const [bars, setBars] = createStore<MockedData[]>([]);
    const { data } = useData()!.stores
    const { loaded, error } = useData()!.signals
    
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;
    const margins = { mt: marginTop, mb: marginBottom, ml: marginLeft, mr: marginRight }
    const x = () => (d3.scaleLinear([0, data.length * 1.2], [marginLeft, p.width - marginRight]));
    const y = () => (d3.scaleLinear().range([p.height - marginBottom, 0]).domain([0, d3.max(data, d => d.y) * 1.2]))
    const xScale = () => (d3.scaleBand().range([marginLeft, p.width - marginRight]).padding(0.8).domain(data.map(d => d.x)))
    const barWidth = () => (xScale().bandwidth())



    /* const [svgResource, {mutate, refetch}] = createResource(renderSVG) */
    const [hovered, setHovered] = createSignal<any | null>(null)
    const handleMouseOver = (d: MockedData) => {
        setHovered(d)
        //setBars((bar)=> bar.id === d.id, {height: d.height + DELTA_HY, y: d.y - DELTA_HY});

    }
    const handleMouseOut = (d: MockedData) => {
        setHovered(null)
        //setBars((bar)=> bar.id === d.id, {height: d.height - DELTA_HY, y: d.y + DELTA_HY});
    }

    createEffect(() => {
        console.log('****LOADING SVG RESOURCE')
        if (data.length > 0) {
            const colorGenerator = d3
                .scaleSequential(d3.interpolateWarm)
                .domain([0, data.length])
            setBars(
                data.map((d, i) => ({
                    x: x()(d.x) - Math.floor(barWidth() / 2),
                    y: y()(d.y),
                    width: barWidth(),
                    height: p.height - y()(d.y) - marginBottom,
                    xlabel: d.x,
                    ylabel: d.y,
                    color: colorGenerator(i),
                    id: i
                }))
            );
        }
    })


    return (
        <div>
            
                    <BaseChart {...Object.assign({}, p, margins, { x: x(), y: y() })} >

                        <For each={bars}>
                            {bar => (
                                <rect
                                    x={bar.x}
                                    y={bar.y}
                                    width={bar.width}
                                    height={bar.height}
                                    fill={bar.color}
                                    onMouseOver={() => handleMouseOver(bar)}
                                    onMouseOut={() => handleMouseOut(bar)}
                                />
                            )}
                        </For>

                    </BaseChart>
               
            <Show
                when={hovered()}
                fallback={<div class="p-3">...</div>}
            >
                {(item) => (
                    <div class="w-fit flex items-center gap-2 p-3">
                        <div
                            class="rounded-md w-5 aspect-square"
                            style={{
                                'background-color': item().color,
                            }}
                        />
                        <span>
                            X: {item().xlabel}; Y: {item().ylabel}
                        </span>
                    </div>
                )}
            </Show>



        </div>
    );
}
