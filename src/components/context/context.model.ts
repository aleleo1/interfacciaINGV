import type { Signal } from 'solid-js';
import type {Provider as P, Signals, Resources, Functions} from './context.types'

export class Provider implements P {
    constructor(signals: Signals, resources: Resources, functions: Functions, ...args: any[]) {
        this.setS(signals);
        this.setF(functions);
        this.setR(resources);
    }

    setR = (r) => { this.resources = r }
    getR = () => { return { ...this.resources } }
    setS = (s) => { this.signals = s }
    getS = () => { return { ...this.signals } }
    setF = (f) => { this.functions = f }
    getF = () => { return { ...this.functions } }

    signals!: Signals;
    functions!: Functions;
    resources!: Resources;
}