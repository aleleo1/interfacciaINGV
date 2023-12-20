import * as d3 from "d3"
export const marginTop = 20,
 marginRight = 20,
 marginBottom = 30,
 marginLeft = 40
export const DBW = 900,
    DBH = 300,
    PIEW = 110,
    PIEH = 110
export const DFBW =() => d3.scaleLinear([0, 50], [marginLeft, DBW - marginRight])
export const DFBH = () => d3.scaleLinear().range([DBH - marginBottom, 0]).domain([0, 120])
export const DFBWXS = () => d3.scaleBand().range([marginLeft, DBW - marginRight]).padding(0.8).domain([])