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
    /*     const setTestF = (val: number) => ($test.set(val))
        const test = createSignal($test.get())
        const [testS, setTest] = test
        createEffect(() => {
            setTestF(testS())
        }) */
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
    //const dataSourceRes = createResource(dataFetches['$'+props.src], { initialValue: [] });
    const dataSource = dataResources[props.src][0]

    //STORES
    const [data, setData] = createStore<any>([])
    createEffect(() => {
        if (local() === 0 || local() === unique) {
            setData([...(dataSource())]);
        }
    })  /* const [data, setData] = createStore<any>([]) */


    //FUNCTIONS
    const { mutate, refetch } = dataResources[props.src][1]
    const load = async () => {
        loadData[props.src](1)
    }
    const navigate = async (val: number) => {
        /*   console.log('NAVIGATE')
          setNavigating(true) */
        setLocal(unique)
        setSrcIndexBk(navigateData(val, srcIndexBk(), props.src))
        setImagesIndex(0)
        /*   setData(...[dataResources[props.src][0]()])
          await addImg(undefined, undefined, 1, true)
          setImagesIndex(0)
          console.log('****store: ', data, data.length, '****data: ', data, data.length, '****datarsc: ', dataSource(), dataSource.length) */

    }
    const base64ImgSrc = async (src: string) => (
        await (await fetch('/api/image?img=' + src)).text()
    )
    //const getImgSrc = (index?: number) => /* data[index ?? imagesIndex()] ?  */data[index ?? imagesIndex()].path/*  : '' */
    const getImgDate = () => new Date(data[imagesIndex()].x).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    //const navigateImgSrc = (direction = 1) => (data[direction > 0 ? ((imagesIndex() + direction) < data.length ? imagesIndex() + direction : 0) : (((imagesIndex() + direction) >= 0) ? imagesIndex() + direction : data.length - 1)].path)
    //const createImage: (src?: string) => Promise<CustomImageMetadata> = async (src?: string) => ({ src: src ?? getImgSrc(), base64src: await base64ImgSrc(src ?? getImgSrc()), width: 350, height: 350, format: 'jpg' })
    const image = () => data[imagesIndex()]
    const getIdBySrc = (src: string, checkEmpty = false) => data.findIndex(elem => elem.path === src && !(checkEmpty && elem.base64src.trim() === ''))
    const setImgSrcById = async (id: number, src: string) => {
        const b64 = await (base64ImgSrc(src));
        setData([id], 'base64src', b => b + b64)
    }
    const checkEmpty = (d) => (d.base64src.trim() === '')
    //const isImageThere = (src: string) => (data.findIndex((elem) => (elem && elem.path && elem.path === src)))
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
            /*   console.log('id: ', id, 'src: ', src, 'direction: ', direction, ' firstif: ', isImageThere(src ?? navigateImgSrc(direction)) < 0)
              if (first) {
                  imageStore[1]([await createImage()]);
                  setImagesIndex(0)
                  return;
              }
              if (isImageThere(src ?? navigateImgSrc(direction)) < 0) { */
            //console.log('no image found with ', src ?? navigateImgSrc(direction))
            /*   if (id && src && data[id] && data[id].empty) {
                  imageStore[1]([...data].fill(await createImage(src), id, id + direction)) */
            //console.log('***** bar selezionata con immagine vuota ', data)
            /*    }
               else {
                   if (direction > 0) {
                       const newImages = id && id > imagesIndex() && src ? new Array<CustomImageMetadata>(id + 1 - data.length).fill(EMPTY_IMAGE).fill(await createImage(src), id - data.length)
                           : [await createImage(navigateImgSrc(direction))]
                       imageStore[1]
                           ([...data, ...newImages]) */
            //console.log('***** dir > 0', data, data.length)

            /*   }
              else {
                  const newImages = new Array<CustomImageMetadata>(data.length - data.length).fill(EMPTY_IMAGE).fill(await createImage(navigateImgSrc(direction)), data.length - data.length - 1)
                  imageStore[1]([...data, ...newImages]) */
            //console.log('***** dir < 0', data)
            /*     }
            }

        }
        let flg = false
        if (!id && !src && data[imagesIndex() + direction] && data[imagesIndex() + direction].empty) {
            flg = true
            imageStore[1]([...data].fill(await createImage(navigateImgSrc(direction)), imagesIndex() + direction, imagesIndex() + (direction > 0 ? 2 : 0)))
        }
        setImagesIndex(
            flg ? ((imagesIndex() + direction >= 0) ? imagesIndex() + direction : data.length - 1) : id ?? isImageThere(src ?? navigateImgSrc(direction))
        ) */
            //console.log('setted index: ', imagesIndex())
        }


    //IMAGES
    //const imageStore = createStore<CustomImageMetadata[]>([])


    //EFFECTS   

    createEffect(() => setLoaded(/* !dataSource.loading */data && data.length > 0))
    createEffect(() => setError(dataSource.error))
    /*  createEffect(async () => {
         if (!dataSource.loading && !dataSource.error) {
              setData([...await dataSource()]);
              console.log('PROPS SRC', props.src, data)
 
             imageStore[1]([await createImage()])
             console.log('image store: ', data)
         }
     }) */




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
