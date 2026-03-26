import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeScreen, setActiveScreen] = useState<Screen>('home');

  // Load auth state from localStorage
  useEffect(() => {
    const auth = localStorage.getItem('toni_hq_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('toni_hq_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('toni_hq_auth');
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

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
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
