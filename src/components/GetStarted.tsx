import { Terminal, BookOpen, ExternalLink as Github, Package } from 'lucide-react';

export default function GetStarted() {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Get Started
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Install PayBridge and start accepting payments in minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Installation */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-500/20 rounded-lg flex items-center justify-center">
              <Terminal className="w-5 h-5 text-brand-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Install</h3>
          </div>

          <div className="bg-black/40 rounded-lg p-4 mb-4">
            <code className="text-brand-300 text-sm">npm install paybridge</code>
          </div>

          <p className="text-gray-400 text-sm">
            Or with yarn:
          </p>
          <div className="bg-black/40 rounded-lg p-4 mt-2">
            <code className="text-brand-300 text-sm">yarn add paybridge</code>
          </div>
        </div>

        {/* Quick Start */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Quick Start</h3>
          </div>

          <div className="bg-black/40 rounded-lg p-4">
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`import { PayBridge } from 'paybridge';

const pb = new PayBridge({
  provider: 'softycomp',
  apiKey: process.env.API_KEY,
  sandbox: true
});

const payment = await pb
  .createPayment({
    amount: 100,
    currency: 'ZAR'
  });`}</code>
            </pre>
          </div>
        </div>

        {/* GitHub */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
              <ExternalLink as Github className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Open Source</h3>
          </div>

          <p className="text-gray-400 mb-4">
            PayBridge is open source and available on GitHub. Contributions welcome!
          </p>

          <a
            href="https://github.com/kobie3717/paybridge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all hover-lift"
          >
            <ExternalLink as Github className="w-4 h-4" />
            View Repository
          </a>
        </div>

        {/* NPM Package */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">NPM Package</h3>
          </div>

          <p className="text-gray-400 mb-4">
            Available on npm registry. Supports Node.js, TypeScript, and modern bundlers.
          </p>

          <a
            href="https://www.npmjs.com/package/paybridge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all hover-lift"
          >
            <Package className="w-4 h-4" />
            View on NPM
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {[
          { title: 'TypeScript', description: 'Full type safety' },
          { title: 'Webhooks', description: 'Real-time events' },
          { title: 'Test Mode', description: 'Sandbox environment' },
          { title: 'SA Focus', description: 'Local providers' },
        ].map((feature) => (
          <div key={feature.title} className="glass rounded-lg p-4 text-center">
            <div className="text-white font-semibold mb-1">{feature.title}</div>
            <div className="text-gray-400 text-sm">{feature.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
