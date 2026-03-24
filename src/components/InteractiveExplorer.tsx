import { useState } from 'react';
import { Play, Copy, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { Provider, PaymentFormData } from '../types';
import CodePreview from './CodePreview';
import clsx from 'clsx';

interface InteractiveExplorerProps {
  provider: Provider;
}

export default function InteractiveExplorer({ provider }: InteractiveExplorerProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: '100.00',
    customerName: 'John Doe',
    email: 'john@example.com',
    phone: '0821234567',
    reference: 'ORDER-001',
  });

  const [isRunning, setIsRunning] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedResponse, setCopiedResponse] = useState(false);

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    setResponse(null);

    try {
      // Simulate API call (in production, this would go through a backend proxy)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful response
      const mockResponse = {
        success: true,
        paymentId: `PAY-${Date.now()}`,
        status: 'pending',
        amount: parseFloat(formData.amount),
        currency: 'ZAR',
        checkoutUrl: `https://checkout.softycompdistribution.co.za/pay/${Date.now()}`,
        reference: formData.reference,
        customer: {
          name: formData.customerName,
          email: formData.email,
          phone: formData.phone,
        },
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      };

      setResponse(mockResponse);
    } catch (err) {
      setError('Failed to create payment. In production, API calls run server-side to avoid CORS issues.');
    } finally {
      setIsRunning(false);
    }
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Panel - Form */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Payment Details</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount (ZAR)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="100.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Customer Name
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="0821234567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reference
            </label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => handleInputChange('reference', e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="ORDER-001"
            />
          </div>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className={clsx(
              'w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold transition-all',
              isRunning
                ? 'bg-brand-600 cursor-not-allowed'
                : 'bg-brand-500 hover:bg-brand-600 hover-lift'
            )}
          >
            <Play className={clsx('w-5 h-5', isRunning && 'animate-pulse')} />
            {isRunning ? 'Creating Payment...' : 'Run Payment'}
          </button>
        </div>
      </div>

      {/* Right Panel - Code & Response */}
      <div className="space-y-6">
        {/* Code Preview */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Code Preview</h3>
          <CodePreview formData={formData} provider={provider} language="typescript" />
        </div>

        {/* Response */}
        {(response || error) && (
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Response</h3>
              {response && (
                <button
                  onClick={copyResponse}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {copiedResponse ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {error ? (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-red-400 text-sm">{error}</div>
              </div>
            ) : (
              <div>
                <pre className="bg-black/40 rounded-lg p-4 overflow-x-auto text-sm">
                  <code className="text-gray-300">{JSON.stringify(response, null, 2)}</code>
                </pre>

                {response?.checkoutUrl && (
                  <div className="mt-4 p-4 bg-brand-500/10 border border-brand-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <ExternalLink className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-brand-400 font-semibold mb-1">
                          Checkout URL Ready
                        </div>
                        <div className="text-gray-400 text-sm mb-2">
                          Redirect your customer to this URL to complete payment:
                        </div>
                        <a
                          href={response.checkoutUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-300 text-sm break-all hover:underline"
                        >
                          {response.checkoutUrl}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
