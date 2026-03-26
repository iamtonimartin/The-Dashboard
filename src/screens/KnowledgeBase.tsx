import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  FileCode, 
  Search, 
  MessageSquare,
  Bot,
  Send,
  Paperclip,
  MoreVertical,
  User
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function KnowledgeBase() {
  const [query, setQuery] = useState('');

  const uploads = [
    { name: 'Q2 Strategy.pdf', size: '2.4 MB', type: 'pdf', date: '2h ago' },
    { name: 'Investor Deck.pptx', size: '12.8 MB', type: 'ppt', date: 'Yesterday' },
    { name: 'Product Specs.docx', size: '840 KB', type: 'doc', date: 'Mar 21' },
    { name: 'Architecture.png', size: '4.2 MB', type: 'img', date: 'Mar 20' },
  ];

  const chat = [
    { role: 'user', content: 'What were the main risks identified in the Q2 Strategy document?' },
    { role: 'assistant', content: 'Based on the "Q2 Strategy.pdf" (page 14), the primary risks are: \n\n1. Market saturation in the enterprise segment.\n2. Potential delays in the AI integration module.\n3. Competitive pressure from emerging low-code platforms.\n\nWould you like me to draft a mitigation plan for these?' },
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'pdf': return <FileText className="text-red-500" />;
      case 'img': return <ImageIcon className="text-blue-500" />;
      case 'doc': return <FileCode className="text-indigo-500" />;
      default: return <FileText className="text-forest/40" />;
    }
  };

  return (
    <div className="space-y-8 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <h1 className="text-4xl font-bold tracking-tight text-forest">Knowledge Base</h1>
        <div className="relative w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/20" />
          <input 
            type="text" 
            placeholder="Search your digital brain..." 
            className="input-field pl-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        {/* Document Manager */}
        <div className="lg:col-span-1 flex flex-col space-y-6 overflow-hidden">
          <div className="card border-2 border-dashed border-forest/10 bg-cream/20 flex flex-col items-center justify-center py-12 text-center group hover:border-terracotta/30 transition-all cursor-pointer">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-terracotta" />
            </div>
            <h4 className="font-bold text-forest">Upload Knowledge</h4>
            <p className="text-xs text-forest/40 mt-1">Drag & drop PDF, DOCX, or Images</p>
          </div>

          <div className="card flex-1 flex flex-col overflow-hidden">
            <h3 className="text-xl font-bold text-forest mb-6">Recent Uploads</h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {uploads.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-cream/30 border border-forest/5 group hover:bg-cream/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      {getIcon(file.type)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-forest truncate w-32">{file.name}</p>
                      <p className="text-[10px] font-bold text-forest/40 uppercase tracking-widest">{file.size} • {file.date}</p>
                    </div>
                  </div>
                  <button className="text-forest/20 hover:text-forest/60 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Knowledge Chat */}
        <div className="lg:col-span-2 card flex flex-col overflow-hidden p-0">
          <div className="p-6 border-b border-forest/5 flex items-center justify-between bg-white rounded-t-3xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-forest rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-terracotta" />
              </div>
              <div>
                <h3 className="font-bold text-forest">HQ Co-Pilot</h3>
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Online • Referencing 12 Docs</p>
              </div>
            </div>
            <button className="p-2 hover:bg-cream rounded-xl transition-colors">
              <MessageSquare className="w-5 h-5 text-forest/40" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-cream/10">
            {chat.map((msg, i) => (
              <div key={i} className={cn(
                "flex max-w-[80%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center",
                  msg.role === 'user' ? "bg-terracotta ml-3" : "bg-forest mr-3"
                )}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-terracotta" />}
                </div>
                <div className={cn(
                  "p-5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                  msg.role === 'user' ? "bg-white text-forest rounded-tr-none" : "bg-forest text-cream rounded-tl-none"
                )}>
                  {msg.content.split('\n').map((line, j) => (
                    <p key={j} className={j > 0 ? "mt-2" : ""}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-white rounded-b-3xl border-t border-forest/5">
            <div className="relative">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask your knowledge base anything..."
                className="input-field pr-24 py-4"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <button className="p-2 text-forest/20 hover:text-forest/40 transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2 bg-terracotta text-white rounded-xl hover:bg-terracotta/90 transition-colors shadow-md shadow-terracotta/20">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
