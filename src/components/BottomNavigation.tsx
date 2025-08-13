'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';

export default function BottomNavigation() {
  const pathname = usePathname();
  const { isConnected } = useAccount();

  // Don't show navigation if wallet is not connected
  if (!isConnected) {
    return null;
  }

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      href: '/play',
      label: 'Games',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 10C16 11.1046 15.1046 12 14 12C12.8954 12 12 11.1046 12 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 10C8 11.1046 8.89543 12 10 12C11.1046 12 12 11.1046 12 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-500/20' 
                  : 'hover:bg-gray-800/50'
              }`}
            >
              <div className="w-6 h-6 mb-1">
                <div className={isActive ? 'text-blue-400' : 'text-gray-400'}>
                  {item.icon}
                </div>
              </div>
              <span className={`text-xs ${
                isActive 
                  ? 'text-blue-400 font-medium' 
                  : 'text-gray-400'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
