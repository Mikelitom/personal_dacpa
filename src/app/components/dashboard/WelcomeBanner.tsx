"use client";

import { useState, useEffect } from 'react';
import { User } from '@/app/types/user';

interface WelcomeBannerProps {
  user?: User;
}

export function WelcomeBanner({ user }: WelcomeBannerProps) {
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  
  useEffect(() => {
    // Movemos toda la lógica dependiente de Date al lado del cliente
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 12) {
      setGreeting('Buenos días');
    } else if (hour < 18) {
      setGreeting('Buenas tardes');
    } else {
      setGreeting('Buenas noches');
    }
    
    // Formatear la hora usando un método seguro para SSR
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentTime(now.toLocaleDateString('es-MX', options));
  }, []);

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {greeting}, {user.name || 'Usuario'}
          </h1>
          <p className="text-gray-600 mt-1">
            {currentTime}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <p className="text-gray-600">Total estudiantes: <span className="font-medium">{user.students?.length || 0}</span></p>
        </div>
      </div>
    </div>
  );
}