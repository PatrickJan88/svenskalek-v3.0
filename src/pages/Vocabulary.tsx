import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, Trash2, VolumeX } from 'lucide-react';
import { useVocabulary } from '../hooks/useVocabulary';

const Vocabulary: React.FC = () => {
  const navigate = useNavigate();
  const { savedWords, removeWord, isLoaded } = useVocabulary();
  
  // TTS state
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize TTS
  useEffect(() => {
    console.log('🎤 Vocabulary: Initializing TTS...');
    
    const initializeTTS = () => {
      try {
        if (!('speechSynthesis' in window)) {
          console.log('❌ Vocabulary: SpeechSynthesis not available');
          setTtsSupported(false);
          setIsInitialized(true);
          return;
        }

        console.log('✅ Vocabulary: SpeechSynthesis available');
        setTtsSupported(true);

        const loadVoices = () => {
          const voices = speechSynthesis.getVoices();
          console.log(`🎤 Vocabulary: Loaded ${voices.length} voices`);
          setAvailableVoices(voices);
          setIsInitialized(true);
        };

        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          loadVoices();
        } else {
          speechSynthesis.addEventListener('voiceschanged', loadVoices);
          setTimeout(() => {
            if (!isInitialized) {
              loadVoices();
            }
          }, 2000);
        }

      } catch (error) {
        console.log('❌ Vocabulary: TTS initialization error:', error);
        setTtsSupported(false);
        setIsInitialized(true);
      }
    };

    initializeTTS();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      try {
        speechSynthesis.cancel();
      } catch (error) {
        console.log('Vocabulary cleanup error:', error);
      }
    };
  }, []);

  // Get Swedish voice
  const getSwedishVoice = (): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) return null;

    // Look for Swedish voices
    const swedishVoices = availableVoices.filter(voice => 
      voice.lang.toLowerCase().includes('sv') || 
      voice.name.toLowerCase().includes('swedish') ||
      voice.name.toLowerCase().includes('svenska')
    );
    
    if (swedishVoices.length > 0) {
      return swedishVoices[0];
    }
    
    // Fallback to Nordic voices
    const nordicVoices = availableVoices.filter(voice => 
      voice.lang.toLowerCase().includes('no') || 
      voice.lang.toLowerCase().includes('da')
    );
    
    if (nordicVoices.length > 0) {
      return nordicVoices[0];
    }
    
    // Return default voice
    return availableVoices[0] || null;
  };

  const stopCurrentSpeech = () => {
    try {
      speechSynthesis.cancel();
      setCurrentlyPlaying(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      utteranceRef.current = null;
    } catch (error) {
      console.log('Error stopping speech:', error);
    }
  };

  const playPronunciation = async (word: string) => {
    console.log('🎵 Vocabulary: Playing pronunciation for:', word);
    
    if (!isInitialized) {
      console.log('❌ Vocabulary: TTS not initialized yet');
      return;
    }
    
    if (!ttsSupported) {
      console.log('❌ Vocabulary: TTS not supported');
      return;
    }
    
    // If this word is already playing, stop it
    if (currentlyPlaying === word) {
      console.log('🛑 Vocabulary: Stopping current speech');
      stopCurrentSpeech();
      return;
    }
    
    // Stop any other speech
    stopCurrentSpeech();
    
    try {
      // Wait a moment for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('🚀 Vocabulary: Starting speech synthesis for:', word);
      
      const utterance = new SpeechSynthesisUtterance(word);
      
      // Configure for Swedish
      utterance.lang = 'sv-SE';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Set Swedish voice if available
      const voice = getSwedishVoice();
      if (voice) {
        utterance.voice = voice;
        console.log('🎤 Vocabulary: Using voice:', voice.name);
      }
      
      // Event handlers
      utterance.onstart = () => {
        console.log('🎵 Vocabulary: Speech started for:', word);
        setCurrentlyPlaying(word);
      };
      
      utterance.onend = () => {
        console.log('🎵 Vocabulary: Speech ended for:', word);
        setCurrentlyPlaying(null);
        utteranceRef.current = null;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
      
      utterance.onerror = (event) => {
        console.log('❌ Vocabulary: Speech error:', event.error);
        setCurrentlyPlaying(null);
        utteranceRef.current = null;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
      
      // Store reference
      utteranceRef.current = utterance;
      
      // Start speaking
      speechSynthesis.speak(utterance);
      setCurrentlyPlaying(word);
      
      // Timeout fallback
      timeoutRef.current = setTimeout(() => {
        console.log('⏰ Vocabulary: Speech timeout for:', word);
        setCurrentlyPlaying(null);
        utteranceRef.current = null;
        timeoutRef.current = null;
      }, Math.max(2000, word.length * 150));
      
    } catch (error) {
      console.log('❌ Vocabulary: Error in playPronunciation:', error);
      setCurrentlyPlaying(null);
    }
  };

  const handleRemoveWord = (wordId: number) => {
    if (confirm('Are you sure you want to remove this word from your vocabulary?')) {
      removeWord(wordId);
    }
  };

  // Show loading state while data is being loaded
  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 max-w-md">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors mr-2"
          >
            <ArrowLeft size={24} className="text-primary-500 dark:text-primary-400" />
          </button>
          <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-300">My Vocabulary</h1>
        </div>
        <div className="card p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-300">Loading your vocabulary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-md">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors mr-2"
        >
          <ArrowLeft size={24} className="text-primary-500 dark:text-primary-400" />
        </button>
        <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-300">My Vocabulary</h1>
      </div>

      {savedWords.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="bg-neutral-100 dark:bg-neutral-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-lg font-semibold mb-2 dark:text-neutral-100">No words saved yet</h3>
          <p className="text-neutral-600 dark:text-neutral-300 mb-4">
            Start exploring and add words to build your vocabulary!
          </p>
          <button
            onClick={() => navigate('/explore')}
            className="btn-primary"
          >
            Explore Words
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 text-center">
            <p className="text-neutral-600 dark:text-neutral-300">
              You have learned <span className="font-bold text-primary-700 dark:text-primary-300">{savedWords.length}</span> words
            </p>
          </div>
          
          <div className="space-y-4">
            {savedWords.map((word) => {
              const isPlaying = currentlyPlaying === word.word;
              const canPlay = isInitialized && ttsSupported;
              
              return (
                <div key={word.id} className="card overflow-hidden">
                  <div className="flex">
                    <img 
                      src={word.imageUrl} 
                      alt={word.word}
                      className="w-24 h-24 object-cover"
                    />
                    <div className="flex-1 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300">{word.word}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => playPronunciation(word.word)}
                            disabled={!canPlay}
                            className={`p-2 rounded-full transition-all duration-200 ${
                              !canPlay
                                ? 'opacity-50 cursor-not-allowed bg-neutral-100 dark:bg-neutral-700'
                                : isPlaying
                                  ? 'bg-error-100 dark:bg-error-900 hover:bg-error-200 dark:hover:bg-error-800 scale-110'
                                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:scale-110'
                            }`}
                            title={
                              !isInitialized ? 'Loading audio...' :
                              !ttsSupported ? 'Audio not supported in this browser' :
                              isPlaying ? 'Click to stop' : 'Click to hear pronunciation'
                            }
                          >
                            {!canPlay ? (
                              <VolumeX size={18} className="text-neutral-400 dark:text-neutral-600" />
                            ) : isPlaying ? (
                              <VolumeX size={18} className="text-error-600 dark:text-error-400" />
                            ) : (
                              <Volume2 size={18} className="text-primary-500 dark:text-primary-400" />
                            )}
                          </button>
                          <button
                            onClick={() => handleRemoveWord(word.id)}
                            className="p-2 hover:bg-error-100 dark:hover:bg-error-900 rounded-full transition-colors"
                          >
                            <Trash2 size={18} className="text-error-500 dark:text-error-400" />
                          </button>
                        </div>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-300 text-sm">{word.translation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Vocabulary;