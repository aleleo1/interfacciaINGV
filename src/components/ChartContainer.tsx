import { Show, createEffect, createSignal, on } from "solid-js";
import { lazyImports } from "./utils";
import { useData } from "./context/data.context.v2";
import * as C from './constants'
import { BasicSpinner, BasicError } from "./components.utils";
const [BarChart] = lazyImports('BarChartV2')


export default function Container(props: any) {
    const dataP = useData()!

    const { image } = useData()!.images

    const { loaded, error, imgRef } = useData()!.signals
    /* const [img, setImg] = imgRef */
    const [imgLoaded, setImgLoaded] = createSignal(false)
    const handleImgLoad = () => {
        setImgLoaded(true)
    }
    const [img, ] = createSignal<HTMLImageElement | any>(<img />)
    createEffect(on(image, ()=>{
        if(!img().src || image().src !== img().src){
            img().src = image().src
            img().alt = 'immagine'
            img().width = image().width
            img().height = image().height
            img().onload = () =>{setImgLoaded(true)}
            img().onerror = () =>(setImgLoaded(false))
        }
    }))
    createEffect(()=>{console.log(image())})
    const { refetch, addImg } = dataP.functions;
    const [barW, setBarW] = createSignal(C.DBW),
        [barH, setBarH] = createSignal(C.DBH),
        [pieW, setPieW] = createSignal(C.PIEW),
        [pieH, setPieH] = createSignal(C.PIEH);
    return (

        <>

            <button onclick={() => { addImg(); refetch(); }}>CAMBIA IMMAGINE</button>
            <Show when={!imgLoaded()}><BasicSpinner txt="caricamento immagine" /></Show>
            {img()}

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