import { createSignal, createEffect, For, on, Show, createResource } from 'solid-js';
import * as d3 from 'd3';
import { createStore } from 'solid-js/store';
import type { BarChartProps as ChartProps } from '../context/context.types';
import { BasicSpinner } from '../components.utils';
type D3Data = { x: number; y: number; width: number; height: number; color: any; id: number }
type MockedData = Partial<D3Data & { postId: number; comments: number }>
const DELTA_HY = 20

export default function BarChart<T extends Record<string, any>>(p: ChartProps<T>) {
    const renderSVG: (resource: any, { value, refetching }: {
        value: any;
        refetching: any;
    }) => Promise<boolean> = async function (resource, { value, refetching }) {
        return new Promise<boolean>((resolve, reject) => {
            try {
                if (refetching) {
                    resolve(false)
                }
                console.log('****LOADING SVG RESOURCE')
                const colorGenerator = d3
                    .scaleSequential(d3.interpolateWarm)
                    .domain([0, p.data.length])
                setBars(
                    p.data.map((d, i) => ({
                        x: xScale()(d.postId),
                        y: yScale()(d.comments),
                        width: barWidth(),
                        height: height - yScale()(d.comments),
                        postId: d.postId,
                        comments: d.comments,
                        color: colorGenerator(i),
                        id: i
                    }))
                );

            } catch (err) { console.log('ERROR IN SVG RESOURCE', err); reject(false) }
            finally { resolve(true) }
        })
    }


    const margin = { top: 10, right: 10, bottom: 20, left: 10 },
        width = p.width - margin.left - margin.right,
        height = p.height - margin.top - margin.bottom
    const [bars, setBars] = createStore<MockedData[]>([]);
    const xScale = () => (d3.scaleBand().range([0, width]).padding(0.5).domain(p.data.map(d => d.postId)))
    const yScale = () => (d3.scaleLinear().range([height, 0]).domain([0, d3.max(p.data, d => d.comments) * 1.1]))
    const barWidth = () => (xScale().bandwidth())
    const font_size = () => (Math.floor(barWidth() - 2))
    const [svg, setSvg] = createSignal<SVGSVGElement | null>(null);
    const d3Selector = () => (d3.select(svg()))
    const [svgResource] = createResource(renderSVG)
    const [hovered, setHovered] = createSignal<any | null>(null)
    const handleMouseOver = (d: MockedData) => {
        setHovered(d)
        //setBars((bar)=> bar.id === d.id, {height: d.height + DELTA_HY, y: d.y - DELTA_HY});

    }
    const handleMouseOut = (d: MockedData) => {
        setHovered(null)
        //setBars((bar)=> bar.id === d.id, {height: d.height - DELTA_HY, y: d.y + DELTA_HY});
    }

    let counter = 0

    createEffect(on(svg, (() => {
        counter++
        console.log(`****svg side effect counter: ${counter}`, font_size(), barWidth())
        if (d3Selector()) {
            d3Selector().append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale()))
                .selectAll("line")
                .attr("y2", "10");
            d3Selector().select("g")
                .selectAll("text")
                .attr("y", "15")
                .style("font-size", font_size())
                .style("text-anchor", "end");
            d3Selector()
                .append("g").call(d3.axisLeft(yScale()))
                .selectAll("text")
                .style("font-size", font_size())
        }
    })));

    return (
        <div class='w-fit'>
            <Show when={!svgResource.loading}
                fallback={<BasicSpinner />}>
                <Show when={!svgResource.error} fallback={<p>Errore nel caricamento</p>}>
                    <svg ref={setSvg}
                        viewBox={`-20 -10 ${width + 20} ${height + 40}`}
                        width={p.width}
                        height={p.height}
                        preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
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
                    </svg>
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
                                    PostID: {item().postId} con {item().comments} commenti
                                </span>
                            </div>
                        )}
                    </Show>
                </Show>
            </Show>


        </div>
    );
}
