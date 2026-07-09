# GitHub Top Languages Builder

Interactive builder for [gh-top-languages/api](https://github.com/gh-top-languages/api) — preview charts, customize settings, and generate embeddable URLs and Markdown snippets for GitHub READMEs and websites.

[![CI](https://github.com/gh-top-languages/builder/actions/workflows/ci.yml/badge.svg)](https://github.com/gh-top-languages/builder/actions/workflows/ci.yml)
![Node](https://img.shields.io/badge/Node.js-22+-green)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

![Example Page](images/page.png)

## Features
- Live chart preview with configurable theme, colours, type, count, size, and stroke
- Gap-fill mode selector (`gap`/`grow`/`adapt`) with a customizable gap colour
- Per-language colour customization
- Embed URL and markdown snippet generator for READMEs and websites

## Website
- [**gh-top-languages-builder**](https://masonletoile.ca/gh-top-languages-builder)

## Tech Stack
<p align="left">
  <img height="35" src="https://img.shields.io/badge/HTML5-%23E34F26?logo=html5&logoColor=white&style=for-the-badge"/>
  <img height="35" src="https://img.shields.io/badge/CSS3-%231572B6?logo=css3&logoColor=white&style=for-the-badge"/>
  <img height="35" src="https://img.shields.io/badge/TypeScript-%23007ACC?logo=typescript&logoColor=white&style=for-the-badge"/>
  <img height="35" src="https://img.shields.io/badge/Vite-%2300C0FF?logo=vite&logoColor=white&style=for-the-badge"/>
</p>

## Deployment & Configuration

### Prerequisites
- npm
- Node.js 22+

### 1. Clone the Repository
```bash
git clone https://github.com/gh-top-languages/builder.git
cd builder
npm install
```

### 2. Run Locally
```bash
npm run dev      # http://localhost:5173
npm run build    # Production Vite build
npm run preview  # Preview production build
```

## License
MIT License - see [LICENSE](./LICENSE) for details.
