import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  AlertCircle, 
  Users, 
  Plus, 
  MoreHorizontal,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function CommandCentre() {
  const [activeTab, setActiveTab] = useState<'pulse' | 'tasks' | 'ops'>('pulse');

  const stats = [
    { label: 'Active Projects', value: '12', icon: BarChart3, color: 'text-forest' },
    { label: 'Critical Risks', value: '2', icon: AlertCircle, color: 'text-terracotta' },
    { label: 'Team Velocity', value: '94%', icon: Users, color: 'text-blue-600' },
  ];

  const projects = [
    { name: 'Vibecoding Platform', lead: 'Sarah K.', status: 'On Track', health: 92, risk: 'Low' },
    { name: 'HQ Mobile App', lead: 'Marcus J.', status: 'At Risk', health: 64, risk: 'High' },
    { name: 'Brand Refresh', lead: 'Elena R.', status: 'On Track', health: 88, risk: 'Low' },
    { name: 'Investor Deck v2', lead: 'Toni M.', status: 'Delayed', health: 45, risk: 'Medium' },
  ];

  const kanbanColumns = [
    { id: 'todo', title: 'To Do', tasks: ['Review Q2 Budget', 'Hire Design Lead', 'Update Roadmap'] },
    { id: 'progress', title: 'In Progress', tasks: ['Investor Outreach', 'Product Specs v2'] },
    { id: 'done', title: 'Done', tasks: ['Q1 Report', 'Team Offsite Planning'] },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight text-forest">Command Centre</h1>
        <div className="flex bg-white p-1 rounded-2xl border border-forest/5 shadow-sm">
          {(['pulse', 'tasks', 'ops'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all",
                activeTab === tab 
                  ? "bg-forest text-white shadow-md" 
                  : "text-forest/40 hover:text-forest/60"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'pulse' && (
          <motion.div
            key="pulse"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="card flex items-center space-x-6">
                  <div className={cn("p-4 rounded-2xl bg-cream", stat.color)}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-forest/40 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-bold text-forest">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-forest">Project Health Overview</h3>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-cream rounded-lg transition-colors"><Search className="w-5 h-5 text-forest/40" /></button>
                  <button className="p-2 hover:bg-cream rounded-lg transition-colors"><Filter className="w-5 h-5 text-forest/40" /></button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-forest/5">
                      <th className="pb-4 text-xs font-bold text-forest/40 uppercase tracking-widest">Project Name</th>
                      <th className="pb-4 text-xs font-bold text-forest/40 uppercase tracking-widest">Lead</th>
                      <th className="pb-4 text-xs font-bold text-forest/40 uppercase tracking-widest">Status</th>
                      <th className="pb-4 text-xs font-bold text-forest/40 uppercase tracking-widest">Health</th>
                      <th className="pb-4 text-xs font-bold text-forest/40 uppercase tracking-widest">Risk</th>
                      <th className="pb-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest/5">
                    {projects.map((project, i) => (
                      <tr key={i} className="group hover:bg-cream/20 transition-colors">
                        <td className="py-4 font-bold text-forest">{project.name}</td>
                        <td className="py-4 text-forest/60 font-medium">{project.lead}</td>
                        <td className="py-4">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                            project.status === 'On Track' ? "bg-green-50 text-green-600 border-green-100" :
                            project.status === 'At Risk' ? "bg-orange-50 text-terracotta border-orange-100" :
                            "bg-red-50 text-red-600 border-red-100"
                          )}>
                            {project.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 h-1.5 bg-cream rounded-full w-24 overflow-hidden">
                              <div 
                                className={cn("h-full rounded-full", project.health > 80 ? "bg-green-500" : project.health > 50 ? "bg-terracotta" : "bg-red-500")} 
                                style={{ width: `${project.health}%` }} 
                              />
                            </div>
                            <span className="text-xs font-bold text-forest/60">{project.health}%</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={cn(
                            "text-xs font-bold",
                            project.risk === 'High' ? "text-red-600" : project.risk === 'Medium' ? "text-terracotta" : "text-green-600"
                          )}>
                            {project.risk}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="w-5 h-5 text-forest/40" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tasks' && (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {kanbanColumns.map((col) => (
              <div key={col.id} className="space-y-4">
                <div className="flex items-center justify-between px-4">
                  <h4 className="text-sm font-bold text-forest/40 uppercase tracking-widest">{col.title}</h4>
                  <span className="bg-cream text-forest/60 text-xs font-bold px-2 py-1 rounded-lg">{col.tasks.length}</span>
                </div>
                <div className="space-y-3">
                  {col.tasks.map((task, i) => (
                    <div key={i} className="card p-5 hover:border-terracotta/30 cursor-grab active:cursor-grabbing">
                      <p className="font-bold text-forest mb-4">{task}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {[1, 2].map(n => (
                            <div key={n} className="w-6 h-6 rounded-full bg-cream border-2 border-white flex items-center justify-center text-[8px] font-bold">TM</div>
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-forest/40 uppercase tracking-widest">2 Days Left</span>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-4 border-2 border-dashed border-forest/10 rounded-2xl text-forest/40 font-bold hover:border-forest/20 hover:text-forest/60 transition-all flex items-center justify-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Add Task</span>
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'ops' && (
          <motion.div
            key="ops"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="card">
              <h3 className="text-xl font-bold text-forest mb-6">Personal Backlog Manager</h3>
              <div className="flex space-x-3 mb-8">
                <input 
                  type="text" 
                  placeholder="What needs to be done?" 
                  className="input-field flex-1"
                />
                <button className="btn-primary flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Add</span>
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Renew Passport', cat: 'Admin' },
                  { label: 'Fix Kitchen Sink', cat: 'Home' },
                  { label: 'Book Summer Vacation', cat: 'Life' },
                  { label: 'Update Insurance Policy', cat: 'Admin' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-cream/30 border border-forest/5 group">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 rounded-full bg-terracotta" />
                      <div>
                        <p className="font-bold text-forest">{item.label}</p>
                        <p className="text-[10px] font-bold text-forest/40 uppercase tracking-widest">{item.cat}</p>
                      </div>
                    </div>
                    <button className="text-forest/20 hover:text-green-600 transition-colors">
                      <CheckCircle2 className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
