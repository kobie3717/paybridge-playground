import { captureShape, diffBaseline, FileDriftStore, PayBridge } from 'paybridge';
import type { DriftReport, ProviderBaseline, ResponseShape } from 'paybridge';
import path from 'node:path';
import os from 'node:os';

export interface DriftRunnerResult {
  provider: string;
  status: 'no-baseline' | 'no-drift' | 'drift' | 'error' | 'skipped';
  report?: DriftReport;
  error?: string;
  capturedAt: string;
}

export interface DriftStatusResponse {
  lastCheckedAt: string;
  cachedUntil: string;
  results: DriftRunnerResult[];
}

export interface ProviderBuilders {
  [name: string]: () => PayBridge | null;
}

const CACHE_TTL_MS = Number(process.env.DEMO_DRIFT_CACHE_TTL_MS ?? 6 * 60 * 60 * 1000);
const BASELINE_DIR = process.env.DEMO_DRIFT_BASELINE_DIR ?? path.join(os.tmpdir(), 'paybridge-playground-drift');

let cache: { data: DriftStatusResponse; expiresAt: number } | null = null;

export async function getDriftStatus(builders: ProviderBuilders, force = false): Promise<DriftStatusResponse> {
  if (!force && cache && Date.now() < cache.expiresAt) return cache.data;

  const store = new FileDriftStore(BASELINE_DIR);
  const results: DriftRunnerResult[] = [];

  for (const [providerName, builderFn] of Object.entries(builders)) {
    const pay = builderFn();

    if (!pay) {
      results.push({
        provider: providerName,
        status: 'skipped',
        capturedAt: new Date().toISOString(),
      });
      continue;
    }

    try {
      const testPaymentParams = getTestPaymentParams(providerName);
      const response = await pay.createPayment(testPaymentParams);

      const captureTarget = (response as any).raw ?? response;
      const currentShape: ResponseShape = captureShape(captureTarget);

      const baseline = await store.load(providerName);

      if (!baseline) {
        const newBaseline: ProviderBaseline = {
          providerName,
          operation: 'createPayment',
          shape: currentShape,
          libVersion: '1.0.0-rc.1',
        };
        await store.save(newBaseline);

        results.push({
          provider: providerName,
          status: 'no-baseline',
          capturedAt: currentShape.capturedAt,
        });
      } else {
        const report = diffBaseline(baseline, currentShape, providerName);

        results.push({
          provider: providerName,
          status: report.driftDetected ? 'drift' : 'no-drift',
          report,
          capturedAt: currentShape.capturedAt,
        });
      }
    } catch (err: any) {
      results.push({
        provider: providerName,
        status: 'error',
        error: err?.message ?? 'unknown error',
        capturedAt: new Date().toISOString(),
      });
    }
  }

  const data: DriftStatusResponse = {
    lastCheckedAt: new Date().toISOString(),
    cachedUntil: new Date(Date.now() + CACHE_TTL_MS).toISOString(),
    results,
  };

  cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
  return data;
}

function getTestPaymentParams(provider: string): any {
  const timestamp = Date.now();
  const reference = `cli-drift-${timestamp}`;

  const commonParams = {
    customer: {
      name: 'Demo',
      email: 'paybridge-sandbox@gmail.com',
    },
    urls: {
      success: 'https://example.com/success',
      cancel: 'https://example.com/cancel',
      webhook: 'https://example.com/webhook',
    },
  };

  switch (provider) {
    case 'stripe':
      return {
        amount: 10,
        currency: 'ZAR',
        reference,
        ...commonParams,
      };
    case 'paystack':
      return {
        amount: 100,
        currency: 'ZAR',
        reference,
        ...commonParams,
      };
    case 'payfast':
      return {
        amount: 5,
        currency: 'ZAR',
        reference,
        ...commonParams,
      };
    case 'flutterwave':
      return {
        amount: 10,
        currency: 'NGN',
        reference,
        ...commonParams,
      };
    case 'mollie':
      return {
        amount: 1,
        currency: 'EUR',
        reference,
        ...commonParams,
      };
    default:
      return {
        amount: 10,
        currency: 'ZAR',
        reference,
        ...commonParams,
      };
  }
}
