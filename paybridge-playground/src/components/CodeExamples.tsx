import { useState } from 'react';
import { Code2 } from 'lucide-react';
import type { Provider } from '../types';
import CodePreview from './CodePreview';
import clsx from 'clsx';

interface CodeExamplesProps {
  provider: Provider;
}

export default function CodeExamples({ provider }: CodeExamplesProps) {
  const [language, setLanguage] = useState<'typescript' | 'curl' | 'python'>('typescript');

  const mockFormData = {
    amount: '100.00',
    customerName: 'John Doe',
    email: 'john@example.com',
    phone: '0821234567',
    reference: 'ORDER-001',
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

        <div className="flex items-center gap-2 mb-6">
          {(['typescript', 'curl', 'python'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                language === lang
                  ? 'bg-brand-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300'
              )}
            >
              {lang === 'typescript' && 'TypeScript'}
              {lang === 'curl' && 'cURL'}
              {lang === 'python' && 'Python'}
            </button>
          ))}
        </div>

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
