import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">
          
          {/* Brand & Logo Area */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 rounded-lg group transition-all" 
              aria-label="FinPros Home"
            >
              {/* Trust-building Brand Icon (Soft Teal Background + Teal Accent) */}
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-100/60 text-teal-700 group-hover:bg-teal-100 transition-colors border border-teal-200/50">
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 20V10" />
                  <path d="M18 20V4" />
                  <path d="M6 20v-4" />
                </svg>
              </div>
              
              {/* Premium Typography for Logo (Deep Navy + Teal) */}
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Fin<span className="text-teal-700">Pros</span>
              </span>
            </Link>
          </div>

          {/* Main Navigation */}
          <nav className="flex items-center space-x-1 sm:space-x-2" aria-label="Main Navigation">
            {/* Extensible navigation structure for future tool categories */}
            <Link 
              href="/" 
              className="px-3 sm:px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-full transition-all"
            >
              Tools
            </Link>
            <Link 
              href="/" 
              className="px-3 sm:px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-full transition-all"
            >
              Resources
            </Link>
          </nav>
          
        </div>
      </div>
    </header>
  );
}