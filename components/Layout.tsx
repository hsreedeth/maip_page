
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/' },
    { label: 'Technical', path: '/technical' },
    { label: 'Results', path: '/results' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="apple-blur fixed top-0 w-full z-50 border-b border-apple">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="font-semibold tracking-tight text-lg">MAIP</Link>
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path ? 'text-black' : 'text-secondary hover:text-black'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {children}
        </div>
      </main>
      <footer className="border-t border-apple py-10">
        <div className="max-w-4xl mx-auto px-6 text-secondary text-xs flex justify-between">
          <p>© 2024 • MAIP Project Portfolio</p>
          <div className="flex space-x-6">
            <a href="https://github.com" className="hover:text-black">GitHub</a>
            <a href="#" className="hover:text-black">Manuscript PDF</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
