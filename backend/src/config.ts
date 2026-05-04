export const config = {
  port: Number(process.env.PORT ?? 3000),

  stripe: {
    apiKey: process.env.DEMO_STRIPE_API_KEY,
  },
  paystack: {
    apiKey: process.env.DEMO_PAYSTACK_API_KEY,
    currency: process.env.DEMO_PAYSTACK_CURRENCY ?? 'ZAR',
  },
  payfast: {
    merchantId: process.env.DEMO_PAYFAST_MERCHANT_ID,
    merchantKey: process.env.DEMO_PAYFAST_MERCHANT_KEY,
    passphrase: process.env.DEMO_PAYFAST_PASSPHRASE,
  },
  flutterwave: {
    apiKey: process.env.DEMO_FLUTTERWAVE_API_KEY,
  },
  mollie: {
    apiKey: process.env.DEMO_MOLLIE_API_KEY,
  },

  rateLimit: {
    perMinute: Number(process.env.DEMO_RATE_LIMIT_PER_MINUTE ?? 30),
  },
} as const;

export function isProviderEnabled(provider: 'stripe' | 'paystack' | 'payfast' | 'flutterwave' | 'mollie'): boolean {
  switch (provider) {
    case 'stripe':
      return !!config.stripe.apiKey;
    case 'paystack':
      return !!config.paystack.apiKey;
    case 'payfast':
      return !!(config.payfast.merchantId && config.payfast.merchantKey);
    case 'flutterwave':
      return !!config.flutterwave.apiKey;
    case 'mollie':
      return !!config.mollie.apiKey;
  }
}
