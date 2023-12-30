//TODO:
/* 
npm i path, sqlite3
rimuovere commenti
*/

import sqlite3 from 'sqlite3';

import * as d3 from 'd3'
import type { APIRoute } from "astro";

import fs from 'node:fs/promises';
import fetch from 'node-fetch'
import path from 'node:path'

const requests: { [key: string]: { query: (limit?: number, prec?: number) => string; build?: (row: any, i: number) => { x: string | Date | null, y: number, i: number, ylabel?: string } } } = {
    'default': {
        query: (limit?: number, prec?: number) => `SELECT 
        DATE("Date") AS x,
        '/images/S2/' || "Path" AS path,
        CAST(ROUND(ABS(RANDOM()) * 0.00000000000000001) AS INTEGER) AS y,
        ROW_NUMBER() OVER (
            ORDER BY "Date"
    ) -1 i 
    FROM 
        DATI
        WHERE 'Cascading output' NOT LIKE "Cascading output"
        ORDER BY "Date"
        LIMIT 100 ${prec ? 'OFFSET ' + prec.toString() : ''}
        `,
        build: (row, i) => (
            {
                x: row
                    ? (d3.isoParse((row['Date']))) : null,
                y: Math.round(Math.random() * 100),
                path: row ? '/images/S2/' + row['Path'] : null,
                i
            }
        )
    },
    'scene_monitoring': {
        query: (limit?: number, prec?: number) => `
        SELECT 
    DATE("Date") AS x,
    "Cascading output" AS ylabel,
    '/images/S2/' || "Path" AS path,
    10 * DENSE_RANK() OVER (ORDER BY "Cascading output" COLLATE NOCASE) AS y,
    ROW_NUMBER() OVER (
        ORDER BY "Date"
) -1 i
FROM 
    DATI
WHERE 'Cascading output' NOT LIKE "Cascading output"
ORDER BY 
    "Date"
    LIMIT 100 ${prec ? 'OFFSET ' + prec.toString() : ''}
           `,
        build: (row, i) => (
            {
                x: row
                    ? (d3.isoParse((row['Date']))) : null,
                y: row.y,
                ylabel: row['Cascading output'],
                path: row ? '/images/S2/' + row['Path'] : null,
                i
            }
        )
    },
    'vulcani': {
        query: () => ''
    }
}
/* WITH temp AS (
        SELECT "Cascading output" COLLATE NOCASE, COUNT(*) as count
        FROM 'DATI'
        GROUP BY "Cascading output" COLLATE NOCASE
    )
    SELECT * FROM temp
    UNION ALL
    SELECT 'Total', SUM(count) FROM temp; */


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
    console.log(req.url.searchParams, prec, query(limit, prec), process.cwd())

    try {
        const file = await (await fetch(req.url.origin + '/db/_INGV.db')).arrayBuffer()
        await fs.writeFile(/* path.join( *//* process.cwd() */'/tmp/'+ 'test.db'/* ) */, Buffer.from(file))
    } catch (err) {
        console.log(err)
    }
    const db = new sqlite3.Database(/* path.join( *//* process.cwd() */'/tmp/'+'test.db'/* ) */, (err) => {
        if (err) console.log(err)

    });
    const response = () => new Promise<any>((resolve, reject) => {

        db.on('open', () => {
            db.serialize(() => {
                db.all(query(limit, prec), (err, rows) => {
                    if (err) {
                        reject(err)
                        console.log(err)
                    }
                    rows && resolve(rows/* .map(build) */)
                });
            });
        })
    })
    const res = await response();
    db.close();
    try {
        await fs.unlink(path.join(process.cwd(), 'test.db'))
    } catch (err) {
        console.log(err)
    }
    return new Response(JSON.stringify(res), { status: 200 })


}
