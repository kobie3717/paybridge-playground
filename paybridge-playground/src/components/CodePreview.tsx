import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import type { Provider, PaymentFormData } from '../types';
import { Highlight, themes } from 'prism-react-renderer';
import clsx from 'clsx';

interface CodePreviewProps {
  formData: PaymentFormData;
  provider: Provider;
  language: 'typescript' | 'curl' | 'python';
  showToggle?: boolean;
}

export default function CodePreview({
  formData,
  provider,
  language: initialLanguage,
  showToggle = false,
}: CodePreviewProps) {
  const [language, setLanguage] = useState(initialLanguage);
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    const { amount, customerName, email, phone, reference } = formData;

    if (language === 'typescript') {
      return `import { PayBridge } from 'paybridge';

const paybridge = new PayBridge({
  provider: '${provider}',
  apiKey: process.env.SOFTYCOMP_API_KEY,
  apiSecret: process.env.SOFTYCOMP_API_SECRET,
  sandbox: true,
});

const payment = await paybridge.createPayment({
  amount: ${amount},
  currency: 'ZAR',
  reference: '${reference}',
  customer: {
    name: '${customerName}',
    email: '${email}',
    phone: '${phone}',
  },
  returnUrl: 'https://yoursite.com/payment/success',
  cancelUrl: 'https://yoursite.com/payment/cancel',
  notifyUrl: 'https://yoursite.com/webhooks/payment',
});

// Redirect customer to checkout
res.redirect(payment.checkoutUrl);`;
    }

    if (language === 'curl') {
      return `curl -X POST https://testapi.softycompdistribution.co.za/payments \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "X-API-Secret: YOUR_API_SECRET" \\
  -d '{
    "amount": ${amount},
    "currency": "ZAR",
    "reference": "${reference}",
    "customer": {
      "name": "${customerName}",
      "email": "${email}",
      "phone": "${phone}"
    },
    "returnUrl": "https://yoursite.com/payment/success",
    "cancelUrl": "https://yoursite.com/payment/cancel",
    "notifyUrl": "https://yoursite.com/webhooks/payment"
  }'`;
    }

    if (language === 'python') {
      return `from paybridge import PayBridge

paybridge = PayBridge(
    provider='${provider}',
    api_key=os.environ['SOFTYCOMP_API_KEY'],
    api_secret=os.environ['SOFTYCOMP_API_SECRET'],
    sandbox=True
)

payment = paybridge.create_payment(
    amount=${amount},
    currency='ZAR',
    reference='${reference}',
    customer={
        'name': '${customerName}',
        'email': '${email}',
        'phone': '${phone}',
    },
    return_url='https://yoursite.com/payment/success',
    cancel_url='https://yoursite.com/payment/cancel',
    notify_url='https://yoursite.com/webhooks/payment'
)

# Redirect customer to checkout
return redirect(payment.checkout_url)`;
    }

    return '';
  };

  const code = generateCode();

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      typescript: 'TypeScript',
      curl: 'cURL',
      python: 'Python',
    };
    return labels[lang] || lang;
  };

  return (
    <div className="relative">
      {showToggle && (
        <div className="flex items-center gap-2 mb-3">
          {(['typescript', 'curl', 'python'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={clsx(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                language === lang
                  ? 'bg-brand-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300'
              )}
            >
              {getLanguageLabel(lang)}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={copyCode}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <Highlight theme={themes.nightOwl} code={code} language={language === 'curl' ? 'bash' : language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} rounded-lg p-4 overflow-x-auto text-sm`}
              style={{ ...style, background: 'rgba(0, 0, 0, 0.4)' }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>

      {!showToggle && (
        <div className="mt-2 text-xs text-gray-500">
          Language: {getLanguageLabel(language)}
        </div>
      )}
    </div>
  );
}
