import { Show, createSignal } from "solid-js";
import { lazyImports } from "./utils";
import { useData } from "./context/data.context.v2";
import * as C from './constants'
import { BasicSpinner, BasicError } from "./components.utils";
const [BarChart] = lazyImports('BarChartV2')


export default function Container(props: any) {
    const dataP = useData()!

    const images = useData()!.images
    const { loaded, error, imgS } = useData()!.signals
    const [img, setImg] = imgS
    const { refetch } = dataP.functions;
    const [barW, setBarW] = createSignal(C.DBW),
        [barH, setBarH] = createSignal(C.DBH),
        [pieW, setPieW] = createSignal(C.PIEW),
        [pieH, setPieH] = createSignal(C.PIEH);
    return (

        <><button onclick={() => { img()!.src = images.test2.src; refetch() }}>CAMBIA IMMAGINE</button>
            <img
                ref={setImg}
                src={images.test1.src}
                width="350"
                height="350"
                alt="immagine"
            />
            <Show
                when={loaded[0]()}
                fallback={<BasicSpinner svg={true} />}
            >
                <Show
                    when={!error[0]()}
                    fallback={<BasicError msg='Impossibile caricare il grafico' />}
                >

                    <Show when={props.type === 'BAR'}>
                        <BarChart
                            width={barW()}
                            height={barH()}
                            margin={10}
                        />
                    </Show>

                    {/* <Show when={props.type === 'PIE'}>
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
                </Show> */}
                </Show>
            </Show >

        </>
    )
}