import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, FileText, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PodcastEpisode } from '../data/podcasts';

interface PodcastPlayerProps {
  episode: PodcastEpisode;
  onClose: () => void;
}

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ episode, onClose }) => {
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Refs for tracking
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isCleanedUpRef = useRef<boolean>(false);

  // Initialize TTS and reset everything on mount
  useEffect(() => {
    console.log('🎵 PodcastPlayer mounted, initializing...');
    
    // Reset cleanup flag
    isCleanedUpRef.current = false;
    
    // Force cancel any existing speech
    try {
      speechSynthesis.cancel();
    } catch (error) {
      console.log('Initial cancel error (expected):', error);
    }

    // Reset all state
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
    pausedTimeRef.current = 0;
    
    // Clear any intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Check TTS support
    const checkTTS = () => {
      try {
        const supported = 'speechSynthesis' in window && !!window.speechSynthesis;
        setTtsSupported(supported);
        console.log('🎤 TTS Support:', supported);
        
        if (supported) {
          // Wait for voices to load
          const loadVoices = () => {
            const voices = speechSynthesis.getVoices();
            console.log('🎤 Available voices:', voices.length);
            setIsInitialized(true);
          };
          
          // Some browsers load voices asynchronously
          if (speechSynthesis.getVoices().length === 0) {
            speechSynthesis.addEventListener('voiceschanged', loadVoices, { once: true });
            // Fallback timeout
            setTimeout(() => {
              if (!isCleanedUpRef.current) {
                setIsInitialized(true);
              }
            }, 1000);
          } else {
            loadVoices();
          }
        } else {
          setIsInitialized(true);
        }
        
        return supported;
      } catch (error) {
        console.log('❌ TTS Check Error:', error);
        setTtsSupported(false);
        setIsInitialized(true);
        return false;
      }
    };

    checkTTS();

    // Cleanup function
    return () => {
      console.log('🧹 PodcastPlayer unmounting, cleaning up...');
      isCleanedUpRef.current = true;
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      try {
        speechSynthesis.cancel();
      } catch (error) {
        console.log('Cleanup cancel error:', error);
      }
      
      utteranceRef.current = null;
    };
  }, [episode.id]); // Re-initialize when episode changes

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300';
      case 'Intermediate': return 'bg-warning-100 dark:bg-warning-900 text-warning-700 dark:text-warning-300';
      case 'Advanced': return 'bg-error-100 dark:bg-error-900 text-error-700 dark:text-error-300';
      default: return 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300';
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Estimate duration based on text length
  const estimateDuration = (text: string): number => {
    const words = text.split(/\s+/).length;
    const wordsPerMinute = 120; // Average speaking rate
    return Math.ceil((words / wordsPerMinute) * 60);
  };

  // Get Swedish voice
  const getSwedishVoice = (): SpeechSynthesisVoice | null => {
    try {
      const voices = speechSynthesis.getVoices();
      
      // Try to find Swedish voice
      const swedishVoice = voices.find(voice => 
        voice.lang.includes('sv') || 
        voice.name.toLowerCase().includes('swedish') ||
        voice.name.toLowerCase().includes('svenska')
      );
      
      if (swedishVoice) {
        console.log('🎤 Using Swedish voice:', swedishVoice.name);
        return swedishVoice;
      } else {
        console.log('🎤 No Swedish voice found, using default');
        return voices[0] || null;
      }
    } catch (error) {
      console.log('❌ Error getting voice:', error);
      return null;
    }
  };

  // Start progress tracking
  const startProgressTracking = (estimatedDuration: number) => {
    console.log('📊 Starting progress tracking for', estimatedDuration, 'seconds');
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setDuration(estimatedDuration);
    startTimeRef.current = Date.now();
    
    const interval = setInterval(() => {
      if (isCleanedUpRef.current) {
        clearInterval(interval);
        return;
      }
      
      const now = Date.now();
      const elapsed = (now - startTimeRef.current - pausedTimeRef.current) / 1000;
      
      if (elapsed >= estimatedDuration) {
        setCurrentTime(estimatedDuration);
        clearInterval(interval);
        intervalRef.current = null;
        setIsPlaying(false);
      } else if (elapsed >= 0) {
        setCurrentTime(elapsed);
      }
    }, 100);
    
    intervalRef.current = interval;
  };

  // Stop progress tracking
  const stopProgressTracking = () => {
    console.log('📊 Stopping progress tracking');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Complete reset function
  const resetPlayer = () => {
    console.log('🔄 Resetting player completely');
    
    try {
      speechSynthesis.cancel();
    } catch (error) {
      console.log('Reset cancel error:', error);
    }
    
    setIsPlaying(false);
    setCurrentTime(0);
    pausedTimeRef.current = 0;
    utteranceRef.current = null;
    stopProgressTracking();
    setError(null);
    
    // Wait a moment for speech synthesis to fully reset
    return new Promise(resolve => setTimeout(resolve, 200));
  };

  // Main play/pause handler
  const handlePlayPause = async () => {
    console.log('🎵 Play/Pause button clicked! Current state:', { 
      isPlaying, 
      ttsSupported, 
      isInitialized,
      speaking: speechSynthesis.speaking,
      paused: speechSynthesis.paused 
    });
    
    // Clear any previous errors
    setError(null);

    // Check if initialized
    if (!isInitialized) {
      setError('Player is still initializing, please wait...');
      return;
    }

    // Check if TTS is supported
    if (!ttsSupported) {
      const errorMsg = 'Text-to-speech is not supported in your browser. Please try Chrome, Edge, or Safari.';
      setError(errorMsg);
      console.log('❌', errorMsg);
      return;
    }

    // Check if transcript exists
    if (!episode.transcript) {
      const errorMsg = 'No transcript available for this episode.';
      setError(errorMsg);
      console.log('❌', errorMsg);
      return;
    }

    try {
      if (isPlaying) {
        // PAUSE
        console.log('⏸️ Pausing speech...');
        
        if (speechSynthesis.speaking && !speechSynthesis.paused) {
          speechSynthesis.pause();
          pausedTimeRef.current += Date.now() - startTimeRef.current;
          stopProgressTracking();
          setIsPlaying(false);
          console.log('⏸️ Speech paused successfully');
        }
      } else {
        // PLAY
        console.log('▶️ Starting/resuming speech...');
        
        // If speech is paused, resume it
        if (speechSynthesis.paused && utteranceRef.current) {
          console.log('▶️ Resuming paused speech');
          speechSynthesis.resume();
          startTimeRef.current = Date.now();
          startProgressTracking(duration);
          setIsPlaying(true);
          return;
        }

        // Start completely new speech
        console.log('🚀 Starting completely new speech synthesis');
        
        // First, reset everything
        await resetPlayer();
        
        // Wait a bit more for complete reset
        setTimeout(() => {
          if (isCleanedUpRef.current) return;
          
          try {
            // Create new utterance
            const newUtterance = new SpeechSynthesisUtterance(episode.transcript);
            
            // Configure utterance
            newUtterance.lang = 'sv-SE';
            newUtterance.rate = 0.8;
            newUtterance.pitch = 1;
            newUtterance.volume = 1;

            // Try to get Swedish voice
            const swedishVoice = getSwedishVoice();
            if (swedishVoice) {
              newUtterance.voice = swedishVoice;
            }

            // Set up event handlers
            newUtterance.onstart = () => {
              if (isCleanedUpRef.current) return;
              console.log('🎵 Speech started successfully');
              setIsPlaying(true);
              setError(null);
              
              // Start progress tracking
              const estimatedDuration = estimateDuration(episode.transcript || '');
              startProgressTracking(estimatedDuration);
            };

            newUtterance.onend = () => {
              if (isCleanedUpRef.current) return;
              console.log('🎵 Speech ended');
              setIsPlaying(false);
              stopProgressTracking();
              setCurrentTime(duration);
            };

            newUtterance.onerror = (event) => {
              if (isCleanedUpRef.current) return;
              console.log('❌ Speech error:', event.error);
              
              // Don't show error for "interrupted" or "canceled" - these are normal
              if (event.error !== 'interrupted' && event.error !== 'canceled') {
                setError(`Speech error: ${event.error}`);
              }
              
              setIsPlaying(false);
              stopProgressTracking();
            };

            newUtterance.onpause = () => {
              if (isCleanedUpRef.current) return;
              console.log('⏸️ Speech paused (event)');
              setIsPlaying(false);
            };

            newUtterance.onresume = () => {
              if (isCleanedUpRef.current) return;
              console.log('▶️ Speech resumed (event)');
              setIsPlaying(true);
            };

            // Store utterance reference
            utteranceRef.current = newUtterance;

            // Start speaking
            console.log('🚀 Calling speechSynthesis.speak()');
            speechSynthesis.speak(newUtterance);
            
            // Force state update immediately
            setIsPlaying(true);
            
          } catch (innerError) {
            if (isCleanedUpRef.current) return;
            console.log('❌ Error in delayed speech start:', innerError);
            setError(`Error starting speech: ${innerError}`);
            setIsPlaying(false);
          }
        }, 300); // Increased delay for better reset
      }
    } catch (error) {
      console.log('❌ Error in handlePlayPause:', error);
      setError(`Error: ${error}`);
      setIsPlaying(false);
      stopProgressTracking();
    }
  };

  const handleStop = async () => {
    console.log('🛑 Stop clicked');
    await resetPlayer();
  };

  const handleSkipBack = () => {
    console.log('⏪ Skip back clicked');
    handleStop();
  };

  const handleClose = async () => {
    console.log('❌ Close clicked');
    await resetPlayer();
    onClose();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // For TTS, we can't really seek, so this is just visual feedback
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    console.log('📊 Progress clicked, would seek to:', newTime);
    // Note: TTS doesn't support seeking, so we just show visual feedback
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  // Check if player is ready
  const isReady = isInitialized && ttsSupported && episode.transcript;

  return (
    <div className="card overflow-hidden max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0">
        <h2 className="font-semibold text-lg dark:text-neutral-100">Podcast Player</h2>
        <button 
          onClick={handleClose}
          className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors"
          title="Close and stop audio"
        >
          <X size={18} className="text-neutral-500 dark:text-neutral-400" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Episode Info */}
        <div className="p-4">
          <div className="flex gap-4 mb-4">
            <img 
              src={episode.imageUrl} 
              alt={episode.title}
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1 break-words dark:text-neutral-100">{episode.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-2 break-words">{episode.description}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(episode.difficulty)}`}>
                  {episode.difficulty}
                </span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {duration > 0 ? formatTime(duration) : episode.duration}
                </span>
              </div>
            </div>
          </div>

          {/* Initialization Loading */}
          {!isInitialized && (
            <div className="bg-primary-100 dark:bg-primary-900 border border-primary-200 dark:border-primary-800 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-primary-700 dark:text-primary-300 text-sm">Initializing audio player...</p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-error-100 dark:bg-error-900 border border-error-200 dark:border-error-800 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-error-600 dark:text-error-400" />
                <p className="text-error-700 dark:text-error-300 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* TTS Not Supported Warning */}
          {isInitialized && !ttsSupported && (
            <div className="bg-warning-100 dark:bg-warning-900 border border-warning-200 dark:border-warning-800 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-warning-600 dark:text-warning-400" />
                <div>
                  <p className="text-warning-700 dark:text-warning-300 text-sm font-medium">Audio Not Available</p>
                  <p className="text-warning-600 dark:text-warning-400 text-xs">Your browser doesn't support text-to-speech. Try Chrome, Edge, or Safari.</p>
                </div>
              </div>
            </div>
          )}

          {/* No Transcript Warning */}
          {isInitialized && ttsSupported && !episode.transcript && (
            <div className="bg-warning-100 dark:bg-warning-900 border border-warning-200 dark:border-warning-800 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-warning-600 dark:text-warning-400" />
                <div>
                  <p className="text-warning-700 dark:text-warning-300 text-sm font-medium">No Audio Available</p>
                  <p className="text-warning-600 dark:text-warning-400 text-xs">This episode doesn't have a transcript for audio playback</p>
                </div>
              </div>
            </div>
          )}

          {/* Audio Controls */}
          <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 mb-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <div 
                className="w-full h-2 bg-neutral-200 dark:bg-neutral-600 rounded-full cursor-pointer"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-primary-500 rounded-full transition-all duration-100"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{duration > 0 ? formatTime(duration) : episode.duration}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={handleSkipBack}
                className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-full transition-colors"
                disabled={!isReady}
                title="Restart"
              >
                <SkipBack size={20} className={isReady ? "text-neutral-600 dark:text-neutral-300" : "text-neutral-400 dark:text-neutral-600"} />
              </button>
              
              {/* MAIN PLAY/PAUSE BUTTON */}
              <button 
                onClick={handlePlayPause}
                className={`
                  w-16 h-16 rounded-full transition-all duration-200 transform
                  flex items-center justify-center
                  ${!isReady
                    ? 'bg-neutral-400 cursor-not-allowed opacity-50' 
                    : 'bg-primary-500 hover:bg-primary-600 hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:shadow-xl'
                  }
                  focus:outline-none focus:ring-4 focus:ring-primary-300
                `}
                disabled={!isReady}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                <div className="flex items-center justify-center w-full h-full">
                  {isPlaying ? (
                    <Pause size={24} className="text-white" />
                  ) : (
                    <Play size={24} className="text-white" style={{ marginLeft: '2px' }} />
                  )}
                </div>
              </button>
              
              <button 
                onClick={handleStop}
                className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-full transition-colors"
                disabled={!isReady}
                title="Stop"
              >
                <SkipForward size={20} className={isReady ? "text-neutral-600 dark:text-neutral-300" : "text-neutral-400 dark:text-neutral-600"} />
              </button>
            </div>

            {/* Status Info */}
            <div className="mt-3 text-center">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {!isInitialized ? (
                  '⏳ Initializing...'
                ) : isReady ? (
                  <>
                    🎧 Swedish pronunciation available
                    {isPlaying && ' - Currently playing'}
                    {speechSynthesis.paused && ' - Paused'}
                  </>
                ) : (
                  '⚠️ Swedish audio not available'
                )}
              </p>
            </div>
          </div>

          {/* Transcript Toggle */}
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full flex items-center justify-center gap-2 p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <FileText size={18} className="text-neutral-600 dark:text-neutral-300" />
            <span className="dark:text-neutral-100">{showTranscript ? 'Hide' : 'Show'} Transcript</span>
          </button>

          {/* Transcript */}
          <AnimatePresence>
            {showTranscript && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-600">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium dark:text-neutral-100">Transcript</h4>
                    {isReady && (
                      <button
                        onClick={handlePlayPause}
                        className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 font-medium flex items-center gap-1 px-3 py-1 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-900 transition-colors"
                        disabled={!isInitialized}
                      >
                        <Volume2 size={14} />
                        <span>{isPlaying ? 'Playing...' : 'Read Aloud'}</span>
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap break-words">
                      {episode.transcript || 'Transcript not available for this episode.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PodcastPlayer;