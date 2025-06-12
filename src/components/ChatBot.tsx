import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Heart, Volume2, Keyboard, Mic, Brain } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isVoice?: boolean;
  audioUrl?: string;
  isPersonalized?: boolean;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello, I'm here to listen and support you through this difficult time. I've learned from the memories you've shared to provide more personalized support. You're safe here, and you can share whatever is on your heart. How are you feeling today?",
      isUser: false,
      timestamp: new Date(),
      isPersonalized: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getPersonalizedResponse = (userMessage: string): string => {
    // Check if user has uploaded memories
    const memories = JSON.parse(localStorage.getItem('griefguide-memories') || '[]');
    const hasMemories = memories.length > 0;
    
    if (hasMemories) {
      const personalizedResponses = [
        "I can sense the deep love you shared. From what I've learned about your loved one, they would want you to know that your feelings are completely valid and that healing takes time.",
        "Your loved one had such a caring way of expressing themselves. I can feel their warmth in the memories you've shared. They would remind you that it's okay to take things one day at a time.",
        "The way your loved one communicated shows how much they cherished you. They would want you to be gentle with yourself during this difficult time.",
        "From the beautiful memories you've shared, I can see how your loved one always knew just what to say. They would tell you that grief is love with nowhere to go, and that love never truly disappears.",
        "Your loved one's voice comes through so clearly in what you've shared with me. They would want you to know that you're being incredibly brave by reaching out and processing these feelings.",
        "I can feel the unique bond you shared through the memories you've uploaded. Your loved one would remind you that healing isn't linear, and every feeling you're experiencing is part of your journey.",
        "The way your loved one expressed care in their words shows how deeply they understood you. They would want you to know that you don't have to carry this grief alone.",
        "From what I've learned about your loved one's communication style, they would encourage you to be patient with yourself and remember that love transcends physical presence."
      ];
      
      return personalizedResponses[Math.floor(Math.random() * personalizedResponses.length)];
    } else {
      const generalResponses = [
        "I hear you, and what you're feeling is completely valid. Grief is a natural response to loss, and there's no right or wrong way to experience it.",
        "Thank you for sharing that with me. It takes courage to express these feelings. Remember, healing isn't linear - it's okay to have difficult days.",
        "Your feelings matter, and so do you. It's okay to take things one moment at a time. What would feel most helpful for you right now?",
        "I'm honored that you've trusted me with your feelings. Grief can feel overwhelming, but you don't have to carry it alone.",
        "What you're experiencing sounds incredibly difficult. It's natural to feel this way after a loss. You're being so brave by reaching out.",
        "I can sense the love you have in your heart. That love doesn't disappear - it transforms. Take all the time you need to process these feelings."
      ];
      
      return generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const memories = JSON.parse(localStorage.getItem('griefguide-memories') || '[]');
      const hasMemories = memories.length > 0;
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getPersonalizedResponse(textToSend),
        isUser: false,
        timestamp: new Date(),
        isPersonalized: hasMemories
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleVoiceMessage = (audioBlob: Blob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const userMessage: Message = {
      id: Date.now().toString(),
      text: "Voice message",
      isUser: true,
      timestamp: new Date(),
      isVoice: true,
      audioUrl: audioUrl
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate voice processing and AI response
    setTimeout(() => {
      const memories = JSON.parse(localStorage.getItem('griefguide-memories') || '[]');
      const hasMemories = memories.length > 0;
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getPersonalizedResponse("voice message"),
        isUser: false,
        timestamp: new Date(),
        isPersonalized: hasMemories
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const playTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const memories = JSON.parse(localStorage.getItem('griefguide-memories') || '[]');
  const hasMemories = memories.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  {hasMemories ? (
                    <Brain className="h-6 w-6 text-white" />
                  ) : (
                    <Heart className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {hasMemories ? 'Personalized AI Companion' : 'AI Grief Companion'}
                  </h2>
                  <p className="text-blue-100">
                    {hasMemories 
                      ? 'Enhanced with your loved one\'s memories' 
                      : 'Here to listen and support you'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {hasMemories && (
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-100">
                    AI Personalized
                  </div>
                )}
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isAnonymous 
                    ? 'bg-green-500/20 text-green-100' 
                    : 'bg-yellow-500/20 text-yellow-100'
                }`}>
                  {isAnonymous ? 'Anonymous' : 'Identified'}
                </div>
                <button
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className="text-white/80 hover:text-white text-xs underline"
                >
                  {isAnonymous ? 'Sign In' : 'Go Anonymous'}
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isUser 
                      ? 'bg-purple-600' 
                      : message.isPersonalized
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
                        : 'bg-gradient-to-br from-blue-500 to-purple-500'
                  }`}>
                    {message.isUser ? (
                      <User className="h-4 w-4 text-white" />
                    ) : message.isPersonalized ? (
                      <Brain className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={`p-4 rounded-2xl ${
                    message.isUser
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm'
                  }`}>
                    {message.isVoice && message.audioUrl ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Mic className="h-4 w-4" />
                          <span className="text-sm">Voice message</span>
                        </div>
                        <audio controls className="w-full">
                          <source src={message.audioUrl} type="audio/webm" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="leading-relaxed">{message.text}</p>
                        {!message.isUser && (
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => playTextToSpeech(message.text)}
                              className="flex items-center space-x-1 text-xs opacity-70 hover:opacity-100 transition-opacity"
                            >
                              <Volume2 className="h-3 w-3" />
                              <span>Listen</span>
                            </button>
                            {message.isPersonalized && (
                              <div className="flex items-center space-x-1 text-xs opacity-70">
                                <Brain className="h-3 w-3" />
                                <span>Personalized</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    hasMemories 
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
                      : 'bg-gradient-to-br from-blue-500 to-purple-500'
                  }`}>
                    {hasMemories ? (
                      <Brain className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-600 p-6 bg-white dark:bg-gray-800">
            {/* Memory Status */}
            {!hasMemories && (
              <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-indigo-700 dark:text-indigo-300">
                  <Brain className="h-4 w-4" />
                  <span>Upload your loved one's memories to receive more personalized support</span>
                </div>
              </div>
            )}
            
            {/* Input Mode Toggle */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <button
                onClick={() => setInputMode('text')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  inputMode === 'text'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Keyboard className="h-4 w-4" />
                <span>Text</span>
              </button>
              <button
                onClick={() => setInputMode('voice')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  inputMode === 'voice'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Mic className="h-4 w-4" />
                <span>Voice</span>
              </button>
            </div>

            {inputMode === 'text' ? (
              <div className="flex space-x-4">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your heart..."
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  rows={2}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim()}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </button>
              </div>
            ) : (
              <VoiceRecorder onSendVoice={handleVoiceMessage} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;