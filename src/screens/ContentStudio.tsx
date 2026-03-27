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
  PenTool,
  Loader2,
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Idea {
  title: string;
  description: string;
}

const DEFAULT_IDEAS: Idea[] = [
  { title: 'The Future of Vibecoding', description: 'How AI is changing the way we build software products.' },
  { title: 'Founder Burnout', description: 'Practical strategies for maintaining high performance long-term.' },
  { title: 'Q2 Roadmap Reveal', description: 'A deep dive into the new features coming to the Dashboard.' },
  { title: 'Knowledge Management', description: 'Why your personal brain needs a digital twin.' },
  { title: 'The 4-Hour Deep Work Block', description: 'How to structure your day for maximum creative output.' },
  { title: 'Investing in AI', description: 'What founders need to know about the current venture landscape.' },
];

export default function ContentStudio() {
  const [draft, setDraft] = useState('');
  const [refinedDraft, setRefinedDraft] = useState('');
  const [platform, setPlatform] = useState<'linkedin' | 'x' | 'email'>('linkedin');
  const [isRefining, setIsRefining] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>(DEFAULT_IDEAS);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [refineError, setRefineError] = useState('');

  const handleRefine = async () => {
    if (!draft.trim() || isRefining) return;
    setIsRefining(true);
    setRefineError('');

    try {
      const res = await fetch('/api/ai/draft-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft, platform }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRefinedDraft(data.content ?? '');
    } catch {
      setRefineError('Failed to refine. Check your connection and try again.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleGenerateIdeas = async () => {
    if (isGeneratingIdeas) return;
    setIsGeneratingIdeas(true);

    try {
      const res = await fetch('/api/ai/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.ideas?.length) setIdeas(data.ideas);
    } catch {
      // Silently fall back to existing ideas on error
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleDraftFromIdea = (idea: Idea) => {
    setDraft(`${idea.title}\n\n${idea.description}`);
    setRefinedDraft('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = () => {
    const content = refinedDraft || draft;
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const outputContent = refinedDraft || '';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight text-forest">Content Studio</h1>
        <button
          onClick={handleGenerateIdeas}
          disabled={isGeneratingIdeas}
          className="btn-primary flex items-center space-x-2"
        >
          <RefreshCw className={cn('w-5 h-5', isGeneratingIdeas && 'animate-spin')} />
          <span>{isGeneratingIdeas ? 'Generating...' : 'Fresh Ideas'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Post Drafter */}
        <div className="card flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-forest">Post Drafter</h3>
            <div className="flex bg-cream p-1 rounded-xl border border-forest/5">
              {(['linkedin', 'x', 'email'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={cn('p-2 rounded-lg transition-all', platform === p ? 'bg-white text-forest shadow-sm' : 'text-forest/40')}
                >
                  {p === 'linkedin' && <Linkedin className="w-5 h-5" />}
                  {p === 'x' && <Twitter className="w-5 h-5" />}
                  {p === 'email' && <Mail className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Drop your rough ideas here..."
            className="flex-1 bg-cream/30 rounded-2xl p-6 text-forest font-medium focus:outline-none focus:ring-2 focus:ring-terracotta/20 resize-none"
          />

          {refineError && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{refineError}</p>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleRefine}
              disabled={!draft.trim() || isRefining}
              className="btn-secondary flex items-center space-x-2 disabled:opacity-40"
            >
              {isRefining ? (
                <Loader2 className="w-5 h-5 text-terracotta animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5 text-terracotta" />
              )}
              <span>{isRefining ? 'Refining...' : 'Refine with AI'}</span>
            </button>
          </div>
        </div>

        {/* Drafted Output */}
        <div className="card bg-forest text-cream flex flex-col h-[600px] border-none">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Drafted Output</h3>
            <button
              onClick={handleCopy}
              disabled={!outputContent}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
            >
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex-1 bg-white/5 rounded-2xl p-8 overflow-y-auto">
            {isRefining ? (
              <div className="h-full flex flex-col items-center justify-center opacity-40">
                <Loader2 className="w-12 h-12 mb-4 animate-spin" />
                <p className="font-medium">Crafting your post...</p>
              </div>
            ) : outputContent ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-terracotta" />
                  <div>
                    <p className="font-bold">Toni Martin</p>
                    <p className="text-xs opacity-60">Founder @ Vibecoding Lab</p>
                  </div>
                </div>
                <p className="text-lg leading-relaxed whitespace-pre-wrap">{outputContent}</p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <PenTool className="w-12 h-12 mb-4" />
                <p className="font-medium">Your refined draft will appear here.</p>
                <p className="text-sm mt-2 opacity-70">Write a rough draft on the left, then hit "Refine with AI".</p>
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
                <button
                  onClick={() => handleDraftFromIdea(idea)}
                  className="btn-secondary px-4 py-2 text-xs"
                >
                  Draft
                </button>
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
