import { atom } from 'nanostores';
import { createEffect, createResource, createSignal, on, type InitializedResourceReturn } from 'solid-js';

export const [local, setLocal] = createSignal(0)
const lstSignal = createSignal(1)
const [getLstS, setLstS] = lstSignal
createEffect(on(getLstS, () => {
  console.log(getLstS())
  if (getLstS() >= 1) {
    dataResources.lst[1].refetch()

  }
}, { defer: true }))
const scmSignal = createSignal(1)
const [getscmS, setscmS] = scmSignal
createEffect(on(getscmS, () => {
  if (getscmS() >= 1) {
    dataResources.scm[1].refetch()
  }
}, { defer: true }))
export const getDataTrigger = {
  lst: getLstS,
  scm: getscmS
}
const setDataTrigger = {
  lst: setLstS,
  scm: setscmS
}
export const loadData = {
  lst: (val: number) => setLstS(val),
  scm: (val: number) => setscmS(val)
}
const chooseIndex = (bk: number, prop: string) => {
  if (bk === getDataTrigger[prop]()) {
    return getDataTrigger[prop]()
  } else return bk;
}
const setTrigger = (val: number, prop: string) => {
  setDataTrigger[prop](val)
}
export const navigateData = (val: number, bk: number, prop: string) => { const i = chooseIndex(bk, prop); const index = i + val > 1 ? i + val : 1; setTrigger(index, prop); return index; }

const dataFetches: { [key: string]: (limit: number) => Promise<any> } = {
  $lst: async (limit: number) => (await fetch(`/api/query?limit=${limit}`)).json(),
  $scm: async (limit: number) => (await fetch(`/api/query?opt=scene_monitoring&limit=${limit}`)).json()
}

export const dataResources: { [key: string]: InitializedResourceReturn<any, any> } = {
  lst: createResource(getLstS, dataFetches.$lst, { initialValue: [] }),
  scm: createResource(getscmS, dataFetches.$scm, { initialValue: [] }),
}

const $vulcano = atom('')
export const getVulcano = () => $vulcano.get()
export const setVulcano = (val: string) => $vulcano.set(val)
$vulcano.subscribe((val) => Object.values(dataResources).forEach(f => f[1].refetch()))

/* export const dataStores: {
  [key: string]: any
} = {
  lst: createStore<any>([]),
  scm: createStore<any>([]),
} */

