import React from 'react';
import { Mood, moodColors, moodDescriptions } from '../types/mood';
import confetti from 'canvas-confetti';

interface MoodSelectorProps {
  onMoodSelect: (mood: Mood) => void;
}

const moods: Mood[] = ['😊', '😔', '😐', '😣', '🤩'];

const triggerConfetti = (color: string) => {
  const colors = [color, '#ffffff'];
  
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors,
    ticks: 200,
    startVelocity: 30,
    shapes: ['circle'],
    scalar: 0.75,
    disableForReducedMotion: true,
  });
};

export const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodSelect }) => {
  const handleMoodSelect = (mood: Mood) => {
    onMoodSelect(mood);
    
    // Convert hex to RGB for confetti
    const hex = moodColors[mood].slice(1);
    const rgb = {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
    
    // Make the color more pastel by mixing with white
    const pastelColor = `#${[
      Math.floor((rgb.r + 255) / 2).toString(16).padStart(2, '0'),
      Math.floor((rgb.g + 255) / 2).toString(16).padStart(2, '0'),
      Math.floor((rgb.b + 255) / 2).toString(16).padStart(2, '0'),
    ].join('')}`;
    
    triggerConfetti(pastelColor);
  };

  return (
    <div 
      className="flex flex-col items-center space-y-4 p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-md animate-fade-in"
      role="region"
      aria-labelledby="mood-selector-title"
    >
      <h2 id="mood-selector-title" className="text-xl sm:text-2xl font-semibold text-gray-800 text-center">
        How are you feeling today?
      </h2>
      <div 
        className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
        role="group"
        aria-label="Mood selection buttons"
      >
        {moods.map((mood) => (
          <div key={mood} className="relative group animate-scale-in">
            <button
              onClick={() => handleMoodSelect(mood)}
              className="mood-button"
              style={{ 
                backgroundColor: `${moodColors[mood]}20`,
                borderColor: moodColors[mood],
                borderWidth: '2px',
              }}
              aria-label={`Select mood: ${moodDescriptions[mood]}`}
            >
              <span role="img" aria-hidden="true">{mood}</span>
              
              <div className="mood-tooltip before:content-[''] before:absolute before:left-1/2 before:-translate-x-1/2 before:top-full before:border-4 before:border-transparent before:border-t-gray-800">
                {moodDescriptions[mood]}
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};