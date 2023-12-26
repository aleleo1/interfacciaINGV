import { $test, dataStores, dataResources } from '../../store';
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
    const imgIndexSignal = createSignal(0)
    const [imagesIndex, setImagesIndex] = imgIndexSignal


    //RESOURCES
    //const dataSourceRes = createResource(dataFetches['$'+props.src], { initialValue: [] });
    

    const dataSource = dataResources[props.src][0]


    //STORES
    const [data, setData] = dataStores[props.src]
    


    //FUNCTIONS
    const { mutate, refetch } = dataResources[props.src][1]


    const base64ImgSrc = (src?: string) => new Promise<string | false>((resolve, reject) => fetch(src ?? getImgSrc()).then(response => response.blob()).then((blob) => {
        const reader = new FileReader();
        reader.onloadend = function () {
            resolve(reader.result!.toString());
        };
        reader.onerror = () => reject(false);
        reader.readAsDataURL(blob)
    }));
    const getImgSrc = (index?: number) => data[index ?? imagesIndex()].path
    const getImgDate = () => data[imagesIndex()].x.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const navigateImgSrc = (direction = 1) => (data[direction > 0 ? (imagesIndex() + direction < data.length ? imagesIndex() + direction : 0) : ((imagesIndex() + direction >= 0) ? imagesIndex() + direction : data.length - 1)].path)
    const createImage: (src?: string) => Promise<CustomImageMetadata> = async (src?: string) => ({ src: src ?? getImgSrc(), base64src: await base64ImgSrc(src ?? getImgSrc()), width: 350, height: 350, format: 'jpg' })
    const image = () => imageStore[0][imagesIndex()]
    const isImageThere = (src: string) => (imageStore[0].findIndex((elem) => (elem && elem.src && elem.src === src)))
    const addImg =
        async (src?: string, id?: number, direction = 1) => {
            console.log('id: ', id, 'src: ', src, 'direction: ', direction)

            if (isImageThere(src ?? navigateImgSrc(direction)) < 0) {
                console.log('no image found with ', src ?? navigateImgSrc(direction))
                if (id && src && imageStore[0][id] && imageStore[0][id].empty) {
                    imageStore[1]([...imageStore[0]].fill(await createImage(src), id, id + direction))
                    console.log('***** bar selezionata con immagine vuota ', imageStore[0])
                }
                else {
                    if (direction > 0) {
                        const newImages = id && id > imagesIndex() && src ? new Array<CustomImageMetadata>(id + 1 - imageStore[0].length).fill(EMPTY_IMAGE).fill(await createImage(src), id - imageStore[0].length)
                            : [await createImage(navigateImgSrc(direction))]
                        imageStore[1]
                            ([...imageStore[0], ...newImages])
                        console.log('***** dir > 0', imageStore[0])

                    }
                    else {
                        const newImages = new Array<CustomImageMetadata>(data.length - imageStore[0].length).fill(EMPTY_IMAGE).fill(await createImage(navigateImgSrc(direction)), data.length - imageStore[0].length - 1)
                        imageStore[1]([...imageStore[0], ...newImages])
                        console.log('***** dir < 0', imageStore[0])
                    }
                }

            }
            let flg = false
            if (!id && !src && imageStore[0][imagesIndex() + direction] && imageStore[0][imagesIndex() + direction].empty) {
                flg = true
                imageStore[1]([...imageStore[0]].fill(await createImage(navigateImgSrc(direction)), imagesIndex() + direction, imagesIndex() + (direction > 0 ? 2 : 0)))
            }
            setImagesIndex(
                flg ? ((imagesIndex() + direction >= 0) ? imagesIndex() + direction : data.length - 1) : id ?? isImageThere(src ?? navigateImgSrc(direction))
            )
            console.log('setted index: ', imagesIndex())
        }


    //IMAGES
    const imageStore = createStore<CustomImageMetadata[]>([])


    //EFFECTS   

    createEffect(() => setLoaded(!dataSource.loading))
    createEffect(() => setError(dataSource.error))
    createEffect(async () => {
        if (!dataSource.loading && !dataSource.error) {
            console.log('PROPS SRC', props.src)
            setData(await dataSource());
            imageStore[1]([...imageStore[0], await createImage()])
            console.log('image store: ', imageStore[0])
        }
    })




    const signals: Signals = { test, loaded, error, imgRef, imgIndexSignal }
    const resources: Resources = { dataSource }
    const functions: Functions = { refetch, addImg, getImgDate }
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
