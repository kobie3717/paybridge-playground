import { Router, type Router as ExpressRouter } from 'express';
import { PayBridge, PayBridgeRouter } from 'paybridge';
import { config, isProviderEnabled } from '../config.js';
import { rateLimit } from '../lib/rate-limit.js';

export const demoRouter: ExpressRouter = Router();

demoRouter.use(rateLimit(config.rateLimit.perMinute));

function getBaseUrl(req: any): string {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
  return `${protocol}://${host}`;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

demoRouter.post('/create-payment', async (req, res) => {
  const { provider, amount, currency, customerEmail } = req.body;

  if (!provider || typeof provider !== 'string') {
    return res.status(400).json({ error: 'missing_provider', message: 'Provider is required' });
  }

  if (!amount || typeof amount !== 'number' || amount <= 0 || amount > 1000) {
    return res.status(400).json({ error: 'invalid_amount', message: 'Amount must be between 0 and 1000' });
  }

  if (!currency || typeof currency !== 'string' || currency.length !== 3) {
    return res.status(400).json({ error: 'invalid_currency', message: 'Currency must be 3-letter code' });
  }

  if (!customerEmail || typeof customerEmail !== 'string' || !validateEmail(customerEmail)) {
    return res.status(400).json({ error: 'invalid_email', message: 'Valid email is required' });
  }

  const supportedProviders = ['stripe', 'paystack', 'payfast', 'flutterwave', 'mollie'] as const;
  if (!supportedProviders.includes(provider as any)) {
    return res.status(400).json({
      error: 'unsupported_provider',
      message: `Provider must be one of: ${supportedProviders.join(', ')}`,
    });
  }

  if (!isProviderEnabled(provider as any)) {
    return res.status(503).json({
      error: 'provider_not_configured',
      message: `Provider ${provider} is not configured with credentials`,
    });
  }

  try {
    let pay: PayBridge;

    if (provider === 'stripe') {
      pay = new PayBridge({
        provider: 'stripe',
        credentials: { apiKey: config.stripe.apiKey! },
        sandbox: true,
      });
    } else if (provider === 'paystack') {
      pay = new PayBridge({
        provider: 'paystack',
        credentials: { apiKey: config.paystack.apiKey! },
        sandbox: true,
      });
    } else if (provider === 'payfast') {
      pay = new PayBridge({
        provider: 'payfast',
        credentials: {
          merchantId: config.payfast.merchantId!,
          merchantKey: config.payfast.merchantKey!,
          passphrase: config.payfast.passphrase,
        },
        sandbox: true,
      });
    } else if (provider === 'flutterwave') {
      pay = new PayBridge({
        provider: 'flutterwave',
        credentials: { apiKey: config.flutterwave.apiKey! },
        sandbox: true,
      });
    } else if (provider === 'mollie') {
      pay = new PayBridge({
        provider: 'mollie',
        credentials: { apiKey: config.mollie.apiKey! },
        sandbox: true,
      });
    } else {
      return res.status(400).json({ error: 'invalid_provider' });
    }

    const baseUrl = getBaseUrl(req);
    const reference = `demo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const payment = await pay.createPayment({
      amount,
      currency: currency.toUpperCase(),
      reference,
      customer: {
        name: 'Demo Visitor',
        email: 'paybridge-sandbox@gmail.com',
      },
      urls: {
        success: `${baseUrl}/demo/success`,
        cancel: `${baseUrl}/demo/cancel`,
        webhook: `${baseUrl}/api/demo/webhook-noop`,
      },
    });

    res.json({
      provider: payment.provider,
      id: payment.id,
      checkoutUrl: payment.checkoutUrl,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      reference: payment.reference,
    });
  } catch (err: any) {
    console.error('Payment creation error:', err);
    res.status(500).json({
      error: 'payment_failed',
      message: err.message || 'Failed to create payment',
    });
  }
});

demoRouter.post('/router-demo', async (req, res) => {
  const { amount, currency, strategy } = req.body;

  if (!amount || typeof amount !== 'number' || amount <= 0 || amount > 1000) {
    return res.status(400).json({ error: 'invalid_amount', message: 'Amount must be between 0 and 1000' });
  }

  if (!currency || typeof currency !== 'string' || currency.length !== 3) {
    return res.status(400).json({ error: 'invalid_currency', message: 'Currency must be 3-letter code' });
  }

  const validStrategies = ['cheapest', 'fastest', 'priority', 'round-robin'];
  if (!strategy || !validStrategies.includes(strategy)) {
    return res.status(400).json({
      error: 'invalid_strategy',
      message: `Strategy must be one of: ${validStrategies.join(', ')}`,
    });
  }

  const enabledProviders = [];
  if (isProviderEnabled('stripe')) {
    enabledProviders.push(
      new PayBridge({
        provider: 'stripe',
        credentials: { apiKey: config.stripe.apiKey! },
        sandbox: true,
      })
    );
  }
  if (isProviderEnabled('paystack')) {
    enabledProviders.push(
      new PayBridge({
        provider: 'paystack',
        credentials: { apiKey: config.paystack.apiKey! },
        sandbox: true,
      })
    );
  }
  if (isProviderEnabled('payfast')) {
    enabledProviders.push(
      new PayBridge({
        provider: 'payfast',
        credentials: {
          merchantId: config.payfast.merchantId!,
          merchantKey: config.payfast.merchantKey!,
          passphrase: config.payfast.passphrase,
        },
        sandbox: true,
      })
    );
  }
  if (isProviderEnabled('flutterwave')) {
    enabledProviders.push(
      new PayBridge({
        provider: 'flutterwave',
        credentials: { apiKey: config.flutterwave.apiKey! },
        sandbox: true,
      })
    );
  }
  if (isProviderEnabled('mollie')) {
    enabledProviders.push(
      new PayBridge({
        provider: 'mollie',
        credentials: { apiKey: config.mollie.apiKey! },
        sandbox: true,
      })
    );
  }

  if (enabledProviders.length < 2) {
    return res.status(503).json({
      error: 'insufficient_providers',
      message: `Router demo requires at least 2 providers configured. Currently: ${enabledProviders.length}`,
    });
  }

  try {
    const router = new PayBridgeRouter({
      providers: enabledProviders.map((p) => ({ provider: p, weight: 1 })),
      strategy: strategy as any,
      fallback: {
        enabled: true,
        maxAttempts: 3,
        retryDelayMs: 250,
      },
    });

    const baseUrl = getBaseUrl(req);
    const reference = `router-demo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const result = await router.createPayment({
      amount,
      currency: currency.toUpperCase(),
      reference,
      customer: {
        name: 'Demo Visitor',
        email: 'paybridge-sandbox@gmail.com',
      },
      urls: {
        success: `${baseUrl}/demo/success`,
        cancel: `${baseUrl}/demo/cancel`,
        webhook: `${baseUrl}/api/demo/webhook-noop`,
      },
    });

    res.json({
      chosenProvider: result.provider,
      checkoutUrl: result.checkoutUrl,
      routingMeta: result.routingMeta,
      attempts: result.routingMeta?.attempts,
    });
  } catch (err: any) {
    console.error('Router demo error:', err);
    res.status(500).json({
      error: 'routing_failed',
      message: err.message || 'Failed to route payment',
    });
  }
});

const driftCache: { lastCheckedAt: string; results: any[] } | null = null;

demoRouter.get('/drift-status', async (_req, res) => {
  if (driftCache && Date.now() - new Date(driftCache.lastCheckedAt).getTime() < 6 * 60 * 60 * 1000) {
    return res.json(driftCache);
  }

  const results = [];
  const providers: Array<'stripe' | 'paystack' | 'payfast' | 'flutterwave' | 'mollie'> = [
    'stripe',
    'paystack',
    'payfast',
    'flutterwave',
    'mollie',
  ];

  for (const provider of providers) {
    if (!isProviderEnabled(provider)) {
      results.push({ provider, skipped: true });
    } else {
      results.push({ provider, drift: false });
    }
  }

  const response = {
    lastCheckedAt: new Date().toISOString(),
    results,
  };

  res.json(response);
});

demoRouter.post('/webhook-noop', (_req, res) => {
  res.sendStatus(200);
});
