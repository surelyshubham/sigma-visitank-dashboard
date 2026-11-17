# Sigma VisiTank Dashboard

A **web prototype for tank-inspection data exploration**, built with Next.js, React, and TypeScript. It brings spreadsheet import, inspection views, charts, and tank visualizations into one interface.

[Web preview](https://v0-sigma-visitank-dashboard.vercel.app) · [Developer profile](https://github.com/surelyshubham) · [Portfolio](https://www.surelyshubham.com)

## Scope and relationship to VisiTank

This repository contains the web dashboard prototype. The local **VisiTank Windows desktop application** is a separate private C#/.NET/WPF codebase with CAD editing, model-driven inspection workflows, document generation, and desktop licensing. This repository does not contain or distribute that desktop product.

The public prototype includes simulated role selection and sample historical data. It is useful for reviewing interface structure, spreadsheet processing, and visualization work; the role selector is not production authentication.

## Explore the implementation

| Area | Source | What it demonstrates |
| --- | --- | --- |
| Spreadsheet ingestion | [File upload zone](components/excel/file-upload-zone.tsx) | Browser-side XLS/XLSX/CSV parsing with SheetJS and inspection-data classification. |
| Analysis workspace | [Excel data analyzer](app/excel-data-analyzer/page.tsx) | Organizing imported data into preview, chart, historical, and tank-view workflows. |
| Visualizations | [Visualization components](components/visualization) | Interactive tank representations, color mapping, and React/Three.js rendering. |
| Role-oriented navigation | [Auth context](lib/auth-context.tsx) | Admin, staff, and client interface states backed by simulated users. |
| Inspection state | [Inspection data](lib/inspection-data.ts) | Shared in-memory inspection data for the prototype. |
| Historical examples | [Sample historical data](lib/mock-historical-data.ts) | Illustrative records for exploring comparisons; not evidence of an actual inspection. |

## Local development

Install a Node.js version compatible with Next.js 16 and pnpm. From this repository:

```sh
pnpm install
pnpm dev
```

Open `http://localhost:3000`. The repository also declares:

```sh
pnpm build
pnpm start
pnpm lint
```

These are the commands in `package.json`, not a claim that this documentation update ran them. The lint command requires an available compatible ESLint installation/configuration; ESLint is not explicitly declared in this repository's development dependencies.

## Current boundaries

- Authentication is simulated in React state. A role selection does not establish an authenticated or authorized server session.
- Sample data and charts are demonstrations. Do not interpret them as verified field measurements, predictions, or engineering acceptance results.
- The inspection store is in memory; do not assume durable storage or cross-user synchronization.
- Use synthetic or permitted data when exploring the public preview.

## Development provenance

The project was originally scaffolded and synchronized through [v0](https://v0.app). The original [v0 workspace](https://v0.app/chat/hjjhtQBJK1P) and [Vercel project dashboard](https://vercel.com/surelyshubhams-projects/v0-sigma-visitank-dashboard) may require owner access. The web-preview link above is the visitor-facing entry point.

Maintenance decisions and verification scope are recorded in [handsoff.md](handsoff.md).
