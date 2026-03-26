import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-cream/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center text-cream font-bold">
          T
        </div>
        <div>
          <h2 className="font-semibold text-forest">Toni Martin</h2>
          <p className="text-xs text-forest/60">Founder & CEO</p>
        </div>
      </div>

      <div className="flex items-center space-x-8">
        <div className="text-right">
          <p className="text-sm font-mono font-medium text-forest">
            {format(time, 'HH:mm:ss')}
          </p>
          <p className="text-[10px] font-mono text-forest/40 uppercase tracking-wider">
            {format(time, 'EEEE, MMM do')}
          </p>
        </div>
      </div>
    </header>
  );
}
