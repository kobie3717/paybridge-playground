# PayBridge Playground

**Live, working demo of [paybridge](https://github.com/kobie3717/paybridge).**

Try real payment flows in your browser — no signup, no keys to paste. Click a button, get a real Stripe / PayStack / PayFast / Flutterwave / Mollie checkout URL, complete it with a test card.

## Live demo

[paybridge-playground.fly.dev](https://paybridge-playground.fly.dev) (coming soon)

## How it works

- Frontend: Vite + React + TypeScript SPA
- Backend: Express + TypeScript, uses paybridge npm package directly
- Provider creds: stored as env vars on the host. Visitor never pastes keys.
- Rate limit: 30 demo calls per IP per minute (configurable)

## Self-host

Want to run your own playground with your own sandbox keys? It's a 5-minute setup.

```bash
git clone https://github.com/kobie3717/paybridge-playground
cd paybridge-playground
npm install
cp .env.example .env
# Edit .env with your own sandbox credentials
npm run dev:backend   # starts Express on :3000
npm run dev:frontend  # starts Vite on :5173 (proxies /api/* to :3000)
```

## Deploy

Fly.io:

```bash
fly launch --copy-config --no-deploy
fly secrets set DEMO_STRIPE_API_KEY=sk_test_...
fly secrets set DEMO_PAYSTACK_API_KEY=sk_test_...
# ... etc
fly deploy
```

## Architecture

```
Visitor (browser)
       │
       ▼
Vite SPA  ───────fetch('/api/demo/...')──────▶  Express backend
                                                        │
                                                        ▼
                                                  paybridge SDK
                                                        │
                                                        ▼
                                              Real provider APIs
```

The backend is the only place provider creds live.

## License

MIT.
