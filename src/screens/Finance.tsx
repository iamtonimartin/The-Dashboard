import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Scan, 
  ArrowUpRight, 
  ArrowDownRight, 
  Coffee, 
  Home as HomeIcon, 
  Briefcase, 
  ShoppingBag,
  Search,
  Filter,
  MoreVertical,
  Check,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Finance() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const stats = [
    { label: 'Net Cash Flow', value: '$42,850', trend: '+12.5%', icon: DollarSign, color: 'bg-forest text-cream' },
    { label: 'Total Revenue', value: '$68,200', trend: '+8.2%', icon: TrendingUp, color: 'bg-green-500 text-white' },
    { label: 'Total Expenses', value: '$25,350', trend: '-2.4%', icon: TrendingDown, color: 'bg-terracotta text-white' },
  ];

  const transactions = [
    { id: '1', date: 'Mar 23, 2026', desc: 'Stripe Payout - SaaS', amount: 4200.00, type: 'income', cat: 'Revenue', icon: Briefcase },
    { id: '2', date: 'Mar 22, 2026', desc: 'AWS Infrastructure', amount: -842.50, type: 'expense', cat: 'Tech', icon: HomeIcon },
    { id: '3', date: 'Mar 22, 2026', desc: 'Blue Bottle Coffee', amount: -12.40, type: 'expense', cat: 'Lifestyle', icon: Coffee },
    { id: '4', date: 'Mar 21, 2026', desc: 'Apple Store - MacBook', amount: -2499.00, type: 'expense', cat: 'Hardware', icon: ShoppingBag },
    { id: '5', date: 'Mar 20, 2026', desc: 'Consulting Fee - Client X', amount: 1500.00, type: 'income', cat: 'Consulting', icon: Briefcase },
  ];

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setTimeout(() => setScanComplete(false), 3000);
    }, 2500);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold tracking-tight text-forest">The Vault (Finance)</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={cn("card flex flex-col justify-between border-none", stat.color)}>
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-white/10 rounded-xl">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest opacity-60">{stat.trend} vs last month</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Receipt Scanner */}
        <div className="lg:col-span-1 card flex flex-col justify-center items-center text-center py-12">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-forest mb-2">AI Receipt Scanner</h3>
            <p className="text-sm text-forest/40">Upload a photo to extract transaction data</p>
          </div>
          
          <div 
            onClick={handleScan}
            className={cn(
              "w-48 h-48 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-500 relative overflow-hidden",
              isScanning ? "border-terracotta bg-terracotta/5" : "border-forest/10 bg-cream/20 hover:border-terracotta/30"
            )}
          >
            {isScanning ? (
              <>
                <motion.div 
                  animate={{ y: [0, 160, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 right-0 h-1 bg-terracotta shadow-[0_0_15px_rgba(192,88,58,0.8)] z-10"
                />
                <Loader2 className="w-12 h-12 text-terracotta animate-spin mb-4" />
                <p className="text-xs font-bold text-terracotta uppercase tracking-widest">Extracting Data...</p>
              </>
            ) : scanComplete ? (
              <>
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Success!</p>
                <p className="text-[10px] text-forest/40 mt-1">Mar 23 • Starbucks • $6.50</p>
              </>
            ) : (
              <>
                <Scan className="w-12 h-12 text-forest/20 mb-4" />
                <p className="text-xs font-bold text-forest/40 uppercase tracking-widest">Tap to Scan</p>
              </>
            )}
          </div>
          
          <div className="mt-8 w-full max-w-[200px] space-y-2">
            <div className="h-1 bg-cream rounded-full overflow-hidden">
              <div className="h-full bg-forest w-2/3" />
            </div>
            <p className="text-[10px] font-bold text-forest/40 uppercase tracking-widest">Monthly Limit: 64/100</p>
          </div>
        </div>

        {/* Transaction Ledger */}
        <div className="lg:col-span-2 card flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-forest">Transaction Ledger</h3>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/20" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-cream/50 border border-forest/5 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-terracotta/20"
                />
              </div>
              <button className="p-2 hover:bg-cream rounded-xl transition-colors"><Filter className="w-4 h-4 text-forest/40" /></button>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-cream/30 border border-forest/5 group hover:bg-cream/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "p-3 rounded-xl bg-white shadow-sm",
                    tx.type === 'income' ? "text-green-600" : "text-terracotta"
                  )}>
                    <tx.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-forest">{tx.desc}</p>
                    <p className="text-[10px] font-bold text-forest/40 uppercase tracking-widest">{tx.date} • {tx.cat}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <p className={cn(
                    "font-mono font-bold text-lg",
                    tx.type === 'income' ? "text-green-600" : "text-forest"
                  )}>
                    {tx.type === 'income' ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </p>
                  <button className="text-forest/20 hover:text-forest/60 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-6 w-full py-4 bg-cream text-forest font-bold rounded-2xl hover:bg-cream/80 transition-colors flex items-center justify-center space-x-2">
            <span>View Full Statement</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
