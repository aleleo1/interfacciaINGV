import { atom, map } from 'nanostores';
import { createStore } from 'solid-js/store';
import { createEffect, createResource, createSignal, on, type InitializedResourceReturn } from 'solid-js';
import type { Vulcano } from './components/context/context.types';


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
export const loadData = {
  lst: (val: number) => setLstS(val),
  scm: (val: number) => setscmS(val)
}

export const navigateData = {
  lst: (val: number) => setLstS(getLstS() + val > 1 ? getLstS() + val : 1),
  scm: (val: number) => setscmS(getscmS() + val > 1 ? getscmS() + val : 1)
}
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

