"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  WalletIcon,
  ChartBarIcon,
  UserIcon,
  CogIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Accounts", href: "/accounts", icon: WalletIcon },
    { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
    { name: "Profile", href: "/profile", icon: UserIcon },
    { name: "Settings", href: "/settings", icon: CogIcon },
    { name: "Help", href: "/help", icon: QuestionMarkCircleIcon },
  ];

  return (
    <div className="w-64 bg-indigo-900 text-white h-screen flex-shrink-0 hidden md:block">
      <div className="p-4">
        <h1 className="font-bold text-xl">SmartFin</h1>
      </div>
      <nav className="mt-6">
        <div className="px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm rounded-md ${
                  isActive
                    ? "bg-indigo-800 text-white"
                    : "text-indigo-200 hover:bg-indigo-700"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="absolute bottom-0 w-64 p-4">
        <div className="flex items-center space-x-3 p-3 bg-indigo-800 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-indigo-200" />
          </div>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-indigo-300">Business Account</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
