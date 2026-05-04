import { useState } from 'react';
import { Code2 } from 'lucide-react';
import type { Provider } from '../types';
import CodePreview from './CodePreview';
import clsx from 'clsx';

interface CodeExamplesProps {
  provider: Provider;
}

type ExampleTab = 'basic' | 'router' | 'crypto' | 'idempotency' | 'providers';

export default function CodeExamples({ provider }: CodeExamplesProps) {
  const [language, setLanguage] = useState<'typescript' | 'curl' | 'python'>('typescript');
  const [activeTab, setActiveTab] = useState<ExampleTab>('basic');

  const mockFormData = {
    amount: '100.00',
    customerName: 'John Doe',
    email: 'john@example.com',
    phone: '0821234567',
    reference: 'ORDER-001',
  };

  const renderExampleContent = () => {
    if (activeTab === 'router') {
      return (
        <div className="p-4 bg-black/40 rounded-lg">
          <pre className="text-sm text-gray-300 overflow-x-auto">
            <code>{`import { PayBridge, PayBridgeRouter } from 'paybridge';

const softycomp = new PayBridge({ provider: 'softycomp', credentials: {...}, sandbox: true });
const payfast = new PayBridge({ provider: 'payfast', credentials: {...}, sandbox: true });
const yoco = new PayBridge({ provider: 'yoco', credentials: {...}, sandbox: true });

const router = new PayBridgeRouter({
  providers: [
    { provider: softycomp, weight: 1 },
    { provider: payfast, weight: 1 },
    { provider: yoco, weight: 1 }
  ],
  strategy: 'cheapest',
  fallback: {
    enabled: true,
    maxAttempts: 3,
    retryDelayMs: 250
  }
});

const payment = await router.createPayment({
  amount: 299.00,
  currency: 'ZAR',
  reference: 'INV-001',
  customer: { name: 'John Doe', email: 'john@example.com' },
  urls: { success: '...', cancel: '...', webhook: '...' }
});

console.log(payment.routingMeta.chosenProvider);
console.log(payment.routingMeta.attempts);`}</code>
          </pre>
        </div>
      );
    }

    if (activeTab === 'crypto') {
      return (
        <div className="p-4 bg-black/40 rounded-lg">
          <pre className="text-sm text-gray-300 overflow-x-auto">
            <code>{`import { CryptoRamp } from 'paybridge';

const ramp = new CryptoRamp({
  provider: 'moonpay',
  credentials: {
    apiKey: process.env.MOONPAY_API_KEY,
    secretKey: process.env.MOONPAY_SECRET_KEY
  },
  sandbox: true
});

const onRamp = await ramp.onRamp({
  fiatAmount: 1000,
  fiatCurrency: 'ZAR',
  asset: 'USDT',
  network: 'Polygon',
  walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  urls: {
    success: 'https://myapp.com/success',
    cancel: 'https://myapp.com/cancel'
  }
});

console.log(onRamp.checkoutUrl);
console.log(onRamp.quote);`}</code>
          </pre>
        </div>
      );
    }

    if (activeTab === 'idempotency') {
      return (
        <div className="p-4 bg-black/40 rounded-lg">
          <pre className="text-sm text-gray-300 overflow-x-auto">
            <code>{`import { PayBridgeRouter, InMemoryIdempotencyStore, WebhookDuplicateError } from 'paybridge';

const router = new PayBridgeRouter({
  providers: [...],
  idempotencyStore: new InMemoryIdempotencyStore({ ttlMs: 86400000 })
});

app.post('/webhook', async (req, res) => {
  try {
    const event = await router.parseWebhook(req.body, req.headers, 'softycomp');

    switch (event.type) {
      case 'payment.completed':
        await processPayment(event.payment);
        break;
    }

    res.sendStatus(200);
  } catch (error) {
    if (error instanceof WebhookDuplicateError) {
      console.log('Duplicate webhook ignored:', error.eventId);
      return res.sendStatus(200);
    }
    throw error;
  }
});`}</code>
          </pre>
        </div>
      );
    }

    if (activeTab === 'providers') {
      return (
        <div className="space-y-4">
          {['stripe', 'payfast', 'paystack', 'peach', 'flutterwave'].map((prov) => (
            <div key={prov} className="p-4 bg-black/40 rounded-lg">
              <div className="text-xs text-brand-400 font-mono mb-2 capitalize">{prov}</div>
              <pre className="text-sm text-gray-300 overflow-x-auto">
                <code>{`const pay = new PayBridge({
  provider: '${prov}',
  credentials: {
    apiKey: process.env.${prov.toUpperCase()}_API_KEY${prov === 'stripe' ? '' : ','}${prov !== 'stripe' ? `\n    secretKey: process.env.${prov.toUpperCase()}_SECRET_KEY` : ''}
  },
  sandbox: true
});`}</code>
              </pre>
            </div>
          ))}
        </div>
      );
    }

    return <CodePreview formData={mockFormData} provider={provider} language={language} />;
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Code Examples
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Integration examples in multiple languages. Choose your preferred language and copy the code.
        </p>
      </div>

      <div className="glass rounded-xl p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Code2 className="w-6 h-6 text-brand-400" />
          <h3 className="text-xl font-semibold text-white">Full Integration Example</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          {(['basic', 'router', 'crypto', 'idempotency', 'providers'] as ExampleTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === tab
                  ? 'bg-brand-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300'
              )}
            >
              {tab === 'basic' && 'Basic Payment'}
              {tab === 'router' && 'Router'}
              {tab === 'crypto' && 'Crypto Ramp'}
              {tab === 'idempotency' && 'Idempotency'}
              {tab === 'providers' && 'All Providers'}
            </button>
          ))}
        </div>

        {activeTab === 'basic' && (
          <div className="flex items-center gap-2 mb-6">
            {(['typescript', 'curl', 'python'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  language === lang
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300'
                )}
              >
                {lang === 'typescript' && 'TypeScript'}
                {lang === 'curl' && 'cURL'}
                {lang === 'python' && 'Python'}
              </button>
            ))}
          </div>
        )}

        {renderExampleContent()}

        <CodePreview
          formData={mockFormData}
          provider={provider}
          language={language}
        />

        <div className="mt-6 p-4 bg-brand-500/10 border border-brand-500/20 rounded-lg">
          <h4 className="text-brand-400 font-semibold mb-2">Webhook Handler Example</h4>
          <pre className="bg-black/40 rounded-lg p-4 overflow-x-auto text-sm">
            <code className="text-gray-300">
              {language === 'typescript' &&
                `// Express.js webhook handler
app.post('/webhooks/payment', async (req, res) => {
  const event = req.body;

  // Verify webhook signature (recommended)
  const isValid = paybridge.verifyWebhook(
    req.headers['x-signature'],
    req.body
  );

  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  switch (event.type) {
    case 'payment.completed':
      // Update order status, send confirmation email
      await handleSuccessfulPayment(event.data);
      break;
    case 'payment.failed':
      // Handle failed payment
      await handleFailedPayment(event.data);
      break;
  }

  res.status(200).send('OK');
});`}
              {language === 'curl' &&
                `# Your webhook endpoint will receive POST requests
# with the following structure:

{
  "event": "payment.completed",
  "data": {
    "paymentId": "PAY-1234567890",
    "status": "completed",
    "amount": 100.00,
    "currency": "ZAR",
    "reference": "ORDER-001",
    "completedAt": "2024-01-15T10:30:00Z"
  }
}`}
              {language === 'python' &&
                `# Flask webhook handler
@app.route('/webhooks/payment', methods=['POST'])
def webhook_handler():
    event = request.json

    # Verify webhook signature (recommended)
    signature = request.headers.get('X-Signature')
    if not paybridge.verify_webhook(signature, request.data):
        return 'Invalid signature', 401

    if event['type'] == 'payment.completed':
        # Update order status, send confirmation email
        handle_successful_payment(event['data'])
    elif event['type'] == 'payment.failed':
        # Handle failed payment
        handle_failed_payment(event['data'])

    return 'OK', 200`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
