import { Show, createEffect, createSignal, on, onMount } from "solid-js";
import { lazyImports } from "./utils";
import { useData } from "./context/data.context.v2";
import * as C from './constants'
import { BasicSpinner } from "./components.utils";
const [BarChart] = lazyImports('BarChart')


export default function Container(props: any) {
    const dataP = useData()!
    const { image } = useData()!.images
    const { addImg, getImgDate, navigate } = dataP.functions;
    const ready = createSignal(false)
    const [isReady, setReady] = ready
    const [imgLoaded, setImgLoaded] = createSignal(false)
    onMount(() => { console.log('CONTAINER MOUNTED'); /* load(); */ })
    const [img] = createSignal<any>(<img />)
    createEffect(on(image, () => {
        if (image() !== undefined && image().src !== img().src) {

            img().src = image().base64src
            img().alt = 'immagine'
            img().width = image().width
            img().height = image().height
            img().onload = () => { setImgLoaded(true) }
            img().onerror = () => (setImgLoaded(false))

        }
    }))



    const [barW,] = createSignal(C.DBW),
        [barH,] = createSignal(C.DBH)
    return (

        <>
            <div class="flex flex-col">
                <Show when={imgLoaded()}>
                    <p>{getImgDate()}</p>
                </Show>
                <Show when={!imgLoaded()}><BasicSpinner txt="caricamento immagine" /></Show>
                {img()}
            </div>
            <button onclick={async () => { await addImg(undefined, undefined, -1); }}>-</button>
            <button onclick={async () => { await addImg(undefined, undefined, 1); }}>+</button>
            <Show when={props.type === 'BAR'}>
                <BarChart
                    width={barW()}
                    height={barH()}
                    margin={10}
                    circle={props.circle}
                    oblique={props.oblique}
                    nolines={props.nolines}
                    mode={props.mode ?? 'linear'}
                    ready={isReady}
                />


            </Show>
            <button onclick={() => { navigate(-1); }}>-</button>
            <button onclick={() => { navigate(+ 1); }}>+</button>

        </>
    )
}