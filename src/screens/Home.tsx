import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  Package, 
  Zap,
  ArrowRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export default function Home() {
  const [focusMode, setFocusMode] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Morning');
    else if (hour < 18) setGreeting('Afternoon');
    else setGreeting('Evening');
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((time) => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, pomodoroTime]);

  const formatPomoTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const widgets = [
    { id: 'briefing', title: 'Daily Briefing', size: 'col-span-full', focus: true },
    { id: 'pomo', title: 'Pomodoro', size: 'col-span-1', focus: true },
    { id: 'next', title: 'Next Up', size: 'col-span-1', focus: true },
    { id: 'path', title: 'The Daily Path', size: 'col-span-1', focus: true },
    { id: 'pulse', title: 'Project Pulse', size: 'col-span-1', focus: false },
    { id: 'ops', title: 'Home Ops', size: 'col-span-1', focus: false },
    { id: 'cash', title: 'Cash Flow', size: 'col-span-1', focus: false },
  ];

  const filteredWidgets = focusMode ? widgets.filter(w => w.focus) : widgets;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-forest">
            Good {greeting}, Toni
          </h1>
          <p className="text-forest/60 mt-1 font-medium">Here's your command overview for today.</p>
        </div>
        
        <button 
          onClick={() => setFocusMode(!focusMode)}
          className={cn(
            "flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300",
            focusMode 
              ? "bg-terracotta text-white shadow-lg shadow-terracotta/20" 
              : "bg-white text-forest border border-forest/10 hover:bg-cream"
          )}
        >
          <Zap className={cn("w-5 h-5", focusMode ? "fill-white" : "")} />
          <span>{focusMode ? 'Focus Mode Active' : 'Enter Focus Mode'}</span>
        </button>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredWidgets.map((widget) => (
            <motion.div
              key={widget.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={cn("card h-full flex flex-col", widget.size)}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-forest">{widget.title}</h3>
                <button className="text-forest/20 hover:text-forest/40 transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {widget.id === 'briefing' && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex items-center space-x-6">
                    <div className="bg-cream p-4 rounded-2xl">
                      <Calendar className="w-8 h-8 text-terracotta" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-forest/40 uppercase tracking-widest">Today's Date</p>
                      <p className="text-xl font-bold text-forest">{format(new Date(), 'MMMM do, yyyy')}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 max-w-xl">
                    <p className="text-sm font-bold text-forest/40 uppercase tracking-widest mb-3">Top 3 Priorities</p>
                    <div className="space-y-2">
                      {['Finalize Q2 Strategy', 'Investor Update Call', 'Review Content Calendar'].map((p, i) => (
                        <div key={i} className="flex items-center space-x-3 bg-cream/30 p-3 rounded-xl border border-forest/5">
                          <CheckCircle2 className="w-5 h-5 text-terracotta" />
                          <span className="font-medium text-forest">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {widget.id === 'pomo' && (
                <div className="flex flex-col items-center justify-center flex-1 py-4">
                  <div className="relative w-40 h-40 mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-cream"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * (pomodoroTime / (25 * 60)))}
                        className="text-terracotta transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-mono font-bold text-forest">
                        {formatPomoTime(pomodoroTime)}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => setIsActive(!isActive)}
                      className="p-3 bg-forest text-white rounded-full hover:bg-forest/90 transition-colors"
                    >
                      {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                    </button>
                    <button 
                      onClick={() => { setIsActive(false); setPomodoroTime(25 * 60); }}
                      className="p-3 bg-cream text-forest rounded-full hover:bg-forest/10 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {widget.id === 'pulse' && (
                <div className="space-y-4 flex-1">
                  {[
                    { name: 'Vibecoding Platform', status: 'On Track', color: 'text-green-600' },
                    { name: 'HQ Mobile App', status: 'At Risk', color: 'text-terracotta' },
                    { name: 'Brand Refresh', status: 'On Track', color: 'text-green-600' }
                  ].map((project, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-cream/20 border border-forest/5">
                      <span className="font-bold text-forest">{project.name}</span>
                      <span className={cn("text-xs font-bold uppercase tracking-widest px-3 py-1 bg-white rounded-full border border-forest/5", project.color)}>
                        {project.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {widget.id === 'cash' && (
                <div className="flex-1 flex flex-col justify-center space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-sm font-bold text-forest/40 uppercase tracking-widest">Monthly Burn</p>
                      <p className="text-lg font-bold text-forest">$12,450</p>
                    </div>
                    <div className="h-2 bg-cream rounded-full overflow-hidden">
                      <div className="h-full bg-forest w-3/4" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <p className="text-sm font-bold text-forest/40 uppercase tracking-widest">Runway</p>
                      <p className="text-lg font-bold text-forest">18 Months</p>
                    </div>
                    <div className="h-2 bg-cream rounded-full overflow-hidden">
                      <div className="h-full bg-terracotta w-full" />
                    </div>
                  </div>
                </div>
              )}

              {widget.id === 'next' && (
                <div className="flex-1 flex flex-col justify-center">
                  <div className="bg-forest text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <Clock className="w-5 h-5 text-terracotta" />
                      <span className="text-xs font-bold uppercase tracking-widest opacity-60">11:30 AM - 12:30 PM</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Product Strategy Sync</h4>
                    <p className="text-sm opacity-80">Reviewing the v2.0 roadmap with the core engineering team.</p>
                  </div>
                </div>
              )}

              {widget.id === 'path' && (
                <div className="flex-1 space-y-3">
                  {[
                    { label: 'Morning Reflection', done: true },
                    { label: 'Deep Work Block 1', done: true },
                    { label: 'Team Standup', done: false },
                    { label: 'Client Outreach', done: false }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className={cn(
                        "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
                        item.done ? "bg-terracotta border-terracotta" : "border-forest/20"
                      )}>
                        {item.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className={cn("font-medium", item.done ? "text-forest/40 line-through" : "text-forest")}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {widget.id === 'ops' && (
                <div className="flex-1 space-y-3">
                  {[
                    'Restock Pantry',
                    'Book Flight to Lisbon',
                    'Schedule Car Service'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-cream/30 border border-forest/5">
                      <span className="text-sm font-medium text-forest">{item}</span>
                      <button className="text-forest/20 hover:text-terracotta transition-colors">
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
