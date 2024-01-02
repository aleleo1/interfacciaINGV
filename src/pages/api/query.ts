//TODO:
/* 
npm i path, sqlite3
rimuovere commenti
*/

import sqlite3 from 'sqlite3';

import type { APIRoute } from "astro";

import fs from 'node:fs/promises';
import fetch from 'node-fetch'
import path from 'node:path'
const imageData = `CASE WHEN row_num = 1 THEN FALSE ELSE TRUE END AS empty,
'' as base64src,
350 as width,
450 as height,
'jpg' as format`
const data = `DATE("Date") AS x,
"Path" AS path, ROW_NUMBER() OVER (
    ORDER BY "Date"
) -1 i,`
const requests: { [key: string]: { query: (prec?: number) => string; } } = {
    'default': {
        query: (prec?: number) => `SELECT 
        ${data}
        CAST(ROUND(ABS(RANDOM()) * 0.00000000000000001) AS INTEGER) AS y,
    ${imageData}
    FROM (
        SELECT *,
        ROW_NUMBER() OVER (ORDER BY "Date") AS row_num
        FROM DATI
       ) d
        WHERE 'Cascading output' NOT LIKE "Cascading output"
        ORDER BY "Date"
        LIMIT 100 ${prec ? 'OFFSET ' + prec.toString() : ''}
        `
    },
    'scene_monitoring': {
        query: (prec?: number) => `
        SELECT 
    ${data}
    10 * DENSE_RANK() OVER (ORDER BY "Cascading output" COLLATE NOCASE) AS y,
    "Cascading output" AS ylabel,
${imageData}
    FROM (
        SELECT *,
        ROW_NUMBER() OVER (ORDER BY "Date") AS row_num
        FROM DATI
       ) d
WHERE 'Cascading output' NOT LIKE "Cascading output"
ORDER BY 
    "Date"
    LIMIT 100 ${prec ? 'OFFSET ' + prec.toString() : ''}
           `,
    },
    'vulcani': {
        query: () => ''
    }
}


export const GET: APIRoute = async (req) => {
    const param = req.url.searchParams && req.url.searchParams.get('opt')
    const limit = (req.url.searchParams && req.url.searchParams.get('limit')) ? (Number.parseInt(req.url.searchParams.get('limit')!)) : undefined
    const prec = limit && (limit > 1 ? ((limit - 1) * 100) + 99 : 0)

    if (param && param === 'vulcani') {
        console.log('FOUND VULCANI')
        return new Response(JSON.stringify([
            { name: 'Etna' },
            { name: 'Vesuvio' }
        ]), { status: 200 })
    }
    const { query } = param ? requests[param] : requests['default']

    try {
        const file = await (await fetch(req.url.origin + '/db/_INGV.db')).arrayBuffer()
        await fs.writeFile('/tmp/' + 'test.db', Buffer.from(file))
    } catch (err) {
        console.log(err)
    }
    const db = new sqlite3.Database('/tmp/' + 'test.db', (err) => {
        if (err) console.log(err)

    });
    const response = () => new Promise<any>((resolve, reject) => {

        db.on('open', () => {
            db.serialize(() => {
                db.all(query(prec), async (err, rows: any) => {
                    if (err) {
                        reject(err)
                        console.log(err)
                    }
                    if (rows && rows.length > 0) {
                        rows[0].base64src = await (await fetch(req.url.origin + '/api/image?img=' + rows[0].path)).text()
                    }
                    rows && resolve(rows)
                });
            });
        })
    })
    const res = await response();
    db.close();
    try {
        await fs.unlink(path.join(process.cwd(), 'test.db'))
    } catch (err) {
        /* console.log(err) */
    }
    return new Response(JSON.stringify(res), { status: 200 })


}
