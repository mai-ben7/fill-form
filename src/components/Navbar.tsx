'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'בית' },
    { href: '/lead', label: 'צור קשר' },
  ];

  return (
    <nav className="bg-background border-b border-black/[.08] dark:border-white/[.145] sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/logo+name.png"
              alt="Fill Form Logo"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          
          <div className="flex items-center space-x-6 space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-foreground text-background'
                    : 'text-foreground/70 hover:text-foreground hover:bg-black/[.05] dark:hover:bg-white/[.06]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
