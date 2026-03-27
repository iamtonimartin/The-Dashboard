import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  AlertCircle,
  Users,
  Plus,
  MoreHorizontal,
  Search,
  Filter,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { Project, Task } from '../types';

export default function CommandCentre() {
  const [activeTab, setActiveTab] = useState<'pulse' | 'tasks' | 'ops'>('pulse');

  // ── Pulse tab state ──────────────────────────────────────────────────────
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // ── Tasks tab state ──────────────────────────────────────────────────────
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState<Record<string, string>>({
    todo: '',
    'in-progress': '',
    done: '',
  });

  // ── Ops tab state ────────────────────────────────────────────────────────
  const [backlogInput, setBacklogInput] = useState('');
  const [backlogItems, setBacklogItems] = useState<Task[]>([]);

  // ── Fetch projects ───────────────────────────────────────────────────────
  useEffect(() => {
    fetchProjects();
  }, []);

  // ── Fetch tasks whenever tab changes to tasks or ops ─────────────────────
  useEffect(() => {
    if (activeTab === 'tasks' || activeTab === 'ops') {
      fetchTasks();
    }
  }, [activeTab]);

  async function fetchProjects() {
    setProjectsLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setProjects(data);
    setProjectsLoading(false);
  }

  async function fetchTasks() {
    setTasksLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error && data) {
      setTasks(data.filter((t: Task) => !t.category));
      setBacklogItems(data.filter((t: Task) => !!t.category));
    }
    setTasksLoading(false);
  }

  async function addTask(status: Task['status']) {
    const title = newTaskTitle[status].trim();
    if (!title) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({ title, status, priority: 'medium' })
      .select()
      .single();

    if (!error && data) {
      setTasks((prev) => [...prev, data]);
      setNewTaskTitle((prev) => ({ ...prev, [status]: '' }));
    }
  }

  async function moveTask(taskId: string, newStatus: Task['status']) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
  }

  async function addBacklogItem() {
    const title = backlogInput.trim();
    if (!title) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({ title, status: 'todo', priority: 'medium', category: 'General' })
      .select()
      .single();

    if (!error && data) {
      setBacklogItems((prev) => [...prev, data]);
      setBacklogInput('');
    }
  }

  async function completeBacklogItem(id: string) {
    setBacklogItems((prev) => prev.filter((t) => t.id !== id));
    await supabase.from('tasks').update({ status: 'done' }).eq('id', id);
  }

  // ── Derived stats ────────────────────────────────────────────────────────
  const criticalRisks = projects.filter((p) => p.risk === 'High').length;
  const atRiskProjects = projects.filter((p) => p.status !== 'on-track').length;
  const avgHealth =
    projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + p.health, 0) / projects.length)
      : 0;

  const kanbanColumns: { id: Task['status']; title: string }[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
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
                'px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all',
                activeTab === tab
                  ? 'bg-forest text-white shadow-md'
                  : 'text-forest/40 hover:text-forest/60'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── PULSE TAB ───────────────────────────────────────────────────── */}
        {activeTab === 'pulse' && (
          <motion.div
            key="pulse"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Active Projects', value: projects.length.toString(), icon: BarChart3, color: 'text-forest' },
                { label: 'Critical Risks', value: criticalRisks.toString(), icon: AlertCircle, color: 'text-terracotta' },
                { label: 'Avg Health', value: `${avgHealth}%`, icon: Users, color: 'text-blue-600' },
              ].map((stat, i) => (
                <div key={i} className="card flex items-center space-x-6">
                  <div className={cn('p-4 rounded-2xl bg-cream', stat.color)}>
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
                  <button className="p-2 hover:bg-cream rounded-lg transition-colors">
                    <Search className="w-5 h-5 text-forest/40" />
                  </button>
                  <button className="p-2 hover:bg-cream rounded-lg transition-colors">
                    <Filter className="w-5 h-5 text-forest/40" />
                  </button>
                </div>
              </div>

              {projectsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 text-forest/40 animate-spin" />
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-forest/40 font-medium">No projects yet.</p>
                  <p className="text-forest/30 text-sm mt-1">Add projects in your Supabase dashboard to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-forest/5">
                        <th className="pb-4 text-xs font-bold text-forest/40 uppercase tracking-widest">Project</th>
                        <th className="pb-4 text-xs font-bold text-forest/40 uppercase tracking-widest">Lead</th>
                        <th className="pb-4 text-xs font-bold text-forest/40 uppercase tracking-widest">Status</th>
                        <th className="pb-4 text-xs font-bold text-forest/40 uppercase tracking-widest">Health</th>
                        <th className="pb-4 text-xs font-bold text-forest/40 uppercase tracking-widest">Risk</th>
                        <th className="pb-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-forest/5">
                      {projects.map((project) => (
                        <tr key={project.id} className="group hover:bg-cream/20 transition-colors">
                          <td className="py-4 font-bold text-forest">{project.name}</td>
                          <td className="py-4 text-forest/60 font-medium">{project.lead ?? '—'}</td>
                          <td className="py-4">
                            <span className={cn(
                              'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border',
                              project.status === 'on-track' ? 'bg-green-50 text-green-600 border-green-100' :
                              project.status === 'at-risk' ? 'bg-orange-50 text-terracotta border-orange-100' :
                              'bg-red-50 text-red-600 border-red-100'
                            )}>
                              {project.status.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex-1 h-1.5 bg-cream rounded-full w-24 overflow-hidden">
                                <div
                                  className={cn('h-full rounded-full', project.health > 80 ? 'bg-green-500' : project.health > 50 ? 'bg-terracotta' : 'bg-red-500')}
                                  style={{ width: `${project.health}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-forest/60">{project.health}%</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className={cn(
                              'text-xs font-bold',
                              project.risk === 'High' ? 'text-red-600' :
                              project.risk === 'Medium' ? 'text-terracotta' :
                              'text-green-600'
                            )}>
                              {project.risk}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-5 h-5 text-forest/40" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── TASKS TAB (KANBAN) ───────────────────────────────────────────── */}
        {activeTab === 'tasks' && (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {tasksLoading ? (
              <div className="col-span-3 flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-forest/40 animate-spin" />
              </div>
            ) : (
              kanbanColumns.map((col) => {
                const colTasks = tasks.filter((t) => t.status === col.id);
                return (
                  <div key={col.id} className="space-y-4">
                    <div className="flex items-center justify-between px-4">
                      <h4 className="text-sm font-bold text-forest/40 uppercase tracking-widest">{col.title}</h4>
                      <span className="bg-cream text-forest/60 text-xs font-bold px-2 py-1 rounded-lg">
                        {colTasks.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {colTasks.map((task) => (
                        <div key={task.id} className="card p-5 hover:border-terracotta/30">
                          <p className="font-bold text-forest mb-4">{task.title}</p>
                          <div className="flex items-center justify-between">
                            <span className={cn(
                              'text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full',
                              task.priority === 'high' ? 'bg-red-50 text-red-600' :
                              task.priority === 'medium' ? 'bg-orange-50 text-terracotta' :
                              'bg-green-50 text-green-600'
                            )}>
                              {task.priority}
                            </span>
                            {col.id !== 'done' && (
                              <button
                                onClick={() => moveTask(task.id, col.id === 'todo' ? 'in-progress' : 'done')}
                                className="text-[10px] font-bold text-forest/40 hover:text-forest transition-colors uppercase tracking-widest"
                              >
                                {col.id === 'todo' ? 'Start →' : 'Complete →'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newTaskTitle[col.id]}
                          onChange={(e) => setNewTaskTitle((prev) => ({ ...prev, [col.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && addTask(col.id)}
                          placeholder="New task..."
                          className="input-field flex-1 py-2 text-sm"
                        />
                        <button
                          onClick={() => addTask(col.id)}
                          className="p-2 bg-forest text-white rounded-xl hover:bg-forest/80 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}

        {/* ── OPS TAB (BACKLOG) ───────────────────────────────────────────── */}
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
                  value={backlogInput}
                  onChange={(e) => setBacklogInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addBacklogItem()}
                  placeholder="What needs to be done?"
                  className="input-field flex-1"
                />
                <button onClick={addBacklogItem} className="btn-primary flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Add</span>
                </button>
              </div>

              {tasksLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-forest/40 animate-spin" />
                </div>
              ) : backlogItems.length === 0 ? (
                <p className="text-center text-forest/40 font-medium py-8">Backlog is clear. Nice work.</p>
              ) : (
                <div className="space-y-4">
                  {backlogItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-cream/30 border border-forest/5 group">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 rounded-full bg-terracotta" />
                        <div>
                          <p className="font-bold text-forest">{item.title}</p>
                          <p className="text-[10px] font-bold text-forest/40 uppercase tracking-widest">
                            {item.category ?? 'General'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => completeBacklogItem(item.id)}
                        className="text-forest/20 hover:text-green-600 transition-colors"
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
