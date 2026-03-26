import React from 'react';
import { 
  Home, 
  Terminal, 
  PenTool, 
  User, 
  Brain, 
  Wallet, 
  Settings,
  LogOut
} from 'lucide-react';
import { Screen } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeScreen: Screen;
  onScreenChange: (screen: Screen) => void;
  onLogout: () => void;
}

const navItems: { id: Screen; icon: any; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'command', icon: Terminal, label: 'Command Centre' },
  { id: 'content', icon: PenTool, label: 'Content Studio' },
  { id: 'personal', icon: User, label: 'Personal' },
  { id: 'knowledge', icon: Brain, label: 'Knowledge Base' },
  { id: 'finance', icon: Wallet, label: 'Finance' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ activeScreen, onScreenChange, onLogout }: SidebarProps) {
  return (
    <div className="w-64 h-screen bg-white border-r border-forest/5 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8">
        <h1 className="text-2xl font-bold tracking-tighter text-forest">
          TONI'S <span className="text-terracotta">HQ</span>
        </h1>
        <p className="text-[10px] font-mono text-forest/40 uppercase tracking-widest mt-1">
          Founder Co-Pilot v1.1
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onScreenChange(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 group",
              activeScreen === item.id 
                ? "bg-cream text-forest border-l-4 border-terracotta" 
                : "text-forest/60 hover:bg-cream/50 hover:text-forest"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              activeScreen === item.id ? "text-terracotta" : "group-hover:text-forest"
            )} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-forest/5">
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-forest/60 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
