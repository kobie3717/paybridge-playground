import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getDriftStatus, type ProviderBuilders } from '../src/lib/drift-runner.js';
import { PayBridge } from 'paybridge';

describe('drift-runner', () => {
  it('returns skipped status for providers without creds', async () => {
    const builders: ProviderBuilders = {
      stripe: () => null,
      paystack: () => null,
    };

    const result = await getDriftStatus(builders, true);
    assert.strictEqual(result.results.length, 2);
    assert.strictEqual(result.results[0].status, 'skipped');
    assert.strictEqual(result.results[1].status, 'skipped');
  });

  it('returns cached result within TTL', async () => {
    const builders: ProviderBuilders = {
      stripe: () => null,
    };

    const first = await getDriftStatus(builders, true);
    const second = await getDriftStatus(builders, false);

    assert.strictEqual(first.lastCheckedAt, second.lastCheckedAt);
  });

  it('forces refresh when requested', async () => {
    const builders: ProviderBuilders = {
      stripe: () => null,
    };

    const first = await getDriftStatus(builders, true);
    await new Promise((resolve) => setTimeout(resolve, 10));
    const second = await getDriftStatus(builders, true);

    assert.notStrictEqual(first.lastCheckedAt, second.lastCheckedAt);
  });
});
