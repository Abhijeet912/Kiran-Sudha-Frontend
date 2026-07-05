# Kiran Sudha — Storefront

The customer-facing storefront for **Kiran Sudha**, a fashion brand that brings
traditional fashion from the states of India — Chikankari, Bandhani, Phulkari
and more — with a modern touch.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router, `src/` directory, JavaScript)
- [Tailwind CSS v4](https://tailwindcss.com) with Kiran Sudha design tokens
  (Forest Green `#2C4727`, Vermilion `#CE3B33`, warm ivory canvas, Fraunces + Jost)
- ESLint 9 (`eslint-config-next`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in the browser.

The storefront talks to the Spring Boot backend at `http://localhost:8080`
(see the KiranSudha API documentation for endpoint contracts).

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start the dev server       |
| `npm run build` | Production build           |
| `npm run start` | Serve the production build |
| `npm run lint`  | Lint with ESLint           |

## Branches

- `main` — stable
- `development` — active work happens here
