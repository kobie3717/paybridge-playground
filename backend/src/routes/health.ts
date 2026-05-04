import { Router, type Router as ExpressRouter } from 'express';
import { isProviderEnabled } from '../config.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const healthRouter: ExpressRouter = Router();

healthRouter.get('/', (_req, res) => {
  const pkgPath = join(__dirname, '../../../node_modules/paybridge/package.json');
  let paybridgeVersion = 'unknown';
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    paybridgeVersion = pkg.version;
  } catch {
    paybridgeVersion = 'not-installed';
  }

  res.json({
    ok: true,
    paybridgeVersion,
    enabledProviders: {
      stripe: isProviderEnabled('stripe'),
      paystack: isProviderEnabled('paystack'),
      payfast: isProviderEnabled('payfast'),
      flutterwave: isProviderEnabled('flutterwave'),
      mollie: isProviderEnabled('mollie'),
    },
  });
});
