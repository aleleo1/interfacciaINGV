import { useStore } from '@nanostores/solid';
import { $test, $fetchDataSource1, elaborate } from '../../store';
import { createContext, createEffect, createMemo, createResource, createSignal, on, onMount, useContext } from "solid-js";
import type { Functions, PropsProvider, Resources, Signals } from "./context.types";
import { createStore } from 'solid-js/store';
const IMAGES_SRCS = ['/images/test.jpg', '/images/test2.jpg']
type CustomImageMetadata = { src: string, width: number, height: number, format: string, empty?: boolean }
const EMPTY_IMAGE: CustomImageMetadata = {
    src: '',
    width: 0,
    height: 0,
    format: '',
    empty: true
}
const DataContext = createContext<PropsProvider & { stores: { [key: string]: any }, images: { image: () => CustomImageMetadata } }>();

export function DataProviderV2(props: any) {

    //TEST SIGNAL FOR FILTERS
    const setTestF = (val: number) => ($test.set(val))
    const test = createSignal($test.get())
    const [testS, setTest] = test
    createEffect(() => {
        setTestF(testS())
    })


    //SIGNALS
    const loaded = createSignal(false)
    const [loadedg, setLoaded] = loaded
    const error = createSignal(false)
    const [errorg, setError] = error
    const imgRef = createSignal<HTMLImageElement | null>(null)
    const [imagesIndex, setImagesIndex] = createSignal(0)


    //RESOURCES
    const dataSourceRes = createResource($fetchDataSource1, { initialValue: [] });
    const dataSource = dataSourceRes[0]


    //STORES
    const [data, setData] = createStore<any>([])



    //FUNCTIONS
    const { mutate, refetch } = dataSourceRes[1]
    const getImgSrc = () => IMAGES_SRCS.at(imagesIndex())!
    const navigateImgSrc = () => (IMAGES_SRCS.at(imagesIndex() + 1 < IMAGES_SRCS.length ? imagesIndex() + 1 : 0))!
    const createImage = (src: string) => ({ src, width: 350, height: 350, format: 'jpg' })
    const image = () => imageStore[0].at(imagesIndex())
    const isImageThere = (src: string) => (imageStore[0].findIndex((elem) => (elem.src && elem.src === src)))
    const addImg =
        () => {
            if (isImageThere(navigateImgSrc()) < 0) {
                imageStore[1]
                    ([...imageStore[0], createImage(navigateImgSrc())])
            }
            setImagesIndex(
                isImageThere(navigateImgSrc())
            )
        }


    //IMAGES
    const imageStore = createStore<CustomImageMetadata[]>([createImage(getImgSrc())])


    //EFFECTS
    createEffect(() => setLoaded(!dataSource.loading))
    createEffect(() => setError(dataSource.error))
    createEffect(() => { setData([...elaborate(dataSource())]) })

    createEffect(() => { console.log(imagesIndex(), isImageThere(navigateImgSrc())) })

    const signals: Signals = { test, loaded, error, imgRef }
    const resources: Resources = { dataSource }
    const functions: Functions = { mutate, refetch, addImg }
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
