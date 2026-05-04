import { useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, CheckCircle, XCircle, Zap, DollarSign, List, ArrowUpDown } from 'lucide-react';
import type { RoutingStrategy } from '../types';
import clsx from 'clsx';

const providers = [
  { id: 'softycomp', name: 'SoftyComp', fee: 2.5, latency: 450, color: 'blue' },
  { id: 'payfast', name: 'PayFast', fee: 2.9, latency: 320, color: 'green' },
  { id: 'yoco', name: 'Yoco', fee: 2.95, latency: 280, color: 'purple' },
  { id: 'stripe', name: 'Stripe', fee: 2.9, latency: 180, color: 'indigo' },
];

const strategyIcons: Record<RoutingStrategy, LucideIcon> = {
  cheapest: DollarSign,
  fastest: Zap,
  priority: List,
  'round-robin': ArrowUpDown,
};

export default function RouterDemo() {
  const [strategy, setStrategy] = useState<RoutingStrategy>('cheapest');
  const [selectedProvider, setSelectedProvider] = useState<string>('softycomp');
  const [showAttempts, setShowAttempts] = useState(false);
  const rrIndex = useRef(0);

  const handleStrategyChange = (newStrategy: RoutingStrategy) => {
    setStrategy(newStrategy);
    setShowAttempts(false);

    let chosen = 'softycomp';
    if (newStrategy === 'cheapest') {
      chosen = providers.reduce((min, p) => p.fee < min.fee ? p : min).id;
    } else if (newStrategy === 'fastest') {
      chosen = providers.reduce((min, p) => p.latency < min.latency ? p : min).id;
    } else if (newStrategy === 'priority') {
      chosen = providers[0].id;
    } else {
      chosen = providers[rrIndex.current % providers.length].id;
      rrIndex.current = (rrIndex.current + 1) % providers.length;
    }
    setSelectedProvider(chosen);

    setTimeout(() => setShowAttempts(true), 300);
  };

  const Icon = strategyIcons[strategy];

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Multi-Provider Router
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Route payments across multiple providers with automatic failover and circuit breakers.
        </p>
      </div>

      <div className="glass rounded-xl p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Select Routing Strategy</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['cheapest', 'fastest', 'priority', 'round-robin'] as RoutingStrategy[]).map((s) => {
              const StrategyIcon = strategyIcons[s];
              return (
                <button
                  key={s}
                  onClick={() => handleStrategyChange(s)}
                  className={clsx(
                    'flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all',
                    strategy === s
                      ? 'bg-brand-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300'
                  )}
                >
                  <StrategyIcon className="w-4 h-4" />
                  <span className="capitalize">{s}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-brand-500/20 border border-brand-500/30 rounded-lg">
                <code className="text-brand-300 font-mono text-sm">createPayment(R299)</code>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                <Icon className="w-4 h-4 text-purple-300" />
                <span className="text-purple-300 text-sm font-medium capitalize">{strategy} Router</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className={clsx(
                  'relative p-4 rounded-lg border-2 transition-all',
                  selectedProvider === provider.id
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-white/10 bg-white/5'
                )}
              >
                {selectedProvider === provider.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="font-semibold text-white text-sm mb-2">{provider.name}</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1 text-gray-400">
                    <DollarSign className="w-3 h-3" />
                    <span>{provider.fee}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Zap className="w-3 h-3" />
                    <span>{provider.latency}ms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className={clsx(
              'w-6 h-6 text-green-500 transition-all',
              showAttempts && 'animate-pulse'
            )} />
          </div>

          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="font-semibold text-green-400">Payment Routed</span>
            </div>
            <div className="text-sm text-gray-300">
              Selected provider: <span className="text-white font-mono">{providers.find(p => p.id === selectedProvider)?.name}</span>
            </div>
          </div>
        </div>

        {showAttempts && (
          <div className="mb-8 p-4 bg-white/5 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Routing Metadata</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white font-medium">{providers.find(p => p.id === selectedProvider)?.name}</span>
                    <span className="text-xs text-green-400">SUCCESS</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Attempt 1 • {providers.find(p => p.id === selectedProvider)?.latency}ms
                  </div>
                </div>
              </div>

              {strategy === 'priority' && (
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg opacity-50">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white font-medium">PayFast</span>
                      <span className="text-xs text-red-400">RATE_LIMITED</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Attempt 0 (skipped) • Fallback triggered
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="p-4 bg-black/40 rounded-lg">
          <div className="text-xs text-gray-500 font-mono mb-2">TypeScript</div>
          <pre className="text-sm text-gray-300 overflow-x-auto">
            <code>{`import { PayBridge, PayBridgeRouter } from 'paybridge';

const softycomp = new PayBridge({ provider: 'softycomp', ... });
const payfast = new PayBridge({ provider: 'payfast', ... });
const yoco = new PayBridge({ provider: 'yoco', ... });
const stripe = new PayBridge({ provider: 'stripe', ... });

const router = new PayBridgeRouter({
  providers: [
    { provider: softycomp, weight: 1 },
    { provider: payfast, weight: 1 },
    { provider: yoco, weight: 1 },
    { provider: stripe, weight: 1 }
  ],
  strategy: '${strategy}',
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

console.log(payment.routingMeta.chosenProvider); // "${selectedProvider}"
console.log(payment.routingMeta.attempts);`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
