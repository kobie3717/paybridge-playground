import { ArrowRight, Github } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative pt-20 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-5xl">🌉</span>
            <h1 className="text-5xl sm:text-7xl font-bold gradient-text">
              PayBridge
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto">
            Test payments in seconds. No backend required.
          </p>

          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Interactive playground for testing South African payment providers.
            Try real API calls in your browser with live code preview.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#try-it"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-all hover-lift"
            >
              Try It Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="https://github.com/kobie3717/paybridge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 glass hover:bg-white/10 text-white rounded-lg font-semibold transition-all hover-lift"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </div>

          {/* Provider Logos */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-sm text-gray-500 mb-6">SUPPORTED PROVIDERS</p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              <div className="text-gray-400 font-semibold text-lg">SoftyComp</div>
              <div className="text-gray-600 font-semibold text-lg">Yoco</div>
              <div className="text-gray-600 font-semibold text-lg">Ozow</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
