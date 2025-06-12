import React, { useState, useEffect } from 'react';
import { PenTool, Calendar, Save, Eye, EyeOff, BookOpen } from 'lucide-react';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood: number;
  isPrivate: boolean;
}

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState({
    title: '',
    content: '',
    mood: 5,
    isPrivate: true
  });
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isWriting, setIsWriting] = useState(true);

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem('griefguide-journal');
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries);
      setEntries(parsed.map((entry: any) => ({ ...entry, date: new Date(entry.date) })));
    }
  }, []);

  const saveEntry = () => {
    if (!currentEntry.title.trim() || !currentEntry.content.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: currentEntry.title,
      content: currentEntry.content,
      date: new Date(),
      mood: currentEntry.mood,
      isPrivate: currentEntry.isPrivate
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('griefguide-journal', JSON.stringify(updatedEntries));

    // Reset form
    setCurrentEntry({
      title: '',
      content: '',
      mood: 5,
      isPrivate: true
    });

    alert('Your journal entry has been saved safely.');
  };

  const getMoodColor = (mood: number) => {
    if (mood <= 2) return 'text-red-500';
    if (mood <= 4) return 'text-orange-500';
    if (mood <= 6) return 'text-yellow-500';
    if (mood <= 8) return 'text-green-500';
    return 'text-blue-500';
  };

  const getMoodLabel = (mood: number) => {
    if (mood <= 2) return 'Very Difficult';
    if (mood <= 4) return 'Challenging';
    if (mood <= 6) return 'Managing';
    if (mood <= 8) return 'Good';
    return 'Peaceful';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Grief Journal</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A safe space to process your thoughts and feelings. Write freely - this is your private sanctuary.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Writing/Reading Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <PenTool className="h-6 w-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isWriting ? 'Write Your Thoughts' : 'Reading Entry'}
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setIsWriting(true);
                      setSelectedEntry(null);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isWriting 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Write
                  </button>
                  <button
                    onClick={() => setIsWriting(false)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      !isWriting 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Read
                  </button>
                </div>
              </div>

              {isWriting ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entry Title
                    </label>
                    <input
                      type="text"
                      value={currentEntry.title}
                      onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="What's on your mind today?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How are you feeling? ({getMoodLabel(currentEntry.mood)})
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={currentEntry.mood}
                      onChange={(e) => setCurrentEntry(prev => ({ ...prev, mood: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Very Difficult</span>
                      <span>Peaceful</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Thoughts
                    </label>
                    <textarea
                      value={currentEntry.content}
                      onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder="Pour your heart out here... There's no right or wrong way to grieve. This is your space to be authentic and honest about your feelings."
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentEntry(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                      >
                        {currentEntry.isPrivate ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="text-sm">
                          {currentEntry.isPrivate ? 'Private Entry' : 'Shareable Entry'}
                        </span>
                      </button>
                    </div>
                    <button
                      onClick={saveEntry}
                      disabled={!currentEntry.title.trim() || !currentEntry.content.trim()}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Entry</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedEntry ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{selectedEntry.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{selectedEntry.date.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className={`text-sm font-medium mb-4 ${getMoodColor(selectedEntry.mood)}`}>
                        Mood: {getMoodLabel(selectedEntry.mood)}
                      </div>
                      <div className="prose prose-gray max-w-none">
                        <p className="whitespace-pre-wrap leading-relaxed">{selectedEntry.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select an entry from your journal to read</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Journal Entries List */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Entries</h3>
              {entries.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No entries yet. Start writing to begin your healing journey.
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      onClick={() => {
                        setSelectedEntry(entry);
                        setIsWriting(false);
                      }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 truncate">{entry.title}</h4>
                        {entry.isPrivate && (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{entry.date.toLocaleDateString()}</span>
                        <span className={getMoodColor(entry.mood)}>
                          {getMoodLabel(entry.mood)}
                        </span>
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

export default Journal;