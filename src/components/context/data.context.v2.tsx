import { dataResources, getDataTrigger, loadData, navigateData, fulls, dataStores, getFullLen, local } from '../../store';
import { createContext, createEffect, createSignal, on, useContext } from "solid-js";
import type { Functions, PropsProvider, Resources, Signals } from "./context.types";
type CustomImageMetadata = { src: string, base64src: string | false, width: number, height: number, format: string, empty?: boolean }

const DataContext = createContext<PropsProvider & { stores: { [key: string]: any[] }, images: { image: () => CustomImageMetadata } }>();

export function DataProviderV2(props: any) {

    //SIGNALS
    const unique = Math.round(Math.random() * 1000)
    const generalIndex = getDataTrigger[props.src]
    const firstLoad = createSignal(true)
    const [isFirstLoad, setFirstLoad] = firstLoad
    const loaded = createSignal(false)
    const [loadedg, setLoaded] = loaded
    const error = createSignal(false)
    const [errorg, setError] = error
    const imgRef = createSignal<HTMLImageElement | null>(null)
    const imgIndexSignal = createSignal(0)
    const [imagesIndex, setImagesIndex] = imgIndexSignal
    const navDirS = createSignal(true)
    const [navDir, setNavDir] = navDirS
    const afternav = createSignal(false)
    const lIndex = createSignal(1)
    const [localDataIndex, setLocalDataIndex] = lIndex
    const isFull = fulls[props.src]
    const [isDataFull,] = isFull
    const fullLen = () => getFullLen(props.src)
    /*     const localInterval = createSignal(100) */
    const min = createSignal(0)
    const max = createSignal(99)
    const [minimo, setMinimo] = min
    const [massimo, setMassimo] = max
    /*     const [getLocalInterval, setLocalInterval] = localInterval */
    const getLocalInterval = () => massimo() - minimo()
    const graphHelperSignal = createSignal(true)/* && (minimo() + getQueryInterval()) > data.length */
    const [graphHelper, setGraphHelper] = graphHelperSignal
    //RESOURCES
    const dataSource = dataResources[props.src][0]

    //STORES
    const [data, setData] = dataStores[props.src]


    //FUNCTIONS
    const { mutate, refetch } = dataResources[props.src][1]
    /*     const load = () => {
            loadData[props.src](1)
        } */

    const navigate = async (val: number) => {
        if (!loadedg()) return
        let cond = false
        setNavDir(val >= 1)
        if (navDir()) {
            if (!isDataFull() && (massimo() + getLocalInterval()) > dataLength()) {
                cond = true
                console.log('PRE NAVIGATING'); navigateData(generalIndex() + 1, props.src, unique);
            }
            if (isDataFull() && (massimo() + getLocalInterval() > dataLength() && massimo() < (dataLength() - 1))) {
                setLocalDataIndex(localDataIndex() + 1)
            }
            if ((massimo() + getLocalInterval()) < dataLength() && !cond) {
                setLocalDataIndex(localDataIndex() + 1)
            }
        } else {
            setLocalDataIndex(localDataIndex() + val > 1 ? localDataIndex() + val : 1)
        }
        console.log('ACTUAL INDEX: ', localDataIndex(), cond)
    }


    const base64ImgSrc = async (src: string) => (
        await (await fetch('/api/image?img=' + src)).text()
    )
    const getImgDate = () => new Date(data[imagesIndex()].x).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    const image = () => data[imagesIndex()]
    const getIdBySrc = (src: string, checkEmpty = false) => data.findIndex((elem: any) => elem.path === src && !(checkEmpty && elem.base64src.trim() === ''))
    const setImgSrcById = async (id: number, src: string) => {
        const b64 = await (base64ImgSrc(src));
        console.log(src)
        if (b64 === 'error') return;
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
            if (checkEmpty(data[next])) {

                await setImgSrcById(next, data[next].path)
            }
            setImagesIndex(next)

        }


    //EFFECTS   
    const dl = createSignal(0)
    const [dataLength, setDataLength] = dl
    createEffect(() => setError(dataSource.error))
    createEffect(() => setLoaded(!dataSource.loading && data && data.length > 0))
    createEffect(on(loaded[0], (val, prevVal) => {
        console.log('DATA EFFECT', `${prevVal} - ${val}`, ' RUNNING: ', val && !prevVal && data.length > 0)
        if (val && !prevVal && data.length > 0) {
            if (isFirstLoad()) { setFirstLoad(false); return; }
            setDataLength(data.length)
            setGraphHelper(true)
            console.log('DATA EFFECT RESULT: ', val, dataLength())
        }
    }, { defer: true }))
    createEffect(on(localDataIndex, (val, prevVal) => {
        console.log('INDEX EFFECT: ', `${prevVal} - ${val}`, ' RUNNING: ', !!(prevVal && val && val !== prevVal && dataLength() > 0))
        if (!!(prevVal && val && val !== prevVal && dataLength() > 0)) {
            if (val > prevVal) {
                setMassimo((dataLength() - 1) >= (massimo() + getLocalInterval() + 1) ? massimo() + getLocalInterval() + 1 : dataLength() - 1)
            }
            else {
                if ((massimo() - getLocalInterval()) < getLocalInterval())
                    setMassimo(getLocalInterval())
                else
                    setMassimo((minimo() - 1) >= 0 ? minimo() - 1 : getLocalInterval())
            }
            console.log('INDEX EFFECT RESULT: (massimo) ', massimo())

        }
    }, { defer: true }))
    createEffect(on(dataLength, (val, prevVal) => {
        console.log('DATALEN EFFECT: ', `${prevVal} - ${val}`, ' RUNNING: ', !(!val || !loaded[0]() || val === prevVal || isFirstLoad()), 'FIRST LOAD? ', isFirstLoad())

        if (!val || !loaded[0]() || val === prevVal) return;
        if (isFirstLoad() || local() !== unique) { return }
        console.log(localDataIndex())
        setLocalDataIndex(localDataIndex() + 1)
        console.log('DATALEN EFFECT RESULT: (index) ', localDataIndex())

    }, { defer: true }))
    createEffect(on(massimo, (val, prevVal) => {
        console.log('MASSIMO EFFECT: ', `${prevVal} - ${val}`, ' RUNNING: ', (!!prevVal && val && val !== prevVal))

        if (!!prevVal && val && val !== prevVal) {
            if (val > prevVal) {
                setMinimo(val < (dataLength() - 1) ? prevVal + 1 : dataLength() - (prevVal - minimo() + 1))
            }
            else {
                setMinimo(minimo() - (prevVal - minimo()) - 1 >= 0 ? minimo() - (prevVal - minimo()) - 1 : 0)
            }
            console.log('MASSIMO EFFECT RESULT: (minimo) ', minimo())

        }
    }, { defer: true }))




    const signals: Signals = { loaded, error, imgRef, imgIndexSignal, navDirS, afternav, min, max, lIndex, isFull, graphHelperSignal, firstLoad }
    const resources: Resources = { dataSource }
    const functions: Functions = { refetch, addImg, getImgDate, navigate, getLocalInterval, fullLen }
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
