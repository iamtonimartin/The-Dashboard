import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './screens/Login';
import Home from './screens/Home';
import CommandCentre from './screens/CommandCentre';
import ContentStudio from './screens/ContentStudio';
import Personal from './screens/Personal';
import KnowledgeBase from './screens/KnowledgeBase';
import Finance from './screens/Finance';
import Settings from './screens/Settings';
import { Screen } from './types';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeScreen, setActiveScreen] = useState<Screen>('home');

  useEffect(() => {
    // Get existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home': return <Home />;
      case 'command': return <CommandCentre />;
      case 'content': return <ContentStudio />;
      case 'personal': return <Personal />;
      case 'knowledge': return <KnowledgeBase />;
      case 'finance': return <Finance />;
      case 'settings': return <Settings />;
      default: return <Home />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-forest flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
        onLogout={handleLogout}
      />

      <main className="pl-64 min-h-screen flex flex-col">
        <Header />

        <div className="flex-1 p-8 md:p-12 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
