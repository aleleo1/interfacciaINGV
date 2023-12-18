import { useStore } from '@nanostores/solid';
import { $test } from '../../store';
import { createContext, createEffect, createMemo, createSignal, useContext } from "solid-js";
import type { Functions, Resources, Signals } from "./context.types";
import { Provider } from './context.model'

/* const elaborate = (res: any) => (Object.entries(
    res.reduce(
        (acc: any, curr: any) => {
            acc[curr.postId] = Math.round(Math.random() * 100)
            return acc
        }, {}
    )
).map(
    ([postId, comments]) => ({ x: postId, y: comments })
).slice(0, Math.floor(Math.random() * 100))) */
/* const fetchDataSource1 = async () => (await d3.json('https://jsonplaceholder.typicode.com/comments')) */
const DataContext = createContext<Provider>();

export function DataProviderV2(props: any) {
    const setTestF = (val: number) => ($test.set(val))
    /*     const elaboration = createMemo(() => (elaborate($dataSource()))) */
    const test = createSignal($test.get())
    createEffect(() => {
        setTestF(test[0]())
    })


    const signals: Signals = { test }
    const resources: Resources = {}
    const functions: Functions = {}

    const provider = new Provider(signals, resources, functions)

    return (

        <DataContext.Provider value={provider}>

            {props.children}

        </DataContext.Provider>

    );

}
export function useData() { return useContext(DataContext); }
