import { atom } from 'nanostores';
import { createEffect, createResource, createSignal, on, type InitializedResourceReturn, type Accessor, type Setter, type Signal } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

export const [local, setLocal] = createSignal(0)
//GLOBALS
const lstSignal = createSignal(1)
const [getLstS, setLstS] = lstSignal
const [firstLoad, setFirstLoad] = createSignal(true)

const scmSignal = createSignal(1)
const [getscmS, setscmS] = scmSignal
export const [getQueryInterval, setQueryInterval] = createSignal(100)
export const getDataTrigger: { [key: string]: Accessor<number> } = {
  lst: getLstS,
  scm: getscmS
}

const [qlst, setqlst] = createSignal('')

const [qscm, setqscm] = createSignal('')

const queries: { [key: string]: Accessor<string> } = {
  lst: qlst,
  scm: qscm
}

const setQueries: { [key: string]: (q: any) => void } = {
  lst: (q: any) => setqlst(`/api/query?limit=${q.limit}`),
  scm: (q: any) => setqscm(`/api/query?opt=scene_monitoring&limit=${q.limit}`)
}

const setDataTrigger: { [key: string]: Setter<number> } = {
  lst: setLstS,
  scm: setscmS
}

export const loadData: { [key: string]: (val: number) => void } = {
  lst: (val: number) => setLstS(val),
  scm: (val: number) => setscmS(val)
}

const setTrigger = (val: number, prop: string) => {
  setDataTrigger[prop](val)
}
const setData = (prop: string) => (
  dataStores[prop][1](produce(
    (prevData: any[]) => { if (dataResources[prop][0]().length > 0) prevData.push(...dataResources[prop][0]()) }))
)

export const navigateData = (index: number, prop: string, unique: number) => {
  console.log('NAVIGATING')
  setLocal(unique)
  if (!dataResources[prop][0].loading) {
    setTrigger(index, prop);
  }
}

const dataFetches: { [key: string]: (q: string) => Promise<any> } = {
  $lst: async (q: string) => (await fetch(q)).json(),
  $scm: async (q: string) => (await fetch(q)).json()
}

export const dataResources: { [key: string]: InitializedResourceReturn<any, any> } = {
  lst: createResource(qlst, dataFetches.$lst, { initialValue: [] }),
  scm: createResource(qscm, dataFetches.$scm, { initialValue: [] }),
}

const $vulcano = atom('')
export const getVulcano = () => $vulcano.get()
export const setVulcano = (val: string) => $vulcano.set(val)
$vulcano.subscribe((val) => Object.values(dataResources).forEach(f => f[1].refetch()))

export const dataStores: { [key: string]: any } = {
  lst: createStore<any[]>([]),
  scm: createStore<any[]>([])
}

export const fulls: { [key: string]: Signal<boolean> } = {
  lst: createSignal<boolean>(false),
  scm: createSignal<boolean>(false)
}

const fullLenghts = createStore<{ [key: string]: number }>({
  lst: -1,
  scm: -1
})
export const getFullLen = (prop: string) => fulls[prop][0]() && (dataStores[prop][0].length)

const setFull = (prop: string) => (fulls[prop][1](true))


Object.entries(fulls).forEach(([key, d]) =>
  createEffect(on(d[0], (input, prevInput) => {
    console.log('FULLS: ', input, prevInput)
    if (input && !prevInput) {
      //setSrcFullLen(key)
      fullLenghts[1]([key], getDataTrigger[key]() - 1)
    }
  }
  )
  ))


Object.entries(getDataTrigger).forEach(([key, d]) =>
  createEffect(on(d,
    () => (
      setQueries[key]({ limit: d() })
    )
  ))
)

Object.entries(queries).forEach(([key, d]) =>
  createEffect(
    () => {
      if (d() && !dataResources[key][0].loading && dataResources[key][0]().length > 0) {
        if (!dataResources[key][0]()[0].limit) { setData(key) }
        else {
          setFull(key)
        }
        console.log('src, query: ', key, d())
        console.log('data: ', dataStores[key][0])
        console.log('resource: ', dataResources[key][0]())
      }
    }
  )
)
