import * as d3 from 'd3';
import { atom } from 'nanostores';
import { createStore } from 'solid-js/store';
import { createResource, type InitializedResource, type InitializedResourceOptions, type InitializedResourceReturn } from 'solid-js';
export const elaborate = async (res: any[]) => (Object.entries(
  (await $fetchJSONcomments()).reduce(
    (acc: any, curr: any) => {
      acc[curr.postId] = Math.round(Math.random() * 100)
      return acc
    }, {}
  )
).map(
  ([postId, comments], i) => ({
    x: res[i]
      ? (d3.isoParse((res[i]['Date']))) : null, y: comments,
    path: res[i] ? '/images/S2/' + res[i]['Path'] : null,
    i
  })
).filter((elem) => (elem !== null))
  .slice(0, Math.floor(Math.random() * 100))
)

export const $test = atom(1)
const $fetchJSONcomments: () => Promise<any[]> = async () => (await d3.json('https://jsonplaceholder.typicode.com/comments') as any[])

const dataFetches: { [key: string]: () => Promise<any> } = {
  $lst: async () => (await elaborate(await d3.csv('/db/_data.csv'))),
  $vrp: async () => (await elaborate(await d3.csv('/db/_data.csv')))
}

export const dataResources:  { [key: string]: InitializedResourceReturn<any, any> }= {
  lst:  createResource(dataFetches.$lst, {initialValue: []}),
  vrp:  createResource(dataFetches.$vrp, {initialValue: []}),
}

export const dataStores:  { [key: string]: any }= {
  lst:  createStore<any>([]),
  vrp:  createStore<any>([]),
}
