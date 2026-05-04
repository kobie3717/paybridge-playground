# PayBridge Playground 🌉

> Interactive payment playground — test PayBridge 0.3.0 providers live. One API, every payment provider.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://kobie3717.github.io/paybridge-playground)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Features

- **Interactive Payment Forms** — Test payment flows with real-time code preview
- **8 Fiat + 2 Crypto Providers** — SoftyComp, Yoco, Ozow, PayFast, PayStack, Stripe, Peach, Flutterwave, MoonPay, Yellow Card
- **Multi-Provider Router** — Visualize routing strategies (cheapest, fastest, priority, round-robin) with automatic failover
- **Crypto On/Off-Ramp** — Simulate fiat-to-crypto and crypto-to-fiat flows with live quotes
- **Webhook Idempotency** — Interactive demo showing duplicate detection and prevention
- **Code Examples** — TypeScript, cURL, Python examples with copy-to-clipboard
- **Webhook Simulator** — Test webhook events in real-time
- **Test Cards** — Sandbox test cards for each provider
- **Provider Comparison** — Feature matrix across all supported providers

## Tech Stack

- **React 19** + TypeScript
- **Vite 8** — Lightning-fast build tool
- **Tailwind CSS 4** — Utility-first styling
- **Lucide React** — Beautiful icons
- **Prism React Renderer** — Syntax highlighting

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This playground is automatically deployed to GitHub Pages on every push to `main`.

### Manual Deployment

```bash
npm run build
# Upload the `dist/` directory to your hosting provider
```

## Related Projects

- [**PayBridge**](https://github.com/kobie3717/paybridge) — Unified payment SDK for Node.js
- [**softycomp-node**](https://github.com/kobie3717/softycomp-node) — Official SoftyComp SDK
- [**WaSP**](https://github.com/kobie3717/wasp) — Unified WhatsApp API

## License

MIT © [Kobus van Schoor](https://github.com/kobie3717)

---

**Built with ❤️ in South Africa 🇿🇦**

