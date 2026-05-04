import { useState } from 'react';
import { CheckCircle, Clock, Shield, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

type Attempt = {
  id: number;
  timestamp: string;
  status: 'processed' | 'duplicate';
  response: string;
};

export default function IdempotencySection() {
  const [withIdempotency, setWithIdempotency] = useState(true);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setAttempts([]);

    for (let i = 1; i <= 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const timestamp = new Date().toLocaleTimeString();

      setAttempts(prev => [
        ...prev,
        {
          id: i,
          timestamp,
          status: withIdempotency && i > 1 ? 'duplicate' : 'processed',
          response: withIdempotency && i > 1
            ? '200 OK (already processed)'
            : '200 OK (processed)'
        }
      ]);
    }

    setIsSimulating(false);
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Webhook Idempotency
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Prevent duplicate webhook processing when providers retry failed deliveries.
        </p>
      </div>

      <div className="glass rounded-xl p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-semibold text-white">Webhook Retry Simulation</h3>
          <button
            onClick={() => {
              setWithIdempotency(!withIdempotency);
              setAttempts([]);
            }}
            className={clsx(
              'relative inline-flex items-center h-8 w-16 rounded-full transition-colors',
              withIdempotency ? 'bg-brand-500' : 'bg-gray-600'
            )}
          >
            <span
              className={clsx(
                'inline-block h-6 w-6 transform rounded-full bg-white transition-transform',
                withIdempotency ? 'translate-x-9' : 'translate-x-1'
              )}
            />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6 p-4 bg-white/5 rounded-lg">
          <Shield className={clsx('w-5 h-5', withIdempotency ? 'text-brand-400' : 'text-gray-500')} />
          <div>
            <div className="font-medium text-white">
              {withIdempotency ? 'With Idempotency Store' : 'Without Idempotency Store'}
            </div>
            <div className="text-sm text-gray-400">
              {withIdempotency
                ? 'Duplicate webhooks are detected and ignored'
                : 'All webhooks are processed (risk of duplicates)'}
            </div>
          </div>
        </div>

        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          className={clsx(
            'w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold transition-all mb-6',
            isSimulating
              ? 'bg-brand-600 cursor-not-allowed'
              : 'bg-brand-500 hover:bg-brand-600 hover-lift'
          )}
        >
          <Clock className={clsx('w-5 h-5', isSimulating && 'animate-spin')} />
          {isSimulating ? 'Simulating Retries...' : 'Simulate Provider Retries'}
        </button>

        {attempts.length > 0 && (
          <div className="space-y-3 mb-6">
            <h4 className="text-sm font-semibold text-gray-300">Webhook Delivery Attempts</h4>
            {attempts.map((attempt) => (
              <div
                key={attempt.id}
                className={clsx(
                  'flex items-center gap-4 p-4 rounded-lg border-2',
                  attempt.status === 'processed'
                    ? 'border-green-500/20 bg-green-500/10'
                    : 'border-yellow-500/20 bg-yellow-500/10'
                )}
              >
                <div className="flex-shrink-0">
                  {attempt.status === 'processed' ? (
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">Attempt {attempt.id}</span>
                    <span className={clsx(
                      'text-xs font-mono px-2 py-1 rounded',
                      attempt.status === 'processed'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    )}>
                      {attempt.status === 'processed' ? 'PROCESSED' : 'DUPLICATE'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {attempt.timestamp} • {attempt.response}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!withIdempotency && attempts.length === 3 && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-red-400 font-semibold mb-1">
                  Duplicate Processing Warning
                </div>
                <div className="text-sm text-gray-400">
                  Without idempotency store, the same webhook was processed 3 times. This could lead to duplicate orders, double charges, or inconsistent data.
                </div>
              </div>
            </div>
          </div>
        )}

        {withIdempotency && attempts.length === 3 && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-green-400 font-semibold mb-1">
                  Protected from Duplicates
                </div>
                <div className="text-sm text-gray-400">
                  Idempotency store detected attempts 2 and 3 as duplicates. Only the first webhook was processed, preventing duplicate operations.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-black/40 rounded-lg">
          <div className="text-xs text-gray-500 font-mono mb-2">TypeScript</div>
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
      </div>
    </div>
  );
}
