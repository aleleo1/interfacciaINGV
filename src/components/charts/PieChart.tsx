import * as d3 from "d3"
import { For, Show, createEffect, createSignal } from "solid-js"
import type { PieChartProps as ChartProps } from "../context/context.types"

export default function TestChart2<T extends Record<string, any>>(p: ChartProps<T>) {
    const [arcs, setArcs] = createSignal<Arc<T>[]>([])
    const [hovered, setHovered] = createSignal<Arc<T> | null>(null)
    const handleMouseOver = (d: Arc<T>) => {
        setHovered(d)
    }
    const handleMouseOut = () => {
        setHovered(null)
    }
    createEffect(() => {
        const radius = Math.min(p.width, p.height) / 2 - p.margin
        const colorGenerator = d3
            .scaleSequential(d3.interpolateWarm)
            .domain([0, p.data.length])
        const pieGenerator = d3.pie<T>().value(p.value)
        const parsedData = pieGenerator(p.data)
        const arcGenerator = d3
            .arc<d3.PieArcDatum<T>>()
            .innerRadius(0)
            .outerRadius(radius)
        setArcs(
            parsedData.map((d, i) => ({
                path: arcGenerator(d),
                data: d.data,
                color: colorGenerator(i),
            }))
        )
    })
    return (
        <div style={`width: ${p.width}; height: ${p.height}`}>
            <svg viewBox={`0 0 ${p.width} ${p.height}`}>
                <g transform={`translate(${p.width / 2},${p.height / 2})`}>
                    <For each={arcs()}>
                        {(d) => (
                            <path
                                d={d.path}
                                onMouseOver={() => handleMouseOver(d)}
                                onMouseOut={() => handleMouseOut()}
                                fill={d.color}
                                class="hover:scale-105 transition"
                            />
                        )}
                    </For>
                </g>
            </svg>
            <Show when={hovered()}>
                {(item) => (
                    <div class="w-fit m-auto flex items-center gap-2 p-3">
                        <div
                            class="rounded-md w-5 aspect-square"
                            style={{
                                'background-color': item().color,
                            }}
                        />
                        <span>
                            {item().data[p.label]} Amount: {p.value(item().data)}
                        </span>
                    </div>
                )}
            </Show>
        </div>
    )
}
