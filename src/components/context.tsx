import * as d3 from "d3";
import { createContext, createEffect, createMemo, createResource, on, useContext } from "solid-js";
const elaborate = (res: any) => (Object.entries(
  res.reduce(
    (acc: any, curr: any) => {
      /*      if (!acc[curr.postId]) {
               acc[curr.postId] = 1;
           } else {
               acc[curr.postId]++;
           }
           return acc; */
      acc[curr.postId] = Math.round(Math.random() * 100)
      return acc
    }, {}
  )
).map(
  ([postId, comments]) => ({ postId: postId, comments })
))
const fetchDataSource1 = async () => (await d3.json('https://jsonplaceholder.typicode.com/comments'))
const DataContext = createContext();
export function DataProvider(props: any) {

  const [dataSource, { mutate, refetch }] = createResource(fetchDataSource1, { initialValue: [] });
  const elaboration = createMemo(() => (elaborate(dataSource())))
  createEffect(on(dataSource, () => {
    console.log('*****data fetched: ', dataSource())
  }))

  const provider = [
    dataSource, {mutate, refetch, elaboration}
  ] 


  return (

    <DataContext.Provider value={provider}>

      {props.children}

    </DataContext.Provider>

  );

}
export function useData() { return useContext(DataContext); }