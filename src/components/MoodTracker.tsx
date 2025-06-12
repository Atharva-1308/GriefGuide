import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Heart, BarChart3 } from 'lucide-react';

interface MoodEntry {
  id: string;
  mood: number;
  note: string;
  date: Date;
}

const MoodTracker: React.FC = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [currentMood, setCurrentMood] = useState(5);
  const [currentNote, setCurrentNote] = useState('');

  const moodEmojis = ['😢', '😞', '😐', '🙂', '😊', '😄'];
  const moodLabels = ['Very Difficult', 'Difficult', 'Struggling', 'Managing', 'Good', 'Peaceful'];
  const moodColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500'];

  useEffect(() => {
    const savedMoods = localStorage.getItem('griefguide-moods');
    if (savedMoods) {
      const parsed = JSON.parse(savedMoods);
      setMoodEntries(parsed.map((entry: any) => ({ ...entry, date: new Date(entry.date) })));
    }
  }, []);

  const saveMoodEntry = () => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: currentMood,
      note: currentNote,
      date: new Date()
    };

    const updatedEntries = [newEntry, ...moodEntries];
    setMoodEntries(updatedEntries);
    localStorage.setItem('griefguide-moods', JSON.stringify(updatedEntries));

    setCurrentNote('');
    alert('Your mood has been recorded. Thank you for checking in with yourself.');
  };

  const getAverageMood = () => {
    if (moodEntries.length === 0) return 0;
    const sum = moodEntries.reduce((acc, entry) => acc + entry.mood, 0);
    return (sum / moodEntries.length).toFixed(1);
  };

  const getRecentTrend = () => {
    if (moodEntries.length < 2) return 'neutral';
    const recent = moodEntries.slice(0, 5);
    const older = moodEntries.slice(5, 10);
    
    if (older.length === 0) return 'neutral';
    
    const recentAvg = recent.reduce((acc, entry) => acc + entry.mood, 0) / recent.length;
    const olderAvg = older.reduce((acc, entry) => acc + entry.mood, 0) / older.length;
    
    if (recentAvg > olderAvg + 0.5) return 'improving';
    if (recentAvg < olderAvg - 0.5) return 'declining';
    return 'stable';
  };

  const getTrendIcon = () => {
    const trend = getRecentTrend();
    if (trend === 'improving') return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (trend === 'declining') return <TrendingUp className="h-5 w-5 text-red-500 transform rotate-180" />;
    return <div className="h-5 w-5 bg-gray-400 rounded-full"></div>;
  };

  const getTrendMessage = () => {
    const trend = getRecentTrend();
    if (trend === 'improving') return "Your mood has been improving lately. That's wonderful progress!";
    if (trend === 'declining') return "You've been having some difficult days. Remember, this is temporary.";
    return "Your mood has been relatively stable. Take things one day at a time.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Mood Check-In</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tracking your emotional well-being helps you understand your healing journey. 
            Be gentle with yourself - all feelings are valid.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood Input */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Heart className="h-6 w-6 text-pink-600" />
              <h2 className="text-xl font-semibold text-gray-900">How are you feeling right now?</h2>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-center mb-4">
                  <div className="text-6xl">
                    {moodEmojis[Math.floor((currentMood - 1) / 2)]}
                  </div>
                </div>
                <div className="text-center mb-4">
                  <span className="text-lg font-medium text-gray-900">
                    {moodLabels[Math.floor((currentMood - 1) / 2)]}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentMood}
                  onChange={(e) => setCurrentMood(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's contributing to this feeling? (Optional)
                </label>
                <textarea
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  placeholder="Share what's on your mind..."
                />
              </div>

              <button
                onClick={saveMoodEntry}
                className="w-full bg-gradient-to-r from-pink-600 to-pink-700 text-white py-3 rounded-lg hover:from-pink-700 hover:to-pink-800 transition-all duration-200 font-medium"
              >
                Record Mood
              </button>
            </div>
          </div>

          {/* Mood Analytics */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{moodEntries.length}</div>
                  <div className="text-sm text-gray-600">Check-ins</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{getAverageMood()}</div>
                  <div className="text-sm text-gray-600">Average Mood</div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  {getTrendIcon()}
                  <span className="text-sm font-medium text-gray-700">Recent Trend</span>
                </div>
                <p className="text-sm text-gray-600">{getTrendMessage()}</p>
              </div>
            </div>

            {/* Recent Entries */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Check-ins</h3>
              </div>
              
              {moodEntries.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No mood entries yet. Start by recording how you're feeling today.
                </p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {moodEntries.slice(0, 10).map((entry) => (
                    <div key={entry.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl">
                        {moodEmojis[Math.floor((entry.mood - 1) / 2)]}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {moodLabels[Math.floor((entry.mood - 1) / 2)]} (Score: {entry.mood})
                        </div>
                        <div className="text-xs text-gray-500">
                          {entry.date.toLocaleDateString()} at {entry.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        {entry.note && (
                          <div className="text-sm text-gray-600 mt-1 italic">
                            "{entry.note}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;