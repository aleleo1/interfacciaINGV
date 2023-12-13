import { lazy } from "solid-js"

export const lazyImports = (...args: string[]) => (args.map(
    (arg) => (
        lazy(async () =>
        (
            await import('./charts/index').then((module: any) => ({ default: module[arg] }))
        )
        )
    )
))

