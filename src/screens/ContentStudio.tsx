import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Linkedin, 
  Twitter, 
  Mail, 
  Sparkles, 
  RefreshCw,
  Copy,
  Check,
  PenTool
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function ContentStudio() {
  const [draft, setDraft] = useState('');
  const [platform, setPlatform] = useState<'linkedin' | 'x' | 'email'>('linkedin');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ideas = [
    { title: 'The Future of Vibecoding', description: 'How AI is changing the way we build software products.' },
    { title: 'Founder Burnout', description: 'Practical strategies for maintaining high performance long-term.' },
    { title: 'Q2 Roadmap Reveal', description: 'A deep dive into the new features coming to Toni\'s HQ.' },
    { title: 'Knowledge Management', description: 'Why your personal brain needs a digital twin.' },
    { title: 'The 4-Hour Deep Work Block', description: 'How to structure your day for maximum creative output.' },
    { title: 'Investing in AI', description: 'What founders need to know about the current venture landscape.' },
  ];

  const simulateGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight text-forest">Content Studio</h1>
        <button 
          onClick={simulateGeneration}
          className="btn-primary flex items-center space-x-2"
        >
          <RefreshCw className={cn("w-5 h-5", isGenerating && "animate-spin")} />
          <span>Sync with Knowledge Base</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Post Drafter */}
        <div className="card flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-forest">Post Drafter</h3>
            <div className="flex bg-cream p-1 rounded-xl border border-forest/5">
              <button 
                onClick={() => setPlatform('linkedin')}
                className={cn("p-2 rounded-lg transition-all", platform === 'linkedin' ? "bg-white text-forest shadow-sm" : "text-forest/40")}
              >
                <Linkedin className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setPlatform('x')}
                className={cn("p-2 rounded-lg transition-all", platform === 'x' ? "bg-white text-forest shadow-sm" : "text-forest/40")}
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setPlatform('email')}
                className={cn("p-2 rounded-lg transition-all", platform === 'email' ? "bg-white text-forest shadow-sm" : "text-forest/40")}
              >
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <textarea 
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Drop your rough ideas here..."
            className="flex-1 bg-cream/30 rounded-2xl p-6 text-forest font-medium focus:outline-none focus:ring-2 focus:ring-terracotta/20 resize-none"
          />
          
          <div className="mt-6 flex justify-end">
            <button className="btn-secondary flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-terracotta" />
              <span>Refine with AI</span>
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="card bg-forest text-cream flex flex-col h-[600px] border-none">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Drafted Output</h3>
            <button 
              onClick={handleCopy}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="flex-1 bg-white/5 rounded-2xl p-8 overflow-y-auto">
            {draft ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-terracotta" />
                  <div>
                    <p className="font-bold">Toni Martin</p>
                    <p className="text-xs opacity-60">Founder @ Vibecoding Lab</p>
                  </div>
                </div>
                <p className="text-lg leading-relaxed whitespace-pre-wrap">{draft}</p>
                <div className="pt-6 border-t border-white/10">
                  <p className="text-terracotta font-bold">#vibecoding #founderlife #ai</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <PenTool className="w-12 h-12 mb-4" />
                <p className="font-medium">Your refined draft will appear here.</p>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <button className="w-full btn-primary py-4 flex items-center justify-center space-x-2">
              <Send className="w-5 h-5" />
              <span>Schedule Post</span>
            </button>
          </div>
        </div>
      </div>

      {/* Idea Generator */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-forest">Idea Generator</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="card group hover:border-terracotta/30"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-cream rounded-xl group-hover:bg-terracotta/10 transition-colors">
                  <Sparkles className="w-6 h-6 text-terracotta" />
                </div>
                <button className="btn-secondary px-4 py-2 text-xs">Draft</button>
              </div>
              <h4 className="text-lg font-bold text-forest mb-2">{idea.title}</h4>
              <p className="text-sm text-forest/60 leading-relaxed">{idea.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
