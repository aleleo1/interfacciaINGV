import { Show, createSignal } from "solid-js";
import { lazyImports } from "./utils";
import { useData } from "./context/data.context.v2";
import * as C from './constants'
import { BasicSpinner, BasicError } from "./components.utils";
const [BarChart] = lazyImports('BarChartV2')


export default function Container(props: any) {
    const dataP = useData()!

    const { image } = useData()!.images

    const { loaded, error, imgRef } = useData()!.signals
    const [img, setImg] = imgRef
    const [imgLoaded, setImgLoaded] = createSignal(false)
    const handleImgLoad = () => {
        setImgLoaded(true)
    }
    const { refetch, addImg } = dataP.functions;
    const [barW, setBarW] = createSignal(C.DBW),
        [barH, setBarH] = createSignal(C.DBH),
        [pieW, setPieW] = createSignal(C.PIEW),
        [pieH, setPieH] = createSignal(C.PIEH);
    return (

        <>

            <button onclick={() => { addImg(); refetch(); }}>CAMBIA IMMAGINE</button>
            <Show when={!imgLoaded() || !img()}><BasicSpinner /></Show>
            <img
                onload={handleImgLoad}
                style={`display: ${imgLoaded() ? 'block' : 'none'}`}
                ref={setImg}
                src={image().src}
                width={image().width}
                height={image().height}
                alt='immagine'
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
                </Show>
            </Show >

        </>
    )
}