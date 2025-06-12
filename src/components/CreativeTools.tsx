import React, { useState } from 'react';
import { Palette, Flame, Upload, PenTool, Camera, Music } from 'lucide-react';

const CreativeTools: React.FC = () => {
  const [candleIsLit, setCandleIsLit] = useState(false);
  const [letterContent, setLetterContent] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');

  const artPrompts = [
    "Draw a place where you felt most at peace with your loved one",
    "Create a color palette that represents your feelings today",
    "Sketch a symbol that reminds you of beautiful memories",
    "Design a garden that represents growth through grief",
    "Paint the emotions you're experiencing right now",
    "Create a mandala with patterns that bring you comfort",
    "Draw a bridge between past memories and future hope",
    "Illustrate a safe space where you can always find peace"
  ];

  const writingPrompts = [
    "Write about a favorite memory you shared together",
    "Describe three things you're grateful for today",
    "Write a letter to your future self about your healing journey",
    "Share a life lesson your loved one taught you",
    "Write about a tradition you'd like to continue in their honor",
    "Describe how you've grown stronger through this experience",
    "Write about the love that continues even after loss",
    "Share advice you'd give to someone beginning their grief journey"
  ];

  const lightCandle = () => {
    setCandleIsLit(true);
    setTimeout(() => {
      alert("Your virtual candle has been lit in remembrance. The light represents the love that continues to shine.");
    }, 500);
  };

  const saveMemory = () => {
    if (!letterContent.trim()) return;
    
    const memories = JSON.parse(localStorage.getItem('griefguide-memories') || '[]');
    const newMemory = {
      id: Date.now().toString(),
      content: letterContent,
      date: new Date().toISOString(),
      type: 'letter'
    };
    
    memories.push(newMemory);
    localStorage.setItem('griefguide-memories', JSON.stringify(memories));
    setLetterContent('');
    alert("Your memory has been safely preserved in your personal memory capsule.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Creative Healing Tools</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Express your feelings through creativity. Art, writing, and memory-keeping can be powerful 
            tools for processing grief and honoring your loved one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Virtual Candle */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Flame className="h-6 w-6 text-orange-600" />
              <h3 className="text-xl font-semibold text-gray-900">Virtual Candle</h3>
            </div>
            
            <div className="mb-6">
              <div className="relative mx-auto w-24 h-32 bg-gradient-to-t from-yellow-200 to-yellow-100 rounded-t-full rounded-b-lg shadow-lg">
                {candleIsLit && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-4 h-8 bg-gradient-to-t from-orange-400 via-yellow-400 to-transparent rounded-full animate-pulse"></div>
                  </div>
                )}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gray-800 rounded-t"></div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Light a candle in memory of your loved one. Let the flame represent the eternal light of love.
            </p>
            
            <button
              onClick={lightCandle}
              disabled={candleIsLit}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                candleIsLit
                  ? 'bg-orange-100 text-orange-800 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
              }`}
            >
              {candleIsLit ? 'Candle is Lit' : 'Light Candle'}
            </button>
          </div>

          {/* Art Prompts */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="h-6 w-6 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-900">Art Therapy Prompts</h3>
            </div>
            
            <div className="space-y-4">
              {selectedPrompt && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-800 font-medium">{selectedPrompt}</p>
                </div>
              )}
              
              <button
                onClick={() => setSelectedPrompt(artPrompts[Math.floor(Math.random() * artPrompts.length)])}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
              >
                Get Art Prompt
              </button>
              
              <p className="text-xs text-gray-500">
                Use any medium you like - pencil, paint, digital art, or even arrange objects that represent your feelings.
              </p>
            </div>
          </div>

          {/* Writing Prompts */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <PenTool className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Writing Prompts</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                {writingPrompts.slice(0, 3).map((prompt, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">{prompt}</p>
                  </div>
                ))}
              </div>
              
              <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200">
                View All Prompts
              </button>
            </div>
          </div>

          {/* Memory Capsule */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Camera className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Digital Memory Capsule</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Write a letter, share a memory, or express your feelings. This will be safely stored in your personal memory capsule.
              </p>
              
              <textarea
                value={letterContent}
                onChange={(e) => setLetterContent(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Dear [loved one's name],&#10;&#10;I want you to know that..."
              />
              
              <div className="flex space-x-3">
                <button
                  onClick={saveMemory}
                  disabled={!letterContent.trim()}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Save Memory
                </button>
                <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200">
                  <Upload className="h-4 w-4" />
                  <span>Add Photo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Music & Meditation */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Music className="h-6 w-6 text-indigo-600" />
              <h3 className="text-xl font-semibold text-gray-900">Healing Sounds</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Soothing sounds can help process emotions and provide comfort.
              </p>
              
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <div className="font-medium text-indigo-800">Rain Sounds</div>
                  <div className="text-xs text-indigo-600">Peaceful rainfall for reflection</div>
                </button>
                
                <button className="w-full text-left p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <div className="font-medium text-indigo-800">Ocean Waves</div>
                  <div className="text-xs text-indigo-600">Gentle waves for calming</div>
                </button>
                
                <button className="w-full text-left p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <div className="font-medium text-indigo-800">Forest Sounds</div>
                  <div className="text-xs text-indigo-600">Nature sounds for grounding</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Inspiration Quote */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
            <blockquote className="text-lg text-gray-700 italic mb-4">
              "Grief is the price we pay for love. But love never dies - it transforms into memories, 
              lessons, and the strength to carry on."
            </blockquote>
            <p className="text-sm text-gray-500">— Remember, healing is not linear, and that's okay</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeTools;