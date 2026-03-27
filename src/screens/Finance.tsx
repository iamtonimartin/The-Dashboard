import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Scan,
  ArrowUpRight,
  Coffee,
  Home as HomeIcon,
  Briefcase,
  ShoppingBag,
  Search,
  Filter,
  MoreVertical,
  Check,
  Loader2,
  Plus,
  X,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { Transaction } from '../types';

// Map category names to icons
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Revenue: Briefcase,
  Consulting: Briefcase,
  Tech: HomeIcon,
  Lifestyle: Coffee,
  Food: Coffee,
  Hardware: ShoppingBag,
  Office: ShoppingBag,
  Travel: ArrowUpRight,
  Other: DollarSign,
  General: DollarSign,
};

const CATEGORIES = ['Revenue', 'Consulting', 'Tech', 'Lifestyle', 'Food', 'Hardware', 'Office', 'Travel', 'Other'];

export default function Finance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: 'General',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    if (!error && data) setTransactions(data);
    setLoading(false);
  }

  async function addTransaction() {
    if (!form.description.trim() || !form.amount) return;

    const payload = {
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert(payload)
      .select()
      .single();

    if (!error && data) {
      setTransactions((prev) => [data, ...prev]);
      setForm({ description: '', amount: '', type: 'expense', category: 'General', date: new Date().toISOString().split('T')[0] });
      setShowAddForm(false);
    }
  }

  async function handleReceiptUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanComplete(false);

    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = (ev.target?.result as string).split(',')[1];
        const res = await fetch('/api/ai/parse-receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
        });
        const parsed = await res.json();

        if (!res.ok) throw new Error(parsed.error);

        // Pre-fill the add form with parsed data
        setForm({
          description: parsed.description ?? '',
          amount: String(Math.abs(parsed.amount ?? 0)),
          type: 'expense',
          category: parsed.category ?? 'Other',
          date: parsed.date ?? new Date().toISOString().split('T')[0],
        });

        setIsScanning(false);
        setScanComplete(true);
        setShowAddForm(true);
        setTimeout(() => setScanComplete(false), 3000);
      };
      reader.readAsDataURL(file);
    } catch {
      setIsScanning(false);
    }

    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // ── Computed stats ────────────────────────────────────────────────────────
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netCashFlow = totalIncome - totalExpenses;

  const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const filtered = transactions.filter((t) =>
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold tracking-tight text-forest">The Vault (Finance)</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Net Cash Flow', value: fmt(netCashFlow), icon: DollarSign, color: 'bg-forest text-cream' },
          { label: 'Total Revenue', value: fmt(totalIncome), icon: TrendingUp, color: 'bg-green-500 text-white' },
          { label: 'Total Expenses', value: fmt(totalExpenses), icon: TrendingDown, color: 'bg-terracotta text-white' },
        ].map((stat, i) => (
          <div key={i} className={cn('card flex flex-col justify-between border-none', stat.color)}>
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-white/10 rounded-xl">
                <stat.icon className="w-6 h-6" />
              </div>
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

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleReceiptUpload}
          />

          <div
            onClick={() => !isScanning && fileInputRef.current?.click()}
            className={cn(
              'w-48 h-48 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-500 relative overflow-hidden',
              isScanning ? 'border-terracotta bg-terracotta/5' : 'border-forest/10 bg-cream/20 hover:border-terracotta/30'
            )}
          >
            {isScanning ? (
              <>
                <Loader2 className="w-12 h-12 text-terracotta animate-spin mb-4" />
                <p className="text-xs font-bold text-terracotta uppercase tracking-widest">Extracting Data...</p>
              </>
            ) : scanComplete ? (
              <>
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Data Extracted!</p>
                <p className="text-[10px] text-forest/40 mt-1">Check the form below</p>
              </>
            ) : (
              <>
                <Scan className="w-12 h-12 text-forest/20 mb-4" />
                <p className="text-xs font-bold text-forest/40 uppercase tracking-widest">Tap to Scan</p>
              </>
            )}
          </div>
        </div>

        {/* Transaction Ledger */}
        <div className="lg:col-span-2 card flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-forest">Transaction Ledger</h3>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/20" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-cream/50 border border-forest/5 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-terracotta/20"
                />
              </div>
              <button className="p-2 hover:bg-cream rounded-xl transition-colors">
                <Filter className="w-4 h-4 text-forest/40" />
              </button>
              <button
                onClick={() => setShowAddForm((v) => !v)}
                className="p-2 bg-forest text-white rounded-xl hover:bg-forest/80 transition-colors"
                title="Add transaction"
              >
                {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Add Transaction Form */}
          {showAddForm && (
            <div className="mb-6 p-5 bg-cream/40 rounded-2xl border border-forest/5 space-y-4">
              <p className="text-xs font-bold text-forest/40 uppercase tracking-widest">New Transaction</p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="input-field col-span-2 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  className="input-field py-2 text-sm"
                  min="0"
                  step="0.01"
                />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="input-field py-2 text-sm"
                />
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'income' | 'expense' }))}
                  className="input-field py-2 text-sm"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="input-field py-2 text-sm"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowAddForm(false)} className="btn-secondary px-5 py-2 text-sm">Cancel</button>
                <button onClick={addTransaction} className="btn-primary px-5 py-2 text-sm">Add Transaction</button>
              </div>
            </div>
          )}

          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-forest/40 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-forest/40 font-medium">
                  {searchQuery ? 'No matching transactions.' : 'No transactions yet. Add one above.'}
                </p>
              </div>
            ) : (
              filtered.map((tx) => {
                const Icon = CATEGORY_ICONS[tx.category] ?? DollarSign;
                return (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-cream/30 border border-forest/5 group hover:bg-cream/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={cn('p-3 rounded-xl bg-white shadow-sm', tx.type === 'income' ? 'text-green-600' : 'text-terracotta')}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-forest">{tx.description}</p>
                        <p className="text-[10px] font-bold text-forest/40 uppercase tracking-widest">
                          {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {tx.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <p className={cn('font-mono font-bold text-lg', tx.type === 'income' ? 'text-green-600' : 'text-forest')}>
                        {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                      </p>
                      <button className="text-forest/20 hover:text-forest/60 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
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
