import { createSignal, createEffect, Show, createResource, on } from 'solid-js';
import * as d3 from 'd3';
import type { BarChartProps as ChartProps } from '../context/context.types';
import { useData } from '../context/data.context.v2';
import { BasicSpinner } from '../components.utils';
import Plotly, { type PlotType, type PlotData } from 'plotly.js-dist-min'

type D3Data = { x: number; y: number; width: number; height: number; color: any; id: number; path?: string }
type MockedData = Partial<D3Data & { x: number; y: number }>

export default function BarChart<T extends Record<string, any>>(p: ChartProps<T>) {
    const test = createSignal<any>(<div style={`width:1000px;height:550px;background: #13151a;`}></div>)

    /*    const [bars, setBars] = createStore<MockedData[]>([]); */
    const { loaded, error, imgRef, afternav, localInterval, min, max, lIndex, isFull, navDirS, graphHelperSignal, firstLoad } = useData()!.signals
    const [isFirstLoad, setFirstLoad] = firstLoad
    const [graphHelper, setGraphHelper] = graphHelperSignal
    const [navDir, setNavDir] = navDirS
    /*     const [lInterval, setLocalInterval] = localInterval */
    const [minimo, setMinimo] = min
    const [massimo, setMassimo] = max
    const { addImg, getLocalInterval, fullLen, } = useData()!.functions
    const [localDataIndex, setLocalDataIndex] = lIndex
    const data = useData()!.stores.data
    const [afterNav, setAfterNav] = afternav
    const x = () => (d3.scaleTime([0, data.length - 1]).domain(d3.extent((data), d => new Date(d.x)) as Iterable<Date | d3.NumberValue>))
    const xlabels = () => (data).map(d => (d.x))
    /*     onMount(async () => await buildPlot()) */
    const plotMode = p.circle && p.oblique ? 'lines+markers' : p.circle ? 'markers' : p.oblique ? 'lines' : ''
    const plotType = p.circle && p.oblique ? 'scatter' : !p.nolines ? 'bar' : !p.oblique ? 'scatter' : ''
    const ticksOptions = {
        tickmode: 'array',
        ticktext: Array.from({ length: Math.floor(data.length / 10) }, (_, i) => data[i * 10].x),
        tickvals: Array.from({ length: Math.floor(data.length / 10) }, (_, i) => data[i * 10].x),
    }
    const annotations_bk: Plotly.Annotations[] = []
    const r = () => data.length > 0 && [data[minimo()].x, data[massimo()].x]
    const buildPlot = async () => {
        const newPlot = (await Plotly.newPlot(test[0](),
            [{

                x: xlabels(),

                y: ylabels(),
                type: plotType as PlotType,
                mode: plotMode as PlotData["mode"], marker: { size: 16 },

            }],
            {
                xaxis: {
                    showgrid: true,
                    gridcolor: '#7f7f7f',
                    range: r() || [],
                    ticklabelmode: 'period',
                    /* ...ticksOptions */


                },
                yaxis: {
                    showgrid: true,
                    gridcolor: '#7f7f7f',
                    range: p.mode !== 'verbal' ? [[0, (d3.max((data), d => d.y)) * 1.2]] : undefined
                },
                colorway: Array.from({ length: data.length }, (v, i) => d3
                    .scaleSequential(d3.interpolateWarm)
                    .domain([0, (data).length])(i)),
                paper_bgcolor: '#13151a', plot_bgcolor: '#13151a',
                margin: { t: 10, b: 100 },
                font: {

                    family: 'Courier New, monospace',

                    size: 14,

                    color: '#7f7f7f'

                }
            }, { responsive: true }))
        newPlot.on('plotly_click', function (datas: any) {

            handleClick(data[datas.points[0].pointIndex]);



            const annotate_text = 'x = ' + datas.points[0].x +
                ' y = ' + datas.points[0].y;

            const annotation = {
                text: annotate_text,
                x: datas.points[0].x,
                y: datas.points[0].y,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                arrowcolor: datas.points[0].fullData.marker.color,
                font: {

                    color: "black",

                    size: 12

                },
            } as Plotly.Annotations
            annotations_bk.pop()
            annotations_bk.push(annotation);
            Plotly.relayout(test[0](), { annotations: annotations_bk })



        })
        newPlot.on('plotly_hover', function (datas: any) {
            handleMouseOver(data[datas.points[0].pointIndex])

        })
        newPlot.on('plotly_unhover', function (datas: any) {

            handleMouseOut(data[datas.points[0].pointIndex])

        })
    }
    const plot = createResource(buildPlot)

    const ylabels = () => p.mode === 'verbal' ? data.map(d => d.ylabel) : (data).map(d => d.y);
    const animate = () => {
        console.log('***ND: ', navDir() && graphHelper())
        const base = {
            traces: [0],

            layout: {
                xaxis: {
                    range: r(),
                },
            }
        }
        const payload =
            navDir() && graphHelper()
                ? {

                    data: [{ y: ylabels(), x: xlabels() }],
                    ...base

                }
                : {
                    ...base
                }
        Plotly.animate(test[0](), payload, {
            transition: {
                duration: 300,
                easing: 'cubic-in-out'
            },
            frame: {
                duration: 300,
                redraw: false
            }
        })
    }

    const animateAxis = () => {
        console.log('CHANGING AXIS')
        Plotly.update(test[0](), {}, { yaxis: { range: [0, 200] } });
    }

    createEffect(on(isFirstLoad, async (val, prevVal) => {
        console.log('DAD EFFECT: ', `${prevVal} - ${val}`, ' RUNNING: ', (!val && val !== prevVal && loaded[0]()))
        if (!val && val !== prevVal && loaded[0]()) {
            await buildPlot()
        }

    }))

    createEffect(on(minimo, async (val: any, prevVal: any) => {
        console.log('MINIMO EFFECT: ', `${prevVal} - ${val}`, ' RUNNING: ', (loaded[0]()))

        if (loaded[0]()) {
            console.log('WEEEE', val)
            animate()
            setGraphHelper(false)
        }

    }, { defer: true }))
    const dataInfo = () => ((hovered() || clicked()) ? hovered() ?? clicked() : { x: 'nd', y: 'nd' })


    const [hovered, setHovered] = createSignal<any | null>(null)
    const [clicked, setClicked] = createSignal<any | null>(null)
    const handleMouseOver = (d: any, circle = false) => {
        console.log('HOVER')
        setHovered(d)

    }
    const handleMouseOut = (d: any, circle = false) => {

        setHovered(null)
    }
    const handleClick = (d: any) => {
        addImg(d.path, d.id)
        setClicked(d)
    }

    const setInterval = (ev: any) => {
        const i = ev.target.value && ev.target.value - 1
        if (i && i !== getLocalInterval() + 1)
            setMinimo(massimo() - i > 0 ? massimo() - i : 0);
        /*         console.log(massimo()) */

    }



    return (
        <div class='flex flex-col gap-x-10'>
            {/* <input type="range" class="w-full h-10" min={range()[0]} max={range()[1]} step="1" /> */}
            <div class='flex flex-row gap-x-10 text-sm'>
                <button onclick={animateAxis}>ANIMATE Y</button>
                <p class='text-white'>Num elementi in view: {isFull[0]() ? 'full: ' : ''} {fullLen() || data.length}</p>
                <p>{r() ? `from: ${(r() as any)[0] ?? ''}; to: ${(r() as any)[1] ?? ''}` : ''}</p>
                <p>
                    <label for="interval">Totale dati: </label>
                    <input name="interval" type="number" value={getLocalInterval() + 1} class='w-20 h-4 text-black' onchange={setInterval} />
                </p>
            </div>
            <Show
                when={plot[0].loading}
            ><BasicSpinner svg={true} /></Show>
            {test[0]()}
            <p>x: {dataInfo().x}; y: {dataInfo().y}</p>
        </div>

    );
}
