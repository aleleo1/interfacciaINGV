/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly IMGKIT_PUB: string;
    readonly IMGKIT_PRIV: string;
    readonly IMGKIT_URL: string;
    // more env variables...
}
interface ImportMeta {
    readonly env: ImportMetaEnv;
}