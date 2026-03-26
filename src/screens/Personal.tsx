import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, 
  Footprints, 
  Focus, 
  Heart, 
  CheckCircle2, 
  History, 
  BookOpen,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Personal() {
  const [showHistory, setShowHistory] = useState(false);

  const wellness = [
    { label: 'Sleep', value: '7h 45m', icon: Moon, color: 'text-indigo-600', trend: '+12%' },
    { label: 'Steps', value: '8,432', icon: Footprints, color: 'text-orange-600', trend: '-5%' },
    { label: 'Deep Work', value: '4.5h', icon: Focus, color: 'text-forest', trend: '+20%' },
    { label: 'Heart Rate', value: '62 bpm', icon: Heart, color: 'text-red-600', trend: 'Stable' },
  ];

  const habits = [
    { name: 'Morning Meditation', done: true },
    { name: 'Read 20 Pages', done: true },
    { name: 'No Caffeine after 2PM', done: false },
    { name: 'Evening Reflection', done: false },
  ];

  const books = [
    { title: 'The Almanack of Naval Ravikant', author: 'Eric Jorgenson', status: 'Reading' },
    { title: 'High Output Management', author: 'Andrew Grove', status: 'Done' },
    { title: 'Zero to One', author: 'Peter Thiel', status: 'To Read' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold tracking-tight text-forest">Personal (Life OS)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wellness.map((item, i) => (
          <div key={i} className="card flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div className={cn("p-3 rounded-xl bg-cream", item.color)}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className={cn("text-[10px] font-bold px-2 py-1 rounded-lg bg-cream", 
                item.trend.startsWith('+') ? "text-green-600" : item.trend.startsWith('-') ? "text-red-600" : "text-forest/40"
              )}>
                {item.trend}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-forest/40 uppercase tracking-widest">{item.label}</p>
              <p className="text-2xl font-bold text-forest">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Habit Tracker */}
        <div className="card lg:col-span-1">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-forest">Daily Non-Negotiables</h3>
            <button className="p-2 hover:bg-cream rounded-lg transition-colors"><Plus className="w-5 h-5 text-forest/40" /></button>
          </div>
          <div className="space-y-4">
            {habits.map((habit, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-cream/30 border border-forest/5">
                <span className={cn("font-bold", habit.done ? "text-forest/40 line-through" : "text-forest")}>
                  {habit.name}
                </span>
                <button className={cn(
                  "w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all",
                  habit.done ? "bg-terracotta border-terracotta text-white" : "border-forest/10 text-transparent"
                )}>
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Reflection */}
        <div className="card lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-forest">Daily Reflection</h3>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-2 text-sm font-bold text-forest/40 hover:text-terracotta transition-colors"
            >
              <History className="w-4 h-4" />
              <span>{showHistory ? 'Back to Editor' : 'View History'}</span>
            </button>
          </div>
          
          <div className="flex-1 bg-cream/30 rounded-2xl p-6 min-h-[300px]">
            {showHistory ? (
              <div className="space-y-6">
                {[
                  { date: 'Yesterday', text: 'Productive day focusing on the new roadmap. Need to improve sleep quality.' },
                  { date: 'March 22', text: 'Great investor call. Feeling energized about the Q2 vision.' }
                ].map((entry, i) => (
                  <div key={i} className="border-b border-forest/5 pb-4">
                    <p className="text-xs font-bold text-terracotta uppercase tracking-widest mb-1">{entry.date}</p>
                    <p className="text-forest/80 italic">"{entry.text}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <textarea 
                placeholder="What's on your mind today, Toni?"
                className="w-full h-full bg-transparent resize-none focus:outline-none text-forest font-medium leading-relaxed"
              />
            )}
          </div>
          
          {!showHistory && (
            <div className="mt-6 flex justify-end">
              <button className="btn-primary">Save Reflection</button>
            </div>
          )}
        </div>
      </div>

      {/* Learning */}
      <div className="card">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-cream rounded-xl text-forest">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-forest">Learning & Reading List</h3>
          </div>
          <button className="btn-secondary px-6 py-2 text-sm">Add Resource</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book, i) => (
            <div key={i} className="p-6 rounded-3xl bg-cream/20 border border-forest/5 flex flex-col justify-between h-48">
              <div>
                <h4 className="font-bold text-forest text-lg mb-1">{book.title}</h4>
                <p className="text-sm text-forest/60">{book.author}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                  book.status === 'Reading' ? "bg-blue-50 text-blue-600 border-blue-100" :
                  book.status === 'Done' ? "bg-green-50 text-green-600 border-green-100" :
                  "bg-cream text-forest/40 border-forest/5"
                )}>
                  {book.status}
                </span>
                <div className="flex space-x-1">
                  {[1, 2, 3].map(n => <div key={n} className="w-1.5 h-1.5 rounded-full bg-forest/10" />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
