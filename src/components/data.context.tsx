import * as d3 from "d3";
import { createContext, createEffect, createMemo, createResource, on, useContext, type Signal } from "solid-js";
import type { Functions, Resources, Signals } from "./context.types";
import {Provider} from './context.model'
const elaborate = (res: any) => (Object.entries(
  res.reduce(
    (acc: any, curr: any) => {
      acc[curr.postId] = Math.round(Math.random() * 100)
      return acc
    }, {}
  )
).map(
  ([postId, comments]) => ({ postId: postId, comments })
).slice(0, 50))
const fetchDataSource1 = async () => (await d3.json('https://jsonplaceholder.typicode.com/comments'))
const DataContext = createContext<Provider>();

export function DataProvider(props: any) {

  const [dataSource, { mutate, refetch }] = createResource(fetchDataSource1, { initialValue: [] });
  const elaboration = createMemo(() => (elaborate(dataSource())))

  const functions: Functions = { mutate, refetch, elaboration };
  const resources: Resources = { dataSource }
  const signals: Signals = {}
  const provider = new Provider(signals, resources, functions)


  return (

    <DataContext.Provider value={provider}>

      {props.children}

    </DataContext.Provider>

  );

}
export function useData() { return useContext(DataContext); }