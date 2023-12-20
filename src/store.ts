import * as d3 from 'd3';
import { atom, map } from 'nanostores';
import { createMemo, createResource } from 'solid-js';
import type { Functions, Signals } from './components/context/context.types';/* 
export const $fetchDataSource1 = async () => (await d3.json('https://jsonplaceholder.typicode.com/comments'))

export const [$dataSource, { mutate, refetch }] = createResource($fetchDataSource1, { initialValue: [] }); */
export const elaborate = (res: any) => (Object.entries(
    res.reduce(
      (acc: any, curr: any) => {
        acc[curr.postId] = Math.round(Math.random() * 100)
        return acc
      }, {}
    )
  ).map(
    ([postId, comments]) => ({ x: postId, y : comments })
  ).slice(0, Math.floor(Math.random() * 100)))

export const $test = atom(1)
/* export const $signals= map<Partial<Signals>>({});
export const $resources = map({});
export const $functions = map<Functions>({mutate, refetch}); */
export const $fetchDataSource1 = async () => (await d3.json('https://jsonplaceholder.typicode.com/comments'))
