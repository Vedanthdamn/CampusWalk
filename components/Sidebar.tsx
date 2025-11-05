'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, MapIcon, BuildingOfficeIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Map', href: '/map', icon: MapIcon },
    { name: 'Buildings', href: '/buildings', icon: BuildingOfficeIcon },
    { name: 'Hostels', href: '/hostels', icon: BuildingLibraryIcon },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-gradient-to-b from-blue-900 to-blue-800 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-blue-700">
        <h1 className="text-2xl font-bold">CampusWalk</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-3 py-3 text-sm font-medium rounded-lg
                transition-colors duration-200
                ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }
              `}
            >
              <item.icon
                className={`mr-3 h-6 w-6 ${isActive ? 'text-white' : 'text-blue-300'}`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-blue-700 p-4">
        <p className="text-xs text-blue-300 text-center">
          SRM University KTR
          <br />
          Campus Navigation
        </p>
      </div>
    </div>
  );
}
