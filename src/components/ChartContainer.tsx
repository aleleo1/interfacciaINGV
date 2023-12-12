import { Match, Show, Switch, createEffect, createResource, on, createSignal } from "solid-js";
import { lazyImports } from "./utils";
import { useData } from "./data.context";
const [PieChart, BarChart] = lazyImports('PieChart', 'BarChart')


export function Container(props: any) {
    const data = useData()
    const {dataSource} = data!.getR()
    const { refetch, elaboration } = data!.getF();
    const [barW, setBarW] = createSignal(900),
        [barH, setBarH] = createSignal(450),
        [pieW, setPieW] = createSignal(100),
        [pieH, setPieH] = createSignal(100);
    return (
        <div class="flex flex-col p-20 w-full">

            <Show when={props.type === 'BAR'}>
                <Show
                    when={!dataSource.loading}
                    fallback={<div>Loading data.....</div>}
                >
                    <div class="flex flex-col items-center justify-center">
                        <div class="flex flex-row gap-x-20">
                            <button onClick={() => refetch()}>REFETCH</button>
                            <button onClick={() => { setBarW(barW() + 50); setBarH(barH() + 50); }}>AUMENTA W-H</button>
                            <button onClick={() => { setBarW(barW() - 50); setBarH(barH() - 50) }}>DIMINUISCI W-H</button>
                        </div>
                        {/* <input type="text" placeholder="set width" class="text-black" onchange={(event) => setBarW(event.target.value)} />
                        <input type="text" placeholder="set heigh" class="text-black" onchange={(event) => setBarH(event.target.value)} /> */}
                        <BarChart
                            width={barW()}
                            height={barH()}
                            margin={10}
                            data={elaboration()!}
                        />
                    </div>
                </Show>
            </Show>
            <Show when={props.type === 'PIE'}>
                <Show
                    when={!dataSource.loading}
                    fallback={<div>Loading data.....</div>}
                >
                    <button onClick={() => refetch()}>REFETCH</button>
                    <PieChart
                        width={pieW()}
                        height={pieH()}
                        margin={10}
                        data={elaboration()!}
                        label="postId"
                        value={(d: any) => d.comments as number}
                    />
                </Show>
            </Show>
        </div>

    )
}