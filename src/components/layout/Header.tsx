import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 rounded-md" aria-label="FinPros Home">
              <span className="text-xl font-bold text-slate-800 tracking-tight">
                FinPros
              </span>
            </Link>
          </div>
          <nav className="flex space-x-4 sm:space-x-8" aria-label="Main Navigation">
            {/* Extensible navigation structure for future tool categories */}
            <Link 
              href="/" 
              className="text-sm font-medium text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 rounded-md transition-colors px-2 py-1"
            >
              Tools
            </Link>
            <Link 
              href="/" 
              className="text-sm font-medium text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 rounded-md transition-colors px-2 py-1"
            >
              Resources
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
