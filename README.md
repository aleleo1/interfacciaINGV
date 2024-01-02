# SVILUPPO TESI INGV


Folders and files:

```text
/
├── public/
│   └── * public assets like images, logos*
├── src/
│   ├── components/
│   │   └── * Solid js components files.tsx *
|   |         └── charts/
│   |           └── * various charts (barplot, pieplot), import from index.ts *
|   |         └── context/
│   |           └── * data.context for handling local data and images *
│   |         └── * Astro components  files.astro as containers for the plots* 
│   ├── layouts/
│   │   └── * Project's main layout *
│   └── pages/
│   |   └── * index.astro as only main page *
|   |       └── api /
│   |            └── * query.ts as query runner * 
│   |            └── * image.ts to get the images from imagekit * 
│   └── store.ts for handling data resources (general data) and filters
└── package.json
```

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Condizione Attuale
L'applicazione mostra una demo di vari grafici rappresentanti dati caricati dal file csv _data.csv, precaricarcati in _INGV.db e sfrutando SQLITE, simulo una query a db che restituisce i dato semi-pronti per la rappresentazione grafica.
Il client SolidJS renderizza i grafici individualmente, caricando copie di dati nel proprio DataContext, e quindi genera grafici indipendenti e navigabili.
Le immagini sono restituite dall'api image che estrae la base64 string dell'immagine
Impostazione attuale:
---SSR
--- SOLIDJS client caricato appena possibile


## Deploy
Deploy temporaneo su Vercel: interfaccia-ingv.vercel.app