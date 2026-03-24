import { useState } from 'react';
import { Webhook, Eye, EyeOff, Play, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Provider, WebhookEvent } from '../types';
import clsx from 'clsx';

interface WebhookMonitorProps {
  provider: Provider;
}

const mockEvents: WebhookEvent[] = [
  {
    id: 'evt_001',
    timestamp: new Date(Date.now() - 2000).toISOString(),
    type: 'payment.completed',
    status: 'success',
    amount: 'R 100.00',
    reference: 'ORDER-001',
    rawPayload: {
      event: 'payment.completed',
      data: {
        paymentId: 'PAY-1234567890',
        status: 'completed',
        amount: 100.0,
        currency: 'ZAR',
        reference: 'ORDER-001',
        completedAt: new Date().toISOString(),
      },
    },
  },
  {
    id: 'evt_002',
    timestamp: new Date(Date.now() - 5000).toISOString(),
    type: 'payment.failed',
    status: 'failed',
    amount: 'R 50.00',
    reference: 'ORDER-002',
    rawPayload: {
      event: 'payment.failed',
      data: {
        paymentId: 'PAY-0987654321',
        status: 'failed',
        amount: 50.0,
        currency: 'ZAR',
        reference: 'ORDER-002',
        reason: 'Insufficient funds',
        failedAt: new Date().toISOString(),
      },
    },
  },
];

export default function WebhookMonitor(_props: WebhookMonitorProps) {
  const [events, setEvents] = useState<WebhookEvent[]>(mockEvents);
  const [showRaw, setShowRaw] = useState<string | null>(null);

  const triggerWebhook = (type: 'success' | 'failed' | 'pending') => {
    const eventTypes = {
      success: 'payment.completed',
      failed: 'payment.failed',
      pending: 'payment.pending',
    };

    const newEvent: WebhookEvent = {
      id: `evt_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: eventTypes[type],
      status: type,
      amount: `R ${(Math.random() * 500 + 50).toFixed(2)}`,
      reference: `ORDER-${Math.floor(Math.random() * 1000)}`,
      rawPayload: {
        event: eventTypes[type],
        data: {
          paymentId: `PAY-${Date.now()}`,
          status: type,
          amount: Math.random() * 500 + 50,
          currency: 'ZAR',
          reference: `ORDER-${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date().toISOString(),
        },
      },
    };

    setEvents([newEvent, ...events]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/20';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/20';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Trigger Buttons */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Webhook className="w-6 h-6 text-brand-400" />
          <h3 className="text-xl font-semibold text-white">Trigger Webhook Events</h3>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => triggerWebhook('success')}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-medium transition-all hover-lift"
          >
            <Play className="w-4 h-4" />
            Success Payment
          </button>
          <button
            onClick={() => triggerWebhook('failed')}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-all hover-lift"
          >
            <Play className="w-4 h-4" />
            Failed Payment
          </button>
          <button
            onClick={() => triggerWebhook('pending')}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg font-medium transition-all hover-lift"
          >
            <Play className="w-4 h-4" />
            Pending Payment
          </button>
        </div>
      </div>

      {/* Event Log */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recent Events</h3>
          <div className="text-sm text-gray-400">
            {events.length} event{events.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(event.status)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="text-white font-medium mb-1">{event.type}</div>
                      <div className="text-gray-400 text-sm">
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div
                      className={clsx(
                        'px-3 py-1 rounded-full text-xs font-semibold border',
                        getStatusColor(event.status)
                      )}
                    >
                      {event.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-gray-500">Amount:</span>{' '}
                      <span className="text-gray-300">{event.amount}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Reference:</span>{' '}
                      <span className="text-gray-300">{event.reference}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowRaw(showRaw === event.id ? null : event.id)}
                    className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    {showRaw === event.id ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Hide Raw Payload
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Show Raw Payload
                      </>
                    )}
                  </button>

                  {showRaw === event.id && (
                    <div className="mt-3 bg-black/40 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs text-gray-300">
                        {JSON.stringify(event.rawPayload, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No events yet. Trigger a webhook event above to see it here.
          </div>
        )}
      </div>
    </div>
  );
}
