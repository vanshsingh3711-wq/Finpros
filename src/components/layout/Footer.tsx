import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 rounded-lg group transition-all"
              aria-label="FinPros Home"
            >
              {/* Repeated Brand Icon (Soft Teal Background + Teal Accent) */}
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-100/60 text-teal-700 border border-teal-200/50">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20V10" />
                  <path d="M18 20V4" />
                  <path d="M6 20v-4" />
                </svg>
              </div>
              
              {/* Premium Typography (Deep Navy + Teal) */}
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Fin<span className="text-teal-700">Pros</span>
              </span>
            </Link>
            <p className="mt-5 text-sm text-slate-500 max-w-sm leading-relaxed">
              Empowering your financial decisions with professional-grade tools and calculators. Simple, trustworthy, and built for transparency.
            </p>
          </div>
          
          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-5">Company</h3>
              <ul className="space-y-4">
                <li>
                  <Link 
                    href="/" 
                    className="text-sm font-medium text-slate-500 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-sm transition-colors"
                  >
                    Home
                  </Link>
                </li>
                {/* Future links: About, Contact, etc. */}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-5">Legal</h3>
              <ul className="space-y-4">
                {/* Future links: Privacy Policy, Terms of Service */}
                <li>
                  <span className="text-sm font-medium text-slate-400">
                    Terms & Privacy
                  </span>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
        
        {/* Divider & Legal Disclaimer */}
        <div className="mt-16 pt-8 border-t border-slate-200/60">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <p className="text-[13px] text-slate-500 leading-relaxed max-w-4xl lg:text-left text-center">
              <strong className="font-semibold text-slate-900">Disclaimer:</strong> The tools and calculators provided by FinPros are for informational and educational purposes only and do not constitute financial advice. Please consult with a qualified financial advisor before making any financial decisions.
            </p>
            <p className="text-[13px] font-medium text-slate-400 shrink-0">
              &copy; {new Date().getFullYear()} FinPros. All rights reserved.
            </p>
          </div>
        </div>
        
      </div>
    </footer>
  );
}