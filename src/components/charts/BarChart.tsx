import { createSignal, createEffect, For, on, Show } from 'solid-js';
import * as d3 from 'd3';
import { createStore } from 'solid-js/store';

type ChartProps<T extends Record<string, any>> = {
    width: number
    height: number
    margin: number
    data: T[]
}
type D3Data = { x: number; y: number; width: number; height: number; color: any; id: number }
type MockedData = Partial<D3Data & { postId: number; comments: number }>
const DELTA_HY = 20
const FONT_SIZE = "10px"
async function svgHandler(svg, { value, refetching }) {
    // Fetch the data and return a value.
    // `source` tells you the current value of the source signal;
    // `value` tells you the last returned value of the fetcher;
    // `refetching` is true when the fetcher is triggered by calling `refetch()`,
    // or equal to the optional data passed: `refetch(info)`

    return new Promise((resolve, reject) => {
        // Simulate a delay
        try {
            if (refetching) {
                resolve(false)
            }
            console.log('****SIDE EFFECT')
            const colorGenerator = d3
                .scaleSequential(d3.interpolateWarm)
                .domain([0, p.data.length])
            const xScale = d3.scaleBand().range([0, width]).padding(0.5).domain(p.data.map(d => d.postId));
            const yScale = d3.scaleLinear().range([height, 0]).domain([0, d3.max(p.data, d => d.comments) * 1.1]);
            const barWidth = xScale.bandwidth();
            setBars(
                p.data.map((d, i) => ({
                    x: xScale(d.postId),
                    y: yScale(d.comments),
                    width: barWidth,
                    height: height - yScale(d.comments),
                    postId: d.postId,
                    comments: d.comments,
                    color: colorGenerator(i),
                    id: i
                }))
            );
            if (svg()) {
                d3.select(svg()).append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(xScale))
                    .selectAll("text")
                    .attr("transform", "translate(-8,0)rotate(-45)")
                    .style("font-size", FONT_SIZE)
                    .style("text-anchor", "end");
                d3.select(svg())
                    .append("g").call(d3.axisLeft(yScale))
                    .selectAll("text")
                    .style("font-size", FONT_SIZE)
            }
        }
        catch (err) {
            reject(false)
        }
        finally {
            resolve(true)
        }
    });
}
export default function BarChart<T extends Record<string, any>>(p: ChartProps<T>) {
    const margin = { top: 10, right: 10, bottom: 20, left: 10 },
        width = p.width - margin.left - margin.right,
        height = p.height - margin.top - margin.bottom
    const [bars, setBars] = createStore<MockedData[]>([]);
    const [svg, setSvg] = createSignal<SVGSVGElement | null>(null);
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
        console.log('****SIDE EFFECT')
        const colorGenerator = d3
            .scaleSequential(d3.interpolateWarm)
            .domain([0, p.data.length])
        const xScale = d3.scaleBand().range([0, width]).padding(0.5).domain(p.data.map(d => d.postId));
        const yScale = d3.scaleLinear().range([height, 0]).domain([0, d3.max(p.data, d => d.comments) * 1.1]);
        const barWidth = xScale.bandwidth();
        setBars(
            p.data.map((d, i) => ({
                x: xScale(d.postId),
                y: yScale(d.comments),
                width: barWidth,
                height: height - yScale(d.comments),
                postId: d.postId,
                comments: d.comments,
                color: colorGenerator(i),
                id: i
            }))
        );
        if (svg()) {
            d3.select(svg()).append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale))
                .selectAll("text")
                .attr("transform", "translate(-8,0)rotate(-45)")
                .style("font-size", FONT_SIZE)
                .style("text-anchor", "end");
            d3.select(svg())
                .append("g").call(d3.axisLeft(yScale))
                .selectAll("text")
                .style("font-size", FONT_SIZE)
        }
    });

    return (
        <div class='w-fit'>
            <svg ref={setSvg}
                viewBox={`-20 -10 ${width + 20} ${height + 30}`}
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
                fallback={() => (<div class="w-fit flex items-center gap-2 p-3">...</div>)}
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
        </div>
    );
}
