import { Check } from 'lucide-react';
import type { Provider } from '../types';
import clsx from 'clsx';

interface ProviderPickerProps {
  selected: Provider;
  onSelect: (provider: Provider) => void;
}

const providers = [
  {
    id: 'softycomp' as Provider,
    name: 'SoftyComp',
    description: 'South African payment gateway',
    available: true,
  },
  {
    id: 'yoco' as Provider,
    name: 'Yoco',
    description: 'Card payments for small business',
    available: false,
  },
  {
    id: 'ozow' as Provider,
    name: 'Ozow',
    description: 'Instant EFT payments',
    available: false,
  },
];

export default function ProviderPicker({ selected, onSelect }: ProviderPickerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {providers.map((provider) => (
        <button
          key={provider.id}
          onClick={() => provider.available && onSelect(provider.id)}
          disabled={!provider.available}
          className={clsx(
            'relative p-6 rounded-xl border-2 transition-all text-left',
            'hover-lift',
            selected === provider.id
              ? 'border-brand-500 bg-brand-500/10'
              : provider.available
              ? 'border-white/10 glass hover:border-white/20'
              : 'border-white/5 bg-white/[0.02] opacity-50 cursor-not-allowed'
          )}
        >
          {selected === provider.id && (
            <div className="absolute top-4 right-4 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}

          <div className="mb-2">
            <h3 className="text-xl font-semibold text-white">{provider.name}</h3>
          </div>

          <p className="text-gray-400 text-sm mb-3">{provider.description}</p>

          {!provider.available && (
            <div className="inline-flex items-center px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-semibold">
              Coming Soon
            </div>
          )}

          {provider.available && selected !== provider.id && (
            <div className="text-brand-400 text-sm font-semibold">
              Click to select
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
