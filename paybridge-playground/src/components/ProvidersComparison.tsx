import { Check, X } from 'lucide-react';

const providers = [
  {
    name: 'SoftyComp',
    status: 'Available',
    features: {
      'Card Payments': true,
      'EFT': true,
      'Instant Settlement': false,
      'SA Based': true,
      'Webhook Support': true,
      'Test Mode': true,
    },
  },
  {
    name: 'Yoco',
    status: 'Coming Soon',
    features: {
      'Card Payments': true,
      'EFT': false,
      'Instant Settlement': true,
      'SA Based': true,
      'Webhook Support': true,
      'Test Mode': true,
    },
  },
  {
    name: 'Ozow',
    status: 'Coming Soon',
    features: {
      'Card Payments': false,
      'EFT': true,
      'Instant Settlement': true,
      'SA Based': true,
      'Webhook Support': true,
      'Test Mode': true,
    },
  },
];

export default function ProvidersComparison() {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Provider Comparison
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          All providers, unified API. Switch providers with a single line of code.
        </p>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                  Feature
                </th>
                {providers.map((provider) => (
                  <th key={provider.name} className="px-6 py-4 text-center">
                    <div className="text-white font-semibold mb-1">
                      {provider.name}
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full inline-block ${
                        provider.status === 'Available'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {provider.status}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(providers[0].features).map((feature, index) => (
                <tr
                  key={feature}
                  className={index !== Object.keys(providers[0].features).length - 1 ? 'border-b border-white/5' : ''}
                >
                  <td className="px-6 py-4 text-sm text-gray-300 font-medium">
                    {feature}
                  </td>
                  {providers.map((provider) => (
                    <td key={provider.name} className="px-6 py-4 text-center">
                      {provider.features[feature as keyof typeof provider.features] ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 p-4 glass rounded-lg max-w-4xl mx-auto">
        <p className="text-sm text-gray-400 text-center">
          <span className="text-brand-400 font-semibold">PayBridge</span> abstracts
          away provider differences, giving you a consistent API across all payment
          providers.
        </p>
      </div>
    </div>
  );
}
