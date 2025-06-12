import React, { useState, useRef } from 'react';
import { Upload, FileText, Mic, MessageSquare, Brain, Heart, X, Check, Play, Pause } from 'lucide-react';

interface UploadedMemory {
  id: string;
  type: 'letter' | 'voice' | 'chat';
  name: string;
  content: string;
  audioUrl?: string;
  uploadDate: Date;
  processed: boolean;
}

const MemoryUpload: React.FC = () => {
  const [memories, setMemories] = useState<UploadedMemory[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'upload' | 'manage'>('upload');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    setIsProcessing(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await processFile(file);
    }
    
    setIsProcessing(false);
  };

  const processFile = async (file: File): Promise<void> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        let memoryType: 'letter' | 'voice' | 'chat' = 'letter';
        let audioUrl: string | undefined;
        
        // Determine file type
        if (file.type.startsWith('audio/')) {
          memoryType = 'voice';
          audioUrl = URL.createObjectURL(file);
        } else if (file.name.toLowerCase().includes('chat') || file.name.toLowerCase().includes('message')) {
          memoryType = 'chat';
        }
        
        const newMemory: UploadedMemory = {
          id: Date.now().toString() + Math.random(),
          type: memoryType,
          name: file.name,
          content: memoryType === 'voice' ? 'Voice recording from loved one' : content,
          audioUrl,
          uploadDate: new Date(),
          processed: false
        };
        
        setMemories(prev => [...prev, newMemory]);
        
        // Simulate AI processing
        setTimeout(() => {
          setMemories(prev => 
            prev.map(memory => 
              memory.id === newMemory.id 
                ? { ...memory, processed: true }
                : memory
            )
          );
          
          // Save to localStorage
          const updatedMemories = [...memories, { ...newMemory, processed: true }];
          localStorage.setItem('griefguide-memories', JSON.stringify(updatedMemories));
        }, 2000);
        
        resolve();
      };
      
      if (file.type.startsWith('audio/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const removeMemory = (id: string) => {
    setMemories(prev => {
      const updated = prev.filter(memory => memory.id !== id);
      localStorage.setItem('griefguide-memories', JSON.stringify(updated));
      return updated;
    });
  };

  const playAudio = (audioUrl: string, memoryId: string) => {
    if (playingAudio === memoryId) {
      audioRef.current?.pause();
      setPlayingAudio(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setPlayingAudio(memoryId);
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'voice': return <Mic className="h-5 w-5" />;
      case 'chat': return <MessageSquare className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'voice': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'chat': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  React.useEffect(() => {
    const savedMemories = localStorage.getItem('griefguide-memories');
    if (savedMemories) {
      const parsed = JSON.parse(savedMemories);
      setMemories(parsed.map((memory: any) => ({ 
        ...memory, 
        uploadDate: new Date(memory.uploadDate) 
      })));
    }
  }, []);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setPlayingAudio(null);
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Memory Upload</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Upload letters, voice recordings, or chat conversations from your loved one. 
            Our AI will learn their communication style to provide more personalized and meaningful support.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setSelectedTab('upload')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                selectedTab === 'upload'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              Upload Memories
            </button>
            <button
              onClick={() => setSelectedTab('manage')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                selectedTab === 'manage'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              Manage Memories ({memories.length})
            </button>
          </div>
        </div>

        {selectedTab === 'upload' ? (
          <div className="space-y-8">
            {/* Upload Area */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-full">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Upload Your Loved One's Memories
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Drag and drop files here, or click to browse
                    </p>
                  </div>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  >
                    {isProcessing ? 'Processing...' : 'Choose Files'}
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".txt,.pdf,.doc,.docx,.mp3,.wav,.m4a,.ogg"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    className="hidden"
                  />
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <div>
                    <div className="font-medium text-green-800 dark:text-green-300">Letters & Documents</div>
                    <div className="text-sm text-green-600 dark:text-green-400">PDF, TXT, DOC files</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Mic className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="font-medium text-purple-800 dark:text-purple-300">Voice Recordings</div>
                    <div className="text-sm text-purple-600 dark:text-purple-400">MP3, WAV, M4A files</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="font-medium text-blue-800 dark:text-blue-300">Chat Conversations</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">Text message exports</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Learning Status */}
            {memories.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Brain className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Learning Progress</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {memories.filter(m => m.processed).length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Memories Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {memories.filter(m => m.type === 'voice').length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Voice Patterns Learned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {Math.min(100, memories.filter(m => m.processed).length * 20)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Personalization Level</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Uploaded Memories</h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {memories.length} memories uploaded
              </div>
            </div>
            
            {memories.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No memories uploaded yet</p>
                <button
                  onClick={() => setSelectedTab('upload')}
                  className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                >
                  Upload your first memory
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {memories.map((memory) => (
                  <div key={memory.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`p-2 rounded-lg border ${getTypeColor(memory.type)}`}>
                          {getTypeIcon(memory.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">{memory.name}</h4>
                            {memory.processed ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {memory.content.length > 100 
                              ? memory.content.substring(0, 100) + '...' 
                              : memory.content}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Uploaded {memory.uploadDate.toLocaleDateString()}</span>
                            <span className="capitalize">{memory.type} file</span>
                            {memory.processed && (
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                ✓ Processed by AI
                              </span>
                            )}
                          </div>
                          
                          {memory.audioUrl && (
                            <button
                              onClick={() => playAudio(memory.audioUrl!, memory.id)}
                              className="mt-2 flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm"
                            >
                              {playingAudio === memory.id ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                              <span>{playingAudio === memory.id ? 'Pause' : 'Play'} Audio</span>
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeMemory(memory.id)}
                        className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <audio ref={audioRef} className="hidden" />
      </div>
    </div>
  );
};

export default MemoryUpload;