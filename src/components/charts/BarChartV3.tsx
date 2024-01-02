import { createSignal, createEffect, For, Show } from 'solid-js';
import BaseChart from './BaseXYChart'
import * as d3 from 'd3';
import { createStore } from 'solid-js/store';
import type { BarChartProps as ChartProps } from '../context/context.types';
import { useData } from '../context/data.context.v2';
import { BasicError, BasicSpinner } from '../components.utils';

type D3Data = { x: number; y: number; width: number; height: number; color: any; id: number; path?: string }
type MockedData = Partial<D3Data & { x: number; y: number }>

export default function BarChart<T extends Record<string, any>>(p: ChartProps<T>) {
    const [bars, setBars] = createStore<MockedData[]>([]);
    const { loaded, error, imgRef } = useData()!.signals
    const { data } = useData()!.stores
    const [, setImagesIndex] = useData()!.signals.imgIndexSignal
    const { addImg } = useData()!.functions
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;
    const margins = { mt: marginTop, mb: marginBottom, ml: marginLeft, mr: marginRight }
    const x = () => (d3.scaleTime([marginLeft, (p.width - marginRight)]).domain(d3.extent((data), d => new Date(d.x))))
    const y = () => (d3.scaleLinear().range([p.height - marginBottom, 0]).domain([0, (d3.max((data), d => d.y)) * 1.2]))
    const ylabels = () => p.mode === 'verbal' && (data).reduce((acc, d) => {
        acc[d.y] = d.ylabel && d.ylabel.toLowerCase();
        return acc;
    }, {});


    const [hovered, setHovered] = createSignal<any | null>(null)
    const handleMouseOver = (d: MockedData, circle = false) => {

        setHovered(d)
        if (!circle) {
            setBars([d.id!], 'width', w => w! + 12)
            setBars([d.id!], 'x', x => x! - 6)
        }
    }
    const handleMouseOut = (d: MockedData, circle = false) => {
        if (!circle) {
            setBars([d.id!], 'width', w => w! - 12)
            setBars([d.id!], 'x', x => x! + 6)
        }
        setHovered(null)
    }
    const handleClick = (d: MockedData) => {
        addImg(d.path, d.id)
    }
    createEffect(() => {
        if ((data).length > 0) {
            const colorGenerator = d3
                .scaleSequential(d3.interpolateWarm)
                .domain([0, (data).length])
            setBars(
                (data).map((d, i) => ({
                    x: x()(new Date(d.x)),
                    y: y()(d.y),
                    width: 1.5,
                    height: p.height - y()(d.y) - marginBottom,
                    xlabel: new Date(d.x).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
                    ylabel: d.y,
                    color: colorGenerator(i),
                    id: d.i,
                    path: d.path
                }))
            );
        }
    })


    return (
        <div>
            <Show
                when={loaded[0]()}
                fallback={<BasicSpinner svg={true} />}
            >
                <Show
                    when={!error[0]()}
                    fallback={<BasicError msg='Impossibile caricare il grafico' />}
                >
                    <BaseChart {...Object.assign({}, p, margins, { x: x(), y: y(), ylabels: ylabels() })} >
                        <For each={bars}>
                            {(bar, index) => (
                                <>
                                    {!p.nolines && (!p.oblique ?
                                        <rect
                                            x={bar.x}
                                            y={bar.y}
                                            width={bar.width}
                                            height={bar.height}
                                            fill={bar.color}
                                            onMouseOver={() => !p.circle ? handleMouseOver(bar) : {}}
                                            onMouseOut={() => !p.circle ? handleMouseOut(bar) : {}}
                                            onclick={() => !p.circle ? handleClick(bar) : {}}
                                        />
                                        : <line
                                            x1={(index() - 1 >= 0) ? bars[index() - 1].x : bars[index()].x}
                                            y1={bars[index() - 1] ? bars[index() - 1].y : bars[index()].y}
                                            x2={bar.x}
                                            y2={bar.y}
                                            onMouseOver={() => !p.circle ? handleMouseOver(bar) : {}}
                                            onMouseOut={() => !p.circle ? handleMouseOut(bar) : {}}
                                            onclick={() => !p.circle ? handleClick(bar) : {}}
                                            style={`stroke:${bar.color};stroke-width:${bar.width}`} />)}
                                    {p.circle && <circle
                                        cx={bar.x}
                                        cy={bar.y}
                                        r="5"
                                        fill={bar.color}
                                        stroke-width="2"
                                        onMouseOver={() => handleMouseOver(bar, true)}
                                        onMouseOut={() => handleMouseOut(bar, true)}
                                        onclick={() => handleClick(bar)} />
                                    }
                                </>
                            )}
                        </For>
                    </BaseChart>
                </Show>
            </Show >
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
