import { createEffect, createSignal, onCleanup } from 'solid-js';

import * as d3 from 'd3';

export default function LineChart() {

  const [data, setData] = createSignal([]);
  const [width, setWidth] = createSignal(640);
  const [height, setHeight] = createSignal(400);
  const [marginTop, setMarginTop] = createSignal(20);
  const [marginRight, setMarginRight] = createSignal(20);
  const [marginBottom, setMarginBottom] = createSignal(30);
  const [marginLeft, setMarginLeft] = createSignal(40);
  const [gx, setGx] = createSignal()
  const [gy, setGy] = createSignal()
  const x = () => d3.scaleLinear([0, data().length - 1], [marginLeft(), width() - marginRight()]), 
  y = () => (d3.scaleLinear().range([height(), 0]).domain([0, d3.max(data(), d => d.comments) * 1.1])),
  //y = () => d3.scaleLinear(d3.extent(data()), [height() - marginBottom(), marginTop()]), 
  line = () => d3.line((d, i) => x()(i), y());

  return (
    <svg width={width()} height={height()}>
      <g ref={setGx} transform={`translate(0,${height() - marginBottom()})`} />
      <g ref={setGy} transform={`translate(${marginLeft()},0)`} />
      <path fill="none" stroke="currentColor" stroke-width="1.5" d={line()(data())} />
      <g fill="white" stroke="currentColor" stroke-width="1.5">
        {data().map((d, i) => (
          <circle key={i} cx={x()(i)} cy={y()(d)} r="2.5" />
        ))}
      </g>
    </svg>)
}
