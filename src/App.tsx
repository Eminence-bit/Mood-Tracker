import React, { useState, useEffect } from 'react';
import { MoodSelector } from './components/MoodSelector';
import { CalendarView } from './components/CalendarView';
import { Summary } from './components/Summary';
import { MoodEntry, Mood } from './types/mood';
import { mockData } from './data/mockData';
import { Calendar, Bell } from 'lucide-react';

function App() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('moodEntries');
    return saved ? JSON.parse(saved) : mockData;
  });

  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
  }, [moodEntries]);

  const handleMoodSelect = (mood: Mood) => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: MoodEntry = { date: today, mood };
    
    setMoodEntries(prev => {
      const filtered = prev.filter(entry => entry.date !== today);
      return [...filtered, newEntry].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });
  };

  const handleNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Mood Tracker', {
        body: 'Time to log your mood!',
        icon: '/vite.svg'
      });
    } else {
      alert('Time to log your mood!');
    }
  };

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        <header className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 transition-colors duration-200" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Mood Tracker</h1>
          </div>
          <button
            onClick={handleNotification}
            className="p-2 sm:p-3 rounded-full bg-blue-100 hover:bg-blue-200 transition-all duration-300 ease-in-out flex items-center justify-center group hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Show notification"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 group-hover:text-blue-600 transition-colors duration-200" />
          </button>
        </header>

        <MoodSelector onMoodSelect={handleMoodSelect} />
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <CalendarView moodEntries={moodEntries} />
          <Summary moodEntries={moodEntries} />
        </div>
      </div>
    </div>
  );
}

export default App;