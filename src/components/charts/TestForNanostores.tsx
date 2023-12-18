import { createEffect, createSignal, onCleanup } from 'solid-js';

import * as d3 from 'd3';
import { useData } from '../context/data.context.v2';

export default function Test() {

  const { test } = useData()!.getS()
  return (<div>{test[0]()}<button onclick={() => test[1](test[0]() as number + 1)}>update test</button></div>)
}
