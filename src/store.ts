import * as d3 from 'd3';
import { atom } from 'nanostores';
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
export const $fetchDataSource1: () => Promise<any[]> = async () => (await d3.csv('/db/_data.csv'))
