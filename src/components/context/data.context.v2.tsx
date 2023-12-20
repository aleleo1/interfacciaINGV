import { useStore } from '@nanostores/solid';
import { $test, $fetchDataSource1, elaborate } from '../../store';
import { createContext, createEffect, createMemo, createResource, createSignal, useContext } from "solid-js";
import type { Functions, PropsProvider, Resources, Signals } from "./context.types";
import { createStore } from 'solid-js/store';
import test1 from "../../assets/test.jpg";
import test2 from "../../assets/test2.jpg";
const DataContext = createContext<PropsProvider & { stores: any, images: ImageMetadata }>();

export function DataProviderV2(props: any) {
    //TEST SIGNAL FOR FILTERS
    const setTestF = (val: number) => ($test.set(val))
    const test = createSignal($test.get())
    const [testS, setTest] = test
    createEffect(() => {
        setTestF(testS())
    })

    const [dataSource, { mutate, refetch }] = createResource($fetchDataSource1, { initialValue: [] });
    const loaded = createSignal(false)
    const error = createSignal(false)
    const [loadedg, setLoaded] = loaded
    const [errorg, setError] = error
    const imgS = createSignal<HTMLImageElement | null>(null)
    createEffect(() => setLoaded(!dataSource.loading))
    createEffect(() => setError(dataSource.error))
    const [data, setData] = createStore<any>([])
    createEffect(() => { setData([...elaborate(dataSource())]) })
    const signals: Signals = { test, loaded, error, imgS }
    const resources: Resources = { dataSource }
    const functions: Functions = { mutate, refetch }
    const stores = { data }
    const images = { test1, test2 }
    const provider: PropsProvider & { stores: { [key: string]: any }, images: { [key: string]: ImageMetadata } } = { signals, resources, functions, stores, images }

    return (

        <DataContext.Provider value={provider}>

            {props.children}

        </DataContext.Provider>

    );

}
export function useData() { return useContext(DataContext); }
