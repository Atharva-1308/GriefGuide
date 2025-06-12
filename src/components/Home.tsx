import React from 'react';
import { MessageCircle, BookOpen, Heart, Users, Palette, Upload, Sparkles, Brain } from 'lucide-react';

interface HomeProps {
  setActiveSection: (section: string) => void;
}

const Home: React.FC<HomeProps> = ({ setActiveSection }) => {
  const features = [
    {
      icon: MessageCircle,
      title: 'AI Support Chat',
      description: 'Talk to our empathetic AI companion with voice or text support',
      action: () => setActiveSection('chat'),
      gradient: 'from-blue-500 to-blue-600',
      highlight: 'Voice & Anonymous Chat'
    },
    {
      icon: Upload,
      title: 'Memory Upload',
      description: 'Upload your loved one\'s letters, voice recordings, and chats for personalized AI support',
      action: () => setActiveSection('memory'),
      gradient: 'from-indigo-500 to-purple-600',
      highlight: 'AI Personalization'
    },
    {
      icon: BookOpen,
      title: 'Grief Journal',
      description: 'Express your thoughts and track your healing journey',
      action: () => setActiveSection('journal'),
      gradient: 'from-green-500 to-green-600',
      highlight: 'Private & Secure'
    },
    {
      icon: Heart,
      title: 'Mood Check-In',
      description: 'Monitor your emotional wellbeing with gentle check-ins',
      action: () => setActiveSection('mood'),
      gradient: 'from-pink-500 to-pink-600',
      highlight: 'Daily Tracking'
    },
    {
      icon: Palette,
      title: 'Creative Tools',
      description: 'Healing through creative expression and memory preservation',
      action: () => setActiveSection('creative'),
      gradient: 'from-purple-500 to-purple-600',
      highlight: 'Art & Memory'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with others who understand your journey',
      action: () => setActiveSection('community'),
      gradient: 'from-teal-500 to-teal-600',
      highlight: 'Anonymous Support'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-blue-100/50 dark:from-purple-900/20 dark:to-blue-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent font-semibold">
                Enhanced with AI Personalization & Voice Support
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              You Are Not Alone in Your{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                Healing Journey
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              GriefGuide provides compassionate AI support that learns from your loved one's memories. 
              Upload their letters, voice recordings, and conversations to receive personalized support 
              that honors their unique way of caring for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setActiveSection('memory')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Your Journey
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>AI Learns From Your Loved One's Memories</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Personalized Tools for Your Healing</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Every person's grief journey is unique. Our AI learns from your loved one's memories to provide 
            support that feels authentic and meaningful to your relationship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                onClick={feature.action}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              >
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  {feature.highlight && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {feature.highlight}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Personalization Highlight */}
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border-y border-indigo-200 dark:border-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <Brain className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI That Learns From Love</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Upload your loved one's letters, voice recordings, and conversations. Our AI learns their 
              communication style, tone, and the unique way they showed care, providing support that 
              feels authentic to your relationship.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Upload Memories</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Share letters, voice recordings, and chat conversations</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">AI Learning</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Our AI analyzes communication patterns and emotional tone</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Personalized Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Receive support that reflects their unique way of caring</p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-t border-green-100 dark:border-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-2">Your Memories Are Sacred</h3>
            <p className="text-green-700 dark:text-green-300 mb-4">All uploaded content is encrypted and stored securely. Your loved one's memories are treated with the utmost respect and privacy.</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 dark:text-green-300">End-to-end encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 dark:text-green-300">Anonymous chat options</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 dark:text-green-300">No data sharing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;