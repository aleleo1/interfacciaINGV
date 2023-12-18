import { Match, Show, Switch, createEffect, createResource, on, createSignal } from "solid-js";
import { lazyImports } from "./utils";
import { useData } from "./context/data.context";
import { BasicSpinner } from "./components.utils";
const [PieChart, BarChart, LollipopChart] = lazyImports('PieChart', 'BarChart', 'LollipopChart')


export function Container(props: any) {
    const data = useData()
    const { dataSource } = data!.getR()
    const { refetch, elaboration } = data!.getF();
    const [barW, setBarW] = createSignal(900),
        [barH, setBarH] = createSignal(450),
        [pieW, setPieW] = createSignal(110),
        [pieH, setPieH] = createSignal(110);
    return (
        <div class="flex flex-col p-20 w-full justify-center items-center">

            <Show when={props.type === 'BAR'}>
                <Show
                    when={!dataSource.loading}
                    fallback={<BasicSpinner />}
                >
                    <div class="flex flex-col items-center justify-center">
                        <div class="flex flex-row gap-x-20">
                            <button onClick={() => refetch()}>REFETCH</button>
                            <button onClick={() => { setBarW(barW() + 50); setBarH(barH() + 50); }}>AUMENTA W-H</button>
                            <button onClick={() => { setBarW(barW() - 50); setBarH(barH() - 50) }}>DIMINUISCI W-H</button>
                        </div>
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
                    fallback={<BasicSpinner />}
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