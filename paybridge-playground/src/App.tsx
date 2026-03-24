import { useState } from 'react';
import Hero from './components/Hero';
import ProviderPicker from './components/ProviderPicker';
import InteractiveExplorer from './components/InteractiveExplorer';
import WebhookMonitor from './components/WebhookMonitor';
import CodeExamples from './components/CodeExamples';
import ProvidersComparison from './components/ProvidersComparison';
import GetStarted from './components/GetStarted';
import TestCards from './components/TestCards';
import type { Provider } from './types';

function App() {
  const [selectedProvider, setSelectedProvider] = useState<Provider>('softycomp');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Hero />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Provider Selection */}
          <section id="provider" className="mb-20">
            <ProviderPicker
              selected={selectedProvider}
              onSelect={setSelectedProvider}
            />
          </section>

          {/* Try It - Interactive Explorer */}
          <section id="try-it" className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
              Try It Live
            </h2>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Test payment flows in real-time. Fill in the form, see the code, and run it against the sandbox.
            </p>
            <InteractiveExplorer provider={selectedProvider} />
          </section>

          {/* Test Cards */}
          <section id="test-cards" className="mb-20">
            <TestCards provider={selectedProvider} />
          </section>

          {/* Webhooks */}
          <section id="webhooks" className="mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
              Webhook Monitor
            </h2>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Simulate webhook events and see how they're parsed in real-time.
            </p>
            <WebhookMonitor provider={selectedProvider} />
          </section>

          {/* Code Examples */}
          <section id="examples" className="mb-20">
            <CodeExamples provider={selectedProvider} />
          </section>

          {/* Providers Comparison */}
          <section id="providers" className="mb-20">
            <ProvidersComparison />
          </section>

          {/* Get Started */}
          <section id="get-started">
            <GetStarted />
          </section>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
            <p>Built with PayBridge - Unified payments for South Africa</p>
            <p className="mt-2 text-sm">
              Open source on{' '}
              <a
                href="https://github.com/kobie3717/paybridge"
                className="text-brand-400 hover:text-brand-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
