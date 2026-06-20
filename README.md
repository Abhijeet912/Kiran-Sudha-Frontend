# Kiran Sudha — Frontend

> Heritage, reimagined. India's legacy fashion, reworked with a modern touch.

This repository hosts the frontend for **Kiran Sudha**, a fashion brand that brings
the traditional fashion of India's states to a modern storefront.

## Coming Soon page

A static launch / "coming soon" landing page built with plain **HTML + CSS** (plus a
small amount of vanilla JS for the notify form). It follows the Kiran Sudha design
system (v1.1, logo-aligned): the heritage ivory canvas, **Forest Green `#2C4727`** brand
colour with a **Vermilion `#CE3B33`** dot accent, and **Fraunces** display serif paired
with the **Jost** geometric sans.

| File | Purpose |
|------|---------|
| `index.html` | Page markup, fonts, and the notify-form script |
| `styles.css` | Design-system tokens and all page styling |

## Notify form (email signups)

The "Notify Me" form posts to **[FormSubmit](https://formsubmit.co)**, which forwards each
signup to **kiransudhaclothing@gmail.com** — no backend or API keys required, so it works
on Vercel's static hosting out of the box.

**One-time activation:** the *first* time the form is submitted on the live site,
FormSubmit emails a confirmation link to `kiransudhaclothing@gmail.com`. Click it once to
activate; after that every signup is delivered automatically.

> Privacy tip: the email is referenced in the page source. To hide it, create a FormSubmit
> alias (submit once, then use the `https://formsubmit.co/<alias>` URL they email you) and
> swap it into both the `<form action>` and the `ENDPOINT` constant in `index.html`.

## Deploy on Vercel

This is a static site — no build step.

1. Import the repo in Vercel (Framework Preset: **Other**).
2. Leave the build command empty; output directory is the repo root.
3. Deploy. `index.html` is served at `/`.

### Run locally

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Design tokens (excerpt)

```
ivory  #F8F3EA · paper #FFFFFF · panel #F2EADC
ink    #241C14 · ink-soft #7A6E5E · line #E6DCC9
forest #2C4727 (hover #3C5A34) · vermilion #CE3B33
gold   #AD863B · maroon #7E2E3B · success #2E6B4C
type   Fraunces (serif) + Jost (sans)
```
