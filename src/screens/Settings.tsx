import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Bell, 
  Shield, 
  User, 
  Cpu, 
  Zap, 
  Check,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'integrations' | 'system' | 'account'>('integrations');

  const integrations = [
    { name: 'Airtable', desc: 'Sync project data and tasks.', icon: Globe, connected: true },
    { name: 'Google Calendar', desc: 'Manage your schedule directly.', icon: Bell, connected: true },
    { name: 'Stripe', desc: 'Live cash flow and revenue tracking.', icon: Shield, connected: false },
    { name: 'Slack', desc: 'Team velocity and communication.', icon: Zap, connected: false },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold tracking-tight text-forest">Settings</h1>

      <div className="flex space-x-1 bg-white p-1 rounded-2xl border border-forest/5 shadow-sm w-fit">
        {(['integrations', 'system', 'account'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-8 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all",
              activeTab === tab 
                ? "bg-forest text-white shadow-md" 
                : "text-forest/40 hover:text-forest/60"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'integrations' && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {integrations.map((item, i) => (
                <div key={i} className="card flex items-center justify-between group hover:border-terracotta/30 transition-all">
                  <div className="flex items-center space-x-6">
                    <div className={cn(
                      "p-4 rounded-2xl",
                      item.connected ? "bg-forest text-cream" : "bg-cream text-forest/40"
                    )}>
                      <item.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-forest">{item.name}</h4>
                      <p className="text-sm text-forest/60">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {item.connected ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <Check className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-widest">Connected</span>
                      </div>
                    ) : (
                      <button className="btn-secondary px-6 py-2 text-sm">Connect</button>
                    )}
                    <button className="p-2 text-forest/20 group-hover:text-forest/40 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'system' && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card space-y-8"
            >
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-forest">System Preferences</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-forest/40 ml-1">Timezone</label>
                    <select className="input-field appearance-none bg-cream/30">
                      <option>London (GMT+0)</option>
                      <option>New York (EST)</option>
                      <option>San Francisco (PST)</option>
                      <option>Lisbon (WET)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-forest/40 ml-1">Currency</label>
                    <select className="input-field appearance-none bg-cream/30">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-forest/40 ml-1">AI Tone & Personality</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Executive', 'Creative', 'Direct'].map((tone) => (
                      <button 
                        key={tone}
                        className={cn(
                          "py-4 rounded-2xl border-2 font-bold transition-all",
                          tone === 'Executive' ? "border-terracotta bg-terracotta/5 text-terracotta" : "border-forest/5 text-forest/40 hover:border-forest/10"
                        )}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-forest/5 flex justify-end">
                <button className="btn-primary">Save Changes</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'account' && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card space-y-8"
            >
              <div className="flex items-center space-x-8">
                <div className="w-24 h-24 rounded-full bg-forest flex items-center justify-center text-cream text-4xl font-bold shadow-xl">
                  T
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-forest">Toni Martin</h3>
                  <p className="text-forest/60 font-medium">Founder & CEO, Vibecoding Lab</p>
                  <div className="flex space-x-4 mt-4">
                    <button className="text-xs font-bold text-terracotta uppercase tracking-widest hover:underline">Change Photo</button>
                    <button className="text-xs font-bold text-red-600 uppercase tracking-widest hover:underline">Delete Account</button>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-forest/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-forest/40 ml-1">Full Name</label>
                    <input type="text" defaultValue="Toni Martin" className="input-field" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-forest/40 ml-1">Email Address</label>
                    <input type="email" defaultValue="toni@vibecoding.lab" className="input-field" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card bg-forest text-cream border-none">
            <div className="flex items-center space-x-3 mb-6">
              <Cpu className="w-6 h-6 text-terracotta" />
              <h4 className="font-bold">System Status</h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-60">API Connection</span>
                <span className="text-green-400 font-bold">Stable</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-60">Database Sync</span>
                <span className="text-green-400 font-bold">Live</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="opacity-60">AI Engine</span>
                <span className="text-green-400 font-bold">v2.4.0</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h4 className="font-bold text-forest mb-4">Support & Documentation</h4>
            <div className="space-y-3">
              {[
                'Knowledge Base',
                'API Documentation',
                'Release Notes',
                'Contact Support'
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-cream transition-colors group">
                  <span className="text-sm font-medium text-forest/60 group-hover:text-forest">{item}</span>
                  <ExternalLink className="w-4 h-4 text-forest/20 group-hover:text-forest/40" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
