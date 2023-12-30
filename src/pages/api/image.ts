//TODO:
/* 
npm i path, sqlite3
rimuovere commenti
*/

import type { APIRoute } from "astro";


/* WITH temp AS (
        SELECT "Cascading output" COLLATE NOCASE, COUNT(*) as count
        FROM 'DATI'
        GROUP BY "Cascading output" COLLATE NOCASE
    )
    SELECT * FROM temp
    UNION ALL
    SELECT 'Total', SUM(count) FROM temp; */
const toBase64 = (blob: ArrayBuffer) => (
    Buffer.from(blob).toString('base64')
)

export const GET: APIRoute = async (req) => {
    const img = req.url.origin + req.url.searchParams.get('img')
    const base64 = toBase64(await (await fetch(img!)).arrayBuffer())
    return new Response('data:image/jpeg;base64,' + base64, { status: 200 })
}
