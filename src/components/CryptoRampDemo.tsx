import { useState } from 'react';
import { ArrowRight, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';

type RampType = 'on-ramp' | 'off-ramp';

const fiatCurrencies = ['ZAR', 'USD', 'EUR', 'GBP'];
const cryptoAssets = ['USDT', 'BTC', 'ETH', 'USDC'];
const networks = ['Polygon', 'Ethereum', 'Tron', 'BSC'];

export default function CryptoRampDemo() {
  const [rampType, setRampType] = useState<RampType>('on-ramp');
  const [fiatAmount, setFiatAmount] = useState('1000');
  const [fiatCurrency, setFiatCurrency] = useState('ZAR');
  const [asset, setAsset] = useState('USDT');
  const [network, setNetwork] = useState('Polygon');
  const [walletAddress, setWalletAddress] = useState('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
  const [accountNumber, setAccountNumber] = useState('1234567890');
  const [branchCode, setBranchCode] = useState('250655');
  const [accountHolder, setAccountHolder] = useState('John Doe');
  const [showQuote, setShowQuote] = useState(false);

  const handleGetQuote = () => {
    setShowQuote(true);
  };

  const rate = rampType === 'on-ramp' ? 18.79 : 19.45;
  const cryptoAmount = rampType === 'on-ramp'
    ? (parseFloat(fiatAmount) / rate * 0.955).toFixed(2)
    : (parseFloat(fiatAmount) * rate * 0.955).toFixed(2);
  const fee = (parseFloat(fiatAmount) * 0.045).toFixed(2);

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Crypto On/Off-Ramp
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Buy crypto with fiat or cash out crypto to your bank account using MoonPay and Yellow Card.
        </p>
      </div>

      <div className="glass rounded-xl p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['on-ramp', 'off-ramp'] as RampType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setRampType(type);
                setShowQuote(false);
              }}
              className={clsx(
                'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
                rampType === type
                  ? 'bg-brand-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300'
              )}
            >
              {type === 'on-ramp' ? (
                <>
                  <TrendingUp className="w-4 h-4" />
                  <span>On-Ramp (Fiat → Crypto)</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4" />
                  <span>Off-Ramp (Crypto → Fiat)</span>
                </>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {rampType === 'on-ramp' ? 'Fiat Amount' : 'Crypto Amount'}
            </label>
            <input
              type="number"
              value={fiatAmount}
              onChange={(e) => {
                setFiatAmount(e.target.value);
                setShowQuote(false);
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {rampType === 'on-ramp' ? 'Fiat Currency' : 'Crypto Asset'}
            </label>
            <select
              value={rampType === 'on-ramp' ? fiatCurrency : asset}
              onChange={(e) => {
                if (rampType === 'on-ramp') {
                  setFiatCurrency(e.target.value);
                } else {
                  setAsset(e.target.value);
                }
                setShowQuote(false);
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {rampType === 'on-ramp'
                ? fiatCurrencies.map((curr) => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))
                : cryptoAssets.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))
              }
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {rampType === 'on-ramp' ? 'Crypto Asset' : 'Fiat Currency'}
            </label>
            <select
              value={rampType === 'on-ramp' ? asset : fiatCurrency}
              onChange={(e) => {
                if (rampType === 'on-ramp') {
                  setAsset(e.target.value);
                } else {
                  setFiatCurrency(e.target.value);
                }
                setShowQuote(false);
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {rampType === 'on-ramp'
                ? cryptoAssets.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))
                : fiatCurrencies.map((curr) => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))
              }
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Network
            </label>
            <select
              value={network}
              onChange={(e) => {
                setNetwork(e.target.value);
                setShowQuote(false);
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {networks.map((net) => (
                <option key={net} value={net}>{net}</option>
              ))}
            </select>
          </div>
        </div>

        {rampType === 'on-ramp' ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Wallet Address
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => {
                setWalletAddress(e.target.value);
                setShowQuote(false);
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="0x..."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value);
                  setShowQuote(false);
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="1234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Branch Code
              </label>
              <input
                type="text"
                value={branchCode}
                onChange={(e) => {
                  setBranchCode(e.target.value);
                  setShowQuote(false);
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="250655"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Account Holder
              </label>
              <input
                type="text"
                value={accountHolder}
                onChange={(e) => {
                  setAccountHolder(e.target.value);
                  setShowQuote(false);
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="John Doe"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleGetQuote}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-all hover-lift mb-6"
        >
          Get Quote
          {rampType === 'on-ramp' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
        </button>

        {showQuote && (
          <div className="p-6 bg-gradient-to-r from-brand-500/10 to-purple-500/10 border border-brand-500/20 rounded-lg mb-6">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-white mb-2">
                {rampType === 'on-ramp' ? (
                  <>{fiatAmount} {fiatCurrency} ≈ {cryptoAmount} {asset}</>
                ) : (
                  <>{fiatAmount} {asset} ≈ {cryptoAmount} {fiatCurrency}</>
                )}
              </div>
              <div className="text-sm text-gray-400">
                Rate: {rate.toFixed(2)} • Fee: {fee} {fiatCurrency} (4.5%)
              </div>
            </div>
            <div className="p-4 bg-black/40 rounded-lg">
              <div className="text-xs text-purple-400 font-mono mb-1">Checkout URL</div>
              <div className="text-sm text-gray-300 font-mono break-all">
                https://{rampType === 'on-ramp' ? 'buy' : 'sell'}.moonpay.com?apiKey=pk_test_...&currencyCode={asset.toLowerCase()}&baseCurrencyAmount={fiatAmount}
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-black/40 rounded-lg">
          <div className="text-xs text-gray-500 font-mono mb-2">TypeScript</div>
          <pre className="text-sm text-gray-300 overflow-x-auto">
            <code>{`import { CryptoRamp } from 'paybridge';

const ramp = new CryptoRamp({
  provider: 'moonpay',
  credentials: {
    apiKey: process.env.MOONPAY_API_KEY,
    secretKey: process.env.MOONPAY_SECRET_KEY
  },
  sandbox: true
});

const ${rampType === 'on-ramp' ? 'onRamp' : 'offRamp'} = await ramp.${rampType === 'on-ramp' ? 'onRamp' : 'offRamp'}({${
  rampType === 'on-ramp' ? `
  fiatAmount: ${fiatAmount},
  fiatCurrency: '${fiatCurrency}',
  asset: '${asset}',
  network: '${network}',
  walletAddress: '${walletAddress}',` : `
  cryptoAmount: ${fiatAmount},
  asset: '${asset}',
  fiatCurrency: '${fiatCurrency}',
  bankAccount: {
    accountNumber: '${accountNumber}',
    branchCode: '${branchCode}',
    accountHolder: '${accountHolder}'
  },`}
  urls: {
    success: 'https://myapp.com/success',
    cancel: 'https://myapp.com/cancel'
  }
});

console.log(${rampType === 'on-ramp' ? 'onRamp' : 'offRamp'}.checkoutUrl);
console.log(${rampType === 'on-ramp' ? 'onRamp' : 'offRamp'}.quote);`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
