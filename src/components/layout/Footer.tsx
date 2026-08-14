import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">FinPros</span>
            <p className="mt-4 text-sm text-slate-500 max-w-xs leading-relaxed">
              Empowering your financial decisions with professional-grade tools and calculators.
            </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                    Home
                  </Link>
                </li>
                {/* Future links: About, Contact, etc. */}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-3">
                {/* Future links: Privacy Policy, Terms of Service */}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center leading-relaxed max-w-3xl mx-auto">
            Disclaimer: The tools and calculators provided by FinPros are for informational and educational purposes only and do not constitute financial advice. Please consult with a qualified financial advisor before making any financial decisions.
          </p>
          <p className="mt-4 text-xs text-slate-400 text-center">
            &copy; {new Date().getFullYear()} FinPros. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
