import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

interface HealthData {
  ok: boolean;
  paybridgeVersion: string;
  enabledProviders: {
    stripe: boolean;
    paystack: boolean;
    payfast: boolean;
    flutterwave: boolean;
    mollie: boolean;
  };
}

export default function HealthStatus() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="fixed top-4 right-4 z-50 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs text-red-300">Backend offline</span>
        </div>
      </div>
    );
  }

  if (!health) {
    return null;
  }

  const enabledCount = Object.values(health.enabledProviders).filter(Boolean).length;

  return (
    <div className="fixed top-4 right-4 z-50 px-4 py-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-xs text-green-300 font-medium">Live Backend</span>
        </div>
        <div className="flex items-center gap-1">
          {Object.entries(health.enabledProviders).map(([provider, enabled]) => (
            <div
              key={provider}
              className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-600'}`}
              title={`${provider}: ${enabled ? 'enabled' : 'disabled'}`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400">
          {enabledCount}/5 providers
        </span>
      </div>
    </div>
  );
}
