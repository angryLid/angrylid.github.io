# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern static website built with Astro, deployed to GitHub Pages. The project has been cleaned of all Jekyll-related content and now uses a pure Astro setup for optimal performance and development experience.

## Development Commands

```bash
# Start development server
npm run dev

# Build static site for production
npm run build

# Preview production build locally
npm run preview
```

## Architecture

### Project Structure
- `src/pages/` - Astro page components and routing
  - `index.astro` - Main page component with Astro syntax, frontmatter code execution, and inline styling
- `astro.config.mjs` - Astro configuration file (currently minimal)
- `tsconfig.json` - TypeScript configuration extending Astro's base config
- `.nojekyll` - Disables Jekyll processing on GitHub Pages

### Key Features
- **Static Site Generation**: Astro generates fast, static HTML/CSS/JS
- **Component-Based**: Uses Astro's component system with frontmatter code execution
- **TypeScript Support**: Configured with TypeScript extensions
- **GitHub Pages Ready**: Configured for automatic deployment with .nojekyll file

### Development Workflow
1. Run `npm run dev` for local development with hot reload
2. Run `npm run build` to create production build in `dist/`
3. Deploy the `dist/` directory to GitHub Pages

## Configuration Notes

- Astro configuration uses default settings with minimal customization
- TypeScript is configured but not actively used in current setup
- The site uses inline CSS rather than external stylesheets
- No additional layouts or components beyond the main page currently exist

## GitHub Pages Deployment

The project includes a `.nojekyll` file to disable GitHub's Jekyll processing, ensuring Astro-generated static files are served directly. The CNAME file suggests custom domain configuration.