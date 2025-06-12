import React from 'react';
import { Mic, MicOff, Play, Pause, Trash2, Send } from 'lucide-react';
import { useVoiceRecording } from '../hooks/useVoiceRecording';

interface VoiceRecorderProps {
  onSendVoice: (audioBlob: Blob) => void;
  disabled?: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSendVoice, disabled = false }) => {
  const {
    isRecording,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    clearRecording,
    error
  } = useVoiceRecording();

  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSend = () => {
    if (audioBlob) {
      onSendVoice(audioBlob);
      clearRecording();
    }
  };

  React.useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, [audioUrl]);

  if (error) {
    return (
      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Recording Controls */}
      <div className="flex items-center justify-center space-x-4">
        {!isRecording && !audioBlob && (
          <button
            onClick={startRecording}
            disabled={disabled}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            aria-label="Start recording"
          >
            <Mic className="h-6 w-6" />
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 animate-pulse"
            aria-label="Stop recording"
          >
            <MicOff className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-red-600 dark:text-red-400">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Recording...</span>
          </div>
        </div>
      )}

      {/* Audio Playback */}
      {audioUrl && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <audio ref={audioRef} src={audioUrl} className="hidden" />
          
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={handlePlayPause}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Voice message recorded
            </span>
            
            <button
              onClick={clearRecording}
              className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full transition-colors"
              aria-label="Delete recording"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleSend}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Send Voice Message</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;