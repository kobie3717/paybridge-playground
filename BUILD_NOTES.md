# Build Notes

## Current Status

The React + TypeScript playground is built with Vite 8, React 19, and Tailwind CSS 4.

### Known Issue

There is a dependency installation issue where `vite` package doesn't install properly via npm despite being in package.json. This appears to be an environment-specific npm issue.

### Workaround Options

1. **Deploy pre-built dist/** — Build locally on a working machine and deploy the dist folder
2. **Use different package manager** — Try pnpm or yarn instead of npm
3. **Use GitHub Actions** — Let GitHub Actions CI/CD handle the build (recommended)

## GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

This will build and deploy automatically on every push to main.

## Manual Build (if needed)

If npm works in a different environment:

```bash
npm install
npm run build
# dist/ folder is ready for deployment
```

## Alternative: Static HTML Version

If the React build continues to have issues, we can create a pure HTML/CSS/JS version with no build step required. The playground would still be fully functional but without the React framework overhead.
