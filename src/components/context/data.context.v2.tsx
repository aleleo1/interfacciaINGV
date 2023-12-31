import { /* dataStores,  */dataResources, getDataTrigger, loadData, navigateData, local, setLocal } from '../../store';
import { createContext, createEffect, createMemo, createResource, createSignal, on, onMount, useContext } from "solid-js";
import type { Functions, PropsProvider, Resources, Signals } from "./context.types";
import { createStore } from 'solid-js/store';
const IMAGES_SRCS = ['/images/test.jpg', '/images/test2.jpg']
type CustomImageMetadata = { src: string, base64src: string | false, width: number, height: number, format: string, empty?: boolean }
const EMPTY_IMAGE: CustomImageMetadata = {
    src: '',
    base64src: false,
    width: 350,
    height: 450,
    format: 'jpg',
    empty: true
}
const DataContext = createContext<PropsProvider & { stores: { [key: string]: any[] }, images: { image: () => CustomImageMetadata } }>();

export function DataProviderV2(props: any) {

    //TEST SIGNAL FOR FILTERS
    const unique = Math.round(Math.random() * 100)
    const [srcIndexBk, setSrcIndexBk] = createSignal(1)


    //SIGNALS
    const loaded = createSignal(false)
    const [loadedg, setLoaded] = loaded
    const error = createSignal(false)
    const [errorg, setError] = error
    const imgRef = createSignal<HTMLImageElement | null>(null)
    const imgIndexSignal = createSignal(0)
    const [imagesIndex, setImagesIndex] = imgIndexSignal

    //RESOURCES
    const dataSource = dataResources[props.src][0]

    //STORES
    const [data, setData] = createStore<any>([])
    createEffect(() => {
        if (local() === 0 || local() === unique) {
            setData([...(dataSource())]);
        }
    })


    //FUNCTIONS
    const { mutate, refetch } = dataResources[props.src][1]
    const load = async () => {
        loadData[props.src](1)
    }
    const navigate = async (val: number) => {
        setLocal(unique)
        setSrcIndexBk(navigateData(val, srcIndexBk(), props.src))
        setImagesIndex(0)
    }
    const base64ImgSrc = async (src: string) => (
        await (await fetch('/api/image?img=' + src)).text()
    )
    const getImgDate = () => new Date(data[imagesIndex()].x).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    const image = () => data[imagesIndex()]
    const getIdBySrc = (src: string, checkEmpty = false) => data.findIndex((elem: any) => elem.path === src && !(checkEmpty && elem.base64src.trim() === ''))
    const setImgSrcById = async (id: number, src: string) => {
        const b64 = await (base64ImgSrc(src));
        setData([id], 'base64src', (b: string) => b + b64)
    }
    const checkEmpty = (d: any) => (d.base64src.trim() === '')
    const addImg =
        async (src?: string, id?: number, direction = 1, first?: boolean) => {
            if (first) return;
            if (src) {
                if (getIdBySrc(src, true) < 0) {
                    await setImgSrcById(getIdBySrc(src), src)
                }
                setImagesIndex(getIdBySrc(src));
                return;
            }
            if (id) {
                if (checkEmpty(data[id])) {
                    await setImgSrcById(id, data[id].path)
                }
                setImagesIndex(id)
                return;
            }
            const next = direction > 0 ? ((imagesIndex() + direction < data.length - 1) ? imagesIndex() + direction : 0) : ((imagesIndex() + direction >= 0) ? imagesIndex() + direction : data.length - 1)
            console.log(checkEmpty(data[next]))
            if (checkEmpty(data[next])) {

                await setImgSrcById(next, data[next].path)
                console.log('done')
            }
            setImagesIndex(next)

        }


    //EFFECTS   

    createEffect(() => setLoaded(/* !dataSource.loading */data && data.length > 0))
    createEffect(() => setError(dataSource.error))





    const signals: Signals = {/*  test, */ loaded, error, imgRef, imgIndexSignal }
    const resources: Resources = { dataSource }
    const functions: Functions = { refetch, addImg, getImgDate, load, navigate }
    const stores = { data }
    const images = { image }

    const provider: any = { signals, resources, functions, stores, images }

    return (

        <DataContext.Provider value={provider}>

            {props.children}

        </DataContext.Provider>

    );

}
export function useData() { return useContext(DataContext); }
