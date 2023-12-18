# SVILUPPO TESI INGV


Folders and files:

```text
/
├── public/
│   └── * public assets like images, logos*
├── src/
│   ├── components/
│   │   └── * Solid js components *
|             └── charts/
│               └── * various charts (barplot, pieplot), import from index.ts *
│   ├── layouts/
│   │   └── * Project's main layout *
│   └── pages/
│       └── * index.astro as only main page *
|           └── api (TOBE)/
│                └── * API functions *
└── package.json
```

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Condizione Attuale
L'applicazione mostra una demo di 2 grafici rappresentanti dati random caricati da https://jsonplaceholder.typicode.com/comments,
simulando la velocità di SolidJS nel rappresentare un'insieme di dati nell'UI.
Impostazione attuale:
---SSR
--- SOLIDJS client caricato appena possibile (client:load directive)


## Deploy
Deploy temporaneo su Vercel: interfaccia-ingv.vercel.app

