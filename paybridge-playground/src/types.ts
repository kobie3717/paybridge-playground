export type Provider = 'softycomp' | 'yoco' | 'ozow';

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
