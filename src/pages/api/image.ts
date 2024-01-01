import type { APIRoute } from "astro";
import ImageKit from "imagekit";

const toBase64 = (blob: ArrayBuffer) => (
    Buffer.from(blob).toString('base64')
)

export const GET: APIRoute = async (req) => {
    const pbk = import.meta.env.IMGKIT_PUB
    const pvk = import.meta.env.IMGKIT_PRIV
    const url = import.meta.env.IMGKIT_URL
    const badRes = new Response('error', { status: 500 })
    if (!pbk || !url || !pvk) {
        return badRes;
    }
    const src = req.url.searchParams.get('img')
        const getImageKit = new Promise<ImageKit>((resolve, reject) => {
            let ie;
            try {
                ie = new ImageKit({
                    publicKey: pbk,
                    privateKey: pvk,
                    urlEndpoint: url
                });
                resolve(ie)
            } catch (err) {
                console.log(err)
            }
        })
    
        const imagekit = await getImageKit
    

        const imageUrl = new Promise<string>((resolve, reject) => {
            try {
                const u = imagekit.url({
                    path: `/${src}`,
                    urlEndpoint: url,
                    transformation: [{
                        "height": "450",
                        "width": "350"
                    }]
                })
                resolve(u)
            } catch (err) {
                console.log(err)
            }
    
        })
    const base64 = toBase64(await (await fetch(await imageUrl)).arrayBuffer())
    return new Response('data:image/jpeg;base64,' + base64, { status: 200 })
}
