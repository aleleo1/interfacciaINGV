import { Match, Show, Switch } from "solid-js";
import { lazyImports } from "./utils";
import { useData } from "./context";
const [PieChart, BarChart] = lazyImports('PieChart', 'BarChart')

export function Container(props: any) {
    const [dataSource, { elaboration, refetch }] = useData()
    /* NARRR */
    /* <Show
                        when={!dataSource.loading}
                        fallback={<div>Loading data.....</div>}

                    >
                        <BarChart
                            width={500}
                            height={200}
                            margin={10}
                            data={elaboration()!}
                        />
                    </Show> */
    /////PIE


    /*                     {/* <Show
        when={!dataSource.loading}
        fallback={<div>Loading data.....</div>}>
        <PieChart
            width={100}
            height={100}
            margin={10}
            data={elaboration()!}
            label="postId"
            value={(d: any) => d.comments as number}
        />

    </Show> */
    return (
        <div>

            <Show when={props.type === 'BAR'}>
                <Show
                    when={!dataSource.loading}
                    fallback={<div>Loading data.....</div>}
                >
                    <button onClick={() => refetch()}>REFETCH</button>
                    <BarChart
                        width={500}
                        height={200}
                        margin={10}
                        data={elaboration()!}
                    />
                </Show>
            </Show>
            <Show when={props.type === 'BAR'}>
                <Show
                    when={!dataSource.loading}
                    fallback={<div>Loading data.....</div>}
                >
                    <button onClick={() => refetch()}>REFETCH</button>
                    <PieChart
                        width={100}
                        height={100}
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