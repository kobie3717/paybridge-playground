import { Check, X, AlertTriangle } from 'lucide-react';

const fiatProviders = [
  {
    name: 'SoftyComp',
    region: 'ZA',
    subscriptions: '✅',
    refunds: '✅',
    webhooks: '✅',
    status: 'Production',
  },
  {
    name: 'Yoco',
    region: 'ZA',
    subscriptions: '⛔',
    refunds: '✅',
    webhooks: '✅',
    status: 'Production',
  },
  {
    name: 'Ozow',
    region: 'ZA',
    subscriptions: '⛔',
    refunds: '⛔',
    webhooks: '✅',
    status: 'Production',
  },
  {
    name: 'PayFast',
    region: 'ZA',
    subscriptions: '✅',
    refunds: '✅',
    webhooks: '✅',
    status: 'Production',
  },
  {
    name: 'PayStack',
    region: 'Africa',
    subscriptions: '✅',
    refunds: '✅',
    webhooks: '✅',
    status: 'Production',
  },
  {
    name: 'Stripe',
    region: 'Global',
    subscriptions: '✅',
    refunds: '✅',
    webhooks: '✅',
    status: 'Production',
  },
  {
    name: 'Peach Payments',
    region: 'Africa',
    subscriptions: '⛔',
    refunds: '✅',
    webhooks: '✅',
    status: 'Production',
  },
  {
    name: 'Flutterwave',
    region: 'Africa',
    subscriptions: '✅',
    refunds: '✅',
    webhooks: '✅',
    status: 'Production',
  },
];

const cryptoProviders = [
  {
    name: 'MoonPay',
    onRamp: '✅',
    offRamp: '✅',
    quote: '✅',
    webhooks: '✅',
    status: 'Production',
  },
  {
    name: 'Yellow Card',
    onRamp: '⚠️',
    offRamp: '⚠️',
    quote: '⚠️',
    webhooks: '⚠️',
    status: 'Experimental',
  },
];

function StatusIcon({ value }: { value: string }) {
  if (value === '✅') return <Check className="w-5 h-5 text-green-400 mx-auto" />;
  if (value === '⛔') return <X className="w-5 h-5 text-gray-600 mx-auto" />;
  if (value === '⚠️') return <AlertTriangle className="w-5 h-5 text-yellow-400 mx-auto" />;
  return <span className="text-gray-400">{value}</span>;
}

export default function ProvidersComparison() {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Provider Comparison
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          8 fiat + 2 crypto providers, unified API. Switch providers with a single line of code.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Fiat Providers</h3>
          <div className="glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Provider
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Region
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Subscriptions
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Refunds
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Webhooks
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fiatProviders.map((provider, index) => (
                    <tr
                      key={provider.name}
                      className={index !== fiatProviders.length - 1 ? 'border-b border-white/5' : ''}
                    >
                      <td className="px-6 py-4 text-sm text-white font-semibold">
                        {provider.name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-brand-500/20 text-brand-300 rounded text-xs font-semibold">
                          {provider.region}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusIcon value={provider.subscriptions} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusIcon value={provider.refunds} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusIcon value={provider.webhooks} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                          {provider.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Crypto On/Off-Ramp Providers</h3>
          <div className="glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Provider
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      On-ramp
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Off-ramp
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Quote
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Webhooks
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cryptoProviders.map((provider, index) => (
                    <tr
                      key={provider.name}
                      className={index !== cryptoProviders.length - 1 ? 'border-b border-white/5' : ''}
                    >
                      <td className="px-6 py-4 text-sm text-white font-semibold">
                        {provider.name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusIcon value={provider.onRamp} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusIcon value={provider.offRamp} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusIcon value={provider.quote} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusIcon value={provider.webhooks} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          provider.status === 'Production'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {provider.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 glass rounded-lg max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Supported</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-gray-600" />
            <span>Not supported by API</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span>Experimental</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 glass rounded-lg max-w-4xl mx-auto">
        <p className="text-sm text-gray-400 text-center">
          <span className="text-brand-400 font-semibold">PayBridge</span> abstracts
          away provider differences, giving you a consistent API across all payment
          providers.
        </p>
      </div>
    </div>
  );
}
