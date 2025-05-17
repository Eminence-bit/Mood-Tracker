import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { MoodEntry, Mood, moodColors, moodDescriptions } from '../types/mood';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SummaryProps {
  moodEntries: MoodEntry[];
}

const moodToScore = (mood: Mood): number => {
  const scores: Record<Mood, number> = {
    '😊': 5, // Very Happy
    '😔': 2, // Sad
    '😐': 3, // Neutral
    '😣': 1, // Stressed
    '😊': 4, // Happy
  };
  return scores[mood];
};

const scoreToMood = (score: number): Mood | undefined => {
  return Object.entries(moodToScore).find(([, value]) => value === score)?.[0] as Mood | undefined;
};

export const Summary: React.FC<SummaryProps> = ({ moodEntries }) => {
  const sortedEntries = [...moodEntries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const gradientColors = {
    start: '#60a5fa20', // Light blue with opacity
    end: '#60a5fa05', // Very light blue with low opacity
  };

  const data = {
    labels: sortedEntries.map(entry => {
      const date = new Date(entry.date);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }),
    datasets: [
      {
        label: 'Mood Score',
        data: sortedEntries.map(entry => moodToScore(entry.mood)),
        borderColor: '#60a5fa',
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, gradientColors.end);
          gradient.addColorStop(1, gradientColors.start);
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: sortedEntries.map(entry => moodColors[entry.mood]),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBorderWidth: 3,
        pointHoverBackgroundColor: sortedEntries.map(entry => moodColors[entry.mood]),
        pointHoverBorderColor: '#ffffff',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: "'Inter', sans-serif",
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: true,
        text: 'Mood Trends Over Time',
        font: {
          size: 16,
          family: "'Inter', sans-serif",
          weight: '600',
        },
        padding: { bottom: 16 },
        color: '#1f2937', // text-gray-800
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        titleFont: {
          size: 14,
          family: "'Inter', sans-serif",
          weight: '600',
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif",
        },
        padding: 12,
        borderColor: '#e5e7eb',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          title: (tooltipItems) => {
            const date = new Date(sortedEntries[tooltipItems[0].dataIndex].date);
            return date.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          },
          label: (context) => {
            const score = context.raw as number;
            const mood = scoreToMood(score);
            if (!mood) return `Score: ${score}`;
            return [
              `Mood: ${moodDescriptions[mood]}`,
              `Score: ${score}/5`
            ];
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: '#6b7280', // text-gray-500
        },
        grid: {
          color: '#f3f4f6', // gray-100
          drawBorder: false,
        },
        border: {
          display: false,
        },
        title: {
          display: true,
          text: 'Mood Score',
          font: {
            size: 13,
            family: "'Inter', sans-serif",
            weight: '500',
          },
          color: '#4b5563', // text-gray-600
          padding: { bottom: 8 },
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: '#6b7280', // text-gray-500
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 13,
            family: "'Inter', sans-serif",
            weight: '500',
          },
          color: '#4b5563', // text-gray-600
          padding: { top: 8 },
        },
      },
    },
  };

  return (
    <div 
      className="p-4 sm:p-6 bg-white rounded-lg shadow-md"
      role="region"
      aria-labelledby="summary-title"
    >
      <h2 id="summary-title" className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
        Mood Summary
      </h2>
      <div 
        role="img" 
        aria-label="Line chart showing mood trends over time"
        className="w-full h-[300px] sm:h-[400px]"
      >
        <Line data={data} options={options} />
      </div>
    </div>
  );
};