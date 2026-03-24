import { CreditCard } from 'lucide-react';
import { Provider, TestCard } from '../types';

interface TestCardsProps {
  provider: Provider;
}

const testCardsByProvider: Record<Provider, TestCard[]> = {
  softycomp: [
    {
      number: '4790 4444 4444 4444',
      description: 'Successful payment',
      expectedResult: 'success',
    },
    {
      number: '4790 3333 3333 3333',
      description: 'Failed payment - Insufficient funds',
      expectedResult: 'failed',
    },
  ],
  yoco: [],
  ozow: [],
};

export default function TestCards({ provider }: TestCardsProps) {
  const cards = testCardsByProvider[provider];

  if (cards.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
        Test Cards
      </h2>
      <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
        Use these test card numbers in the SoftyComp sandbox environment.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            className="glass rounded-xl p-6 hover-lift transition-all"
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  card.expectedResult === 'success'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                <CreditCard className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-mono text-xl text-white mb-2 font-semibold">
                  {card.number}
                </div>
                <div className="text-gray-400 text-sm mb-3">
                  {card.description}
                </div>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    card.expectedResult === 'success'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {card.expectedResult === 'success'
                    ? 'Success'
                    : 'Failure'}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-500">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-600">CVV:</span> Any 3 digits
                </div>
                <div>
                  <span className="text-gray-600">Expiry:</span> Any future date
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 glass rounded-lg max-w-4xl mx-auto">
        <p className="text-sm text-gray-400 text-center">
          <span className="text-yellow-400 font-semibold">Note:</span> These are
          sandbox test cards. Use them only in the test environment.
        </p>
      </div>
    </div>
  );
}
