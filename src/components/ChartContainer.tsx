import { Show, createEffect, createSignal, on } from "solid-js";
import { lazyImports } from "./utils";
import { useData } from "./context/data.context.v2";
import * as C from './constants'
import { BasicSpinner, BasicError } from "./components.utils";
import { createStore } from "solid-js/store";
import { render } from "solid-js/web";
const [BarChart] = lazyImports('BarChart')


export default function Container(props: any) {
    const dataP = useData()!


    const { image } = useData()!.images
    const { refetch, addImg, getImgDate } = dataP.functions;
    const { loaded, error, imgRef } = useData()!.signals
    const [imgLoaded, setImgLoaded] = createSignal(false)
    const [img, setImg] = createSignal<any>(<img />)
    createEffect(on(image, () => {
        console.log('******* IMAGE EFFECT')
        if (image() !== undefined && image().src !== img().src) {

            img().src = image().base64src
            img().alt = 'immagine'
            img().width = image().width
            img().height = image().height
            img().onload = () => { setImgLoaded(true) }
            img().onerror = () => (setImgLoaded(false))

        }
    }))


    const [barW, setBarW] = createSignal(C.DBW),
        [barH, setBarH] = createSignal(C.DBH)
    return (

        <>
            <button onclick={async () => { await addImg(undefined, undefined, -1); }}>-</button>
            <button onclick={async () => { await addImg(undefined, undefined, 1); }}>+</button>
            <Show when={!imgLoaded()}><BasicSpinner txt="caricamento immagine" /></Show>
            {img()}
            <Show when={imgLoaded()}>
                <p>{getImgDate()}</p>
            </Show>

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
                            circle={props.circle}
                            oblique={props.oblique}
                            nolines={props.nolines}
                        />
                    </Show>
                </Show>
            </Show >

        </>
    )
}