import type { Resource, Signal } from "solid-js";
/* ******************** DATA TYPES */
type DataType = any; // Replace with the actual type
type ElaborationType = any; // Replace with the actual type

export interface Functions {
    mutate: () => void;
    refetch: () => void;
    elaboration: () => ElaborationType;
}

export interface Signals {
    [key: string]: Signal<any> | Resource<any>;
}

export interface Resources {
    [key: string]: Resource<any>;
}

interface PropsProvider {
    signals: Signals;
    functions: Functions;
    resources: Resources;
}

type setR = (this: Provider, r: Resources) => (void)
type getR = (this: Provider) => Resources
type setS = (this: Provider, s: Signals) => (void)
type getS = (this: Provider) => Signals
type setF = (this: Provider, f: Functions) => (void)
type getF = (this: Provider) => Functions


interface ProviderFunctions {
    setR: setR;
    getR: getR;
    setS: setS;
    getS: getS;
    setF: setF;
    getF: getF;

}

export interface Provider extends PropsProvider, ProviderFunctions{}


/* ******************** CHART TYPES */
export type BarChartProps<T extends Record<string, any>> = {
    width: number
    height: number
    margin: number
    data: T[]
}

export type PieChartProps<T extends Record<string, any>> = {
    width: number
    height: number
    margin: number
    data: T[]
    label: keyof T
    value: (d: T) => number
}
