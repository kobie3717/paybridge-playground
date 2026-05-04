export type Provider =
  | 'softycomp'
  | 'yoco'
  | 'ozow'
  | 'payfast'
  | 'paystack'
  | 'stripe'
  | 'peach'
  | 'flutterwave';

export type CryptoProvider = 'moonpay' | 'yellowcard';

export type RoutingStrategy = 'cheapest' | 'fastest' | 'priority' | 'round-robin';

export interface ProviderCapability {
  id: Provider;
  name: string;
  region: string;
  feePercent: number;
  feeFixed: number;
  feeCurrency: string;
  avgLatencyMs: number;
  supportsSubscriptions: boolean;
  supportsRefunds: boolean;
  status: 'production' | 'experimental';
}

export interface PaymentFormData {
  amount: string;
  customerName: string;
  email: string;
  phone: string;
  reference: string;
}

export interface WebhookEvent {
  id: string;
  timestamp: string;
  type: string;
  status: 'success' | 'failed' | 'pending';
  amount: string;
  reference: string;
  rawPayload: object;
}

export interface TestCard {
  number: string;
  description: string;
  expectedResult: 'success' | 'failed';
}
