import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Home from './components/Home';
import ChatBot from './components/ChatBot';
import Journal from './components/Journal';
import MoodTracker from './components/MoodTracker';
import CreativeTools from './components/CreativeTools';
import Resources from './components/Resources';
import Community from './components/Community';
import MemoryUpload from './components/MemoryUpload';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <Home setActiveSection={setActiveSection} />;
      case 'chat':
        return <ChatBot />;
      case 'memory':
        return <MemoryUpload />;
      case 'journal':
        return <Journal />;
      case 'mood':
        return <MoodTracker />;
      case 'creative':
        return <CreativeTools />;
      case 'resources':
        return <Resources />;
      case 'community':
        return <Community />;
      default:
        return <Home setActiveSection={setActiveSection} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Header
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <main>
          {renderSection()}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;